
contract Owned {

    address public owner;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function Owned() public {
        owner = msg.sender;
    }

    function getOwner() public returns (address) {
        return owner;
    }
}