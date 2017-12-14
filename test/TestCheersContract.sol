import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/UserLocation.sol";


contract TestCheersContract {
    function testCreateCheersContract() {
        address cheers = new CheersContract(
            0,
            1000,
            CheersContract.ActivityType.Drinks,
            DeployedAddresses.UserLocation());
        Assert.equal(CheersContract(cheers).owner(), msg.sender, "What");

        UserLocation ul = UserLocation(DeployedAddresses.UserLocation());
        address offer = ul.getSpendingOffer(msg.sender);
        Assert.equal(cheers, offer, "Unexpected spending offer address");
    }

}