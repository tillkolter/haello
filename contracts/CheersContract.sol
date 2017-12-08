pragma solidity ^0.4.17;

contract CheersContract {

    enum ActivityType {Drinks, Tickets, Food}

    address public spender;

    address[] candidates;

    address[] profiteers;

    address[] cashedOut;

    mapping (address => int) userStates;

    ActivityType public activity;

    uint public maxCandidates;

    uint public firstContactBudget;

    function CheersContract(uint _maxCandidates, uint _firstContactReward, ActivityType _activity) public payable {
        // msg.value should be more than first contact reward times the candidates maximum
        require(_maxCandidates == 0 || msg.value > _firstContactReward * _maxCandidates);

        spender = msg.sender;
        maxCandidates = _maxCandidates;
        firstContactBudget = _firstContactReward * _maxCandidates;
        activity = _activity;
    }

    function getCompensation() constant public returns (uint) {
        return this.balance - firstContactBudget;
    }

    function isOpen() constant public returns (bool) {
        return candidates.length + profiteers.length < maxCandidates;
    }

    function addAmount() public payable {
        require(msg.sender == spender);
    }

    function setActivity(ActivityType _activity) public {
        require(msg.sender == spender);
        activity = _activity;
    }

    function addCandidate(address candidate) public returns (bool){
        require(candidate != spender);
        require(isOpen());
        require(userStates[candidate] == 0);

        candidates.push(candidate);
        userStates[candidate] = 1;
        candidate.transfer(1 ether / 10000);
        return true;
    }

    function addProfiteer(address _profiteer) public {
        require(msg.sender == spender);
        require(isOpen() || userStates[_profiteer] == 1);
        require(userStates[_profiteer] < 2);

        profiteers.push(_profiteer);
        userStates[_profiteer] = 2;
    }

    function cashOut() public returns (bool) {
        require(msg.sender == spender);
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
        // require(msg.sender == spender || msg.sender == userAddress);
        return userStates[userAddress] != 1;
    }

    function getCandidates() public constant returns (address[]) {
        require(msg.sender == spender);
        return candidates;
    }

    function getCandidatesCount() public constant returns (uint) {
        return candidates.length;
    }

    function kill() public {
        require(msg.sender == spender);
        selfdestruct(spender);
    }
}