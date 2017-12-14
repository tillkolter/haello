pragma solidity ^0.4.18;

import "./Owned.sol";

contract UserLocation is Owned {

    struct LocationUser {
    bytes32 latitude;
    bytes32 longitude;
    bytes32 geohash;
    address user;
    uint index;
    address spendingContract;
    uint contractIndex;
    }

    struct CheersItem {
    address contractAddress;
    uint index;
    }

    mapping (address => LocationUser) private locations;

    mapping (address => CheersItem) private cheersContracts;
    address[] cheersIndex;

    mapping (bytes32 => address[]) private geohashUsers;

    mapping (bytes32 => uint) private populationSizes;


    event LogNewLocation(address indexed userAddress, bytes32 lat, bytes32 lon, bytes32 geohash);

    event LogDeleteLocation(address indexed userAddress, uint index, uint size);

    function hasLocation(address userAddress) public constant returns (bool) {
        if (geohashUsers[locations[userAddress].geohash].length == 0) return false;
        return (geohashUsers[locations[userAddress].geohash][locations[userAddress].index] == userAddress);
    }

    function getPopulationSize(bytes32 geohash) private returns (uint) {
        uint size = populationSizes[geohash];
        if (size == 0) {
            size = 1;
        }
        return size - 1;
    }

    function incrementPopulationSize(bytes32 geohash) private returns (uint) {
        uint size = populationSizes[geohash];
        if (size == 0) {
            size = 2;
        }
        else {
            size++;
        }
        populationSizes[geohash] = size;
        return size - 1;
    }

    function decrementPopulationSize(bytes32 geohash) private returns (uint) {
        uint size = populationSizes[geohash];
        require(size > 1);
        populationSizes[geohash] = size - 1;
        return size - 1;
    }

    function setLocation(bytes32 latitude, bytes32 longitude, bytes32 geohash) public returns (bool) {
        locations[msg.sender].latitude = latitude;
        locations[msg.sender].longitude = longitude;
        locations[msg.sender].geohash = geohash;
        locations[msg.sender].user = msg.sender;

        uint size = getPopulationSize(geohash);
        if (geohashUsers[geohash].length == size) {
            geohashUsers[geohash].length++;
        }

        geohashUsers[geohash][size] = msg.sender;
        locations[msg.sender].index = size;
        incrementPopulationSize(geohash);
        LogNewLocation(msg.sender, latitude, longitude, geohash);
        return true;
    }

    function deleteLocation() public returns (uint) {
        require(hasLocation(tx.origin));
        uint rowToDelete = locations[tx.origin].index;
        bytes32 geohash = locations[tx.origin].geohash;
        address keyToMove = geohashUsers[geohash][geohashUsers[geohash].length - 1];
        geohashUsers[geohash][rowToDelete] = keyToMove;
        locations[keyToMove].index = rowToDelete;

        uint newSize = decrementPopulationSize(geohash);
        LogDeleteLocation(msg.sender, rowToDelete, newSize);
        return rowToDelete;
    }

    function getLocation() public constant returns (bytes32, bytes32, bytes32) {
        LocationUser storage l = locations[msg.sender];
        return (l.latitude, l.longitude, l.geohash);
    }

    function getUserLocation(address user) public constant returns (bytes32, bytes32, bytes32) {
        require(hasLocation(user));
        LocationUser storage l = locations[user];
        return (l.latitude, l.longitude, l.geohash);
    }

    function isSpending(address _owner) public constant returns (bool) {
        if (cheersIndex.length == 0) return false;
        bool isSpending = cheersIndex[locations[_owner].contractIndex] == locations[_owner].spendingContract;
        return isSpending && CheersContract(locations[_owner].spendingContract).owner() == _owner;
    }

    function getSpendingOffer(address _owner) public constant returns (address) {
        require(isSpending(_owner));
        return cheersIndex[locations[_owner].contractIndex];
    }

    function setSpendingOffer(address contractAddress) public returns (bool){
        // Checking the requirements is not so strict about the
        // ownership of the offer contract due to the fact this
        // method is called from the offer constructor (to avoid
        // requiring a two staged process in the client, for
        // contract creation and registration) and at the construction
        // runtime the contract can not be retrieved yet to check the owner
        //
        // To secure the behavior, the getter requires that the
        // requesting user has a spending contract
        require(!isSpending(tx.origin));
        cheersIndex.push(contractAddress);
        locations[tx.origin].contractIndex = cheersIndex.length - 1;
        locations[tx.origin].spendingContract = contractAddress;
        return true;
    }

    function getUsers(bytes32 geohash) public constant returns (address[]) {
        return geohashUsers[geohash];
    }

    function kill() public {
        require(owner == msg.sender);
        selfdestruct(owner);
    }
}


