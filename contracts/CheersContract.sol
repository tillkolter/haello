pragma solidity ^0.4.17;

contract CheersContract {

    enum ActivityType {Drinks, Tickets, Food}

    address spender;

    address[] candidates;

    address[] profiteers;

    address[] cashedOut;

    mapping (address => uint8) userStates;

    ActivityType[] activities;

    uint maxCandidates;

    uint firstContactBudget;

    function CheersContract(uint _maxCandidates, uint _firstContactReward, ActivityType[] _activities) public payable {
        // msg.value should be more than first contact reward times the candidates maximum
        require(_maxCandidates == 0 || msg.value > _firstContactReward * _maxCandidates);

        spender = msg.sender;
        maxCandidates = _maxCandidates;
        firstContactBudget = _firstContactReward * _maxCandidates;
        activities = _activities;
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

    function setActivities(ActivityType[] _activities) public {
        require(msg.sender == spender);
        activities = _activities;
    }

    function addCandidate(address candidate) public {
        require(candidate != spender);
        require(isOpen());
        require(userStates[candidate] == 0);

        candidates.push(candidate);
        userStates[candidate] = 1;
        candidate.transfer(1 ether / 10000);
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

    function kill() public {
        require(msg.sender == spender);
        selfdestruct(spender);
    }
}