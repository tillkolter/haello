pragma solidity ^0.4.18;


contract UserLocation {

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

    address public owner;

    mapping (address => LocationUser) private locations;

    mapping (address => CheersItem) private cheersContracts;
    address[] cheersIndex;

    mapping (bytes32 => address[]) private geohashUsers;

    mapping (bytes32 => uint) private populationSizes;


    event LogNewLocation(address indexed userAddress, bytes32 lat, bytes32 lon, bytes32 geohash);

    event LogDeleteLocation(address indexed userAddress, uint index, uint size);

    function UserLocation() public {
        owner = msg.sender;
    }

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
        //        if (hasLocation(msg.sender)) {
        //            deleteLocation();
        //        }

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
        require(hasLocation(msg.sender));
        uint rowToDelete = locations[msg.sender].index;
        bytes32 geohash = locations[msg.sender].geohash;
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
        return cheersIndex[locations[_owner].contractIndex] == locations[_owner].spendingContract;
    }

    function getSpendingOffer(address _owner) public constant returns (address) {
        require(isSpending(_owner));
        return cheersIndex[locations[_owner].contractIndex];
    }

    function setSpendingOffer(address contractAddress) public returns (bool){
        require(msg.sender == owner);
        cheersIndex.push(contractAddress);
        locations[msg.sender].contractIndex = cheersIndex.length - 1;
        locations[msg.sender].spendingContract = contractAddress;
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