contract CheersContract is Owned {

    enum ActivityType {Drinks, Tickets, Food}

    address[] candidates;

    address[] profiteers;

    address[] cashedOut;

    mapping (address => int) userStates;

    ActivityType public activity;

    uint public maxCandidates;

    uint public firstContactBudget;

    address userContract;

    function CheersContract(uint _maxCandidates, uint _firstContactReward, ActivityType _activity, address _userContract) public payable {
        // msg.value should be more than first contact reward times the candidates maximum
        require(_maxCandidates == 0 || msg.value > _firstContactReward * _maxCandidates);

        owner = tx.origin;
        maxCandidates = _maxCandidates;
        firstContactBudget = _firstContactReward * _maxCandidates;
        activity = _activity;
        userContract = _userContract;
        UserLocation(userContract).setSpendingOffer(address(this));
    }

    function setUserContract(address contractAddress) public {
        userContract = contractAddress;
    }

    function getCompensation() constant public returns (uint) {
        return this.balance - firstContactBudget;
    }

    function isOpen() constant public returns (bool) {
        return candidates.length + profiteers.length < maxCandidates;
    }

    function addAmount() public payable {
        require(msg.sender == owner);
    }

    function setActivity(ActivityType _activity) public {
        require(msg.sender == owner);
        activity = _activity;
    }

    function addCandidate(address candidate) public returns (bool) {
        require(candidate != owner);
        require(isOpen());
        require(userStates[candidate] == 0);

        candidates.push(candidate);
        userStates[candidate] = 1;
        candidate.transfer(firstContactBudget / maxCandidates);
        return true;
    }

    function addProfiteer(address _profiteer) public returns (bool) {
        require(msg.sender == owner);
        require(isOpen() || userStates[_profiteer] == 1);
        require(userStates[_profiteer] < 2);

        profiteers.push(_profiteer);
        userStates[_profiteer] = 2;
        return true;
    }

    function cashOut() public returns (bool) {
        require(msg.sender == owner);
        uint profiteersLength = profiteers.length;
        for (uint i = 0; i < profiteers.length; i++) {
            profiteers[i].transfer(getCompensation() / maxCandidates);
            cashedOut.push(profiteers[i]);
            userStates[profiteers[i]] = 3;
            delete profiteers[i];
        }
        maxCandidates -= profiteersLength;
        return true;
    }

    function isCandidate(address userAddress) public constant returns (bool) {
        require(msg.sender == owner || msg.sender == userAddress);
        return userStates[userAddress] == 1;
    }

    function isCashedOut(address userAddress) public constant returns (bool) {
        require(msg.sender == owner || msg.sender == userAddress);
        return userStates[userAddress] == 3;
    }

    function isProfiteer(address userAddress) public constant returns (bool) {
        require(msg.sender == owner || msg.sender == userAddress);
        return userStates[userAddress] == 2;
    }

    function getCandidates() public constant returns (address[]) {
        require(msg.sender == owner);
        return candidates;
    }

    function getProfiteers() public constant returns (address[]) {
        require(msg.sender == owner);
        return profiteers;
    }

    function getCashedOuts() public constant returns (address[]) {
        require(msg.sender == owner);
        return cashedOut;
    }

    function getCandidatesCount() public constant returns (uint) {
        return candidates.length;
    }

    function kill() public {
        require(msg.sender == owner);
        selfdestruct(owner);
    }
}
