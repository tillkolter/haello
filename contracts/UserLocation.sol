pragma solidity ^0.4.17;

import './stringUtils.sol';

contract UserLocation {

    struct LocationUser {
    bytes32 latitude;
    bytes32 longitude;
    string geohash;
    address user;
    }

    address owner;

    mapping (address => LocationUser) locations;

    mapping (string => LocationUser[]) geohashUsers;

    function UserLocation() public {
        owner = msg.sender;
    }

    function setLocation(bytes32 latitude, bytes32 longitude, string geohash) public returns (bool) {
        LocationUser storage userLocation = locations[msg.sender];
        // If the user location has been tracked but the geohash changed
        LocationUser[] storage users = geohashUsers[geohash];
        if (!StringUtils.equal(userLocation.geohash, "")
            && !StringUtils.equal(userLocation.geohash, geohash)) {
            for (uint i = 0; i < users.length; i++) {
                if (users[i].user == msg.sender) {
                    delete users[i];
                }
            }
        }

        userLocation.latitude = latitude;
        userLocation.longitude = longitude;
        userLocation.geohash = geohash;
        userLocation.user = msg.sender;
        users.push(userLocation);
        locations[msg.sender] = userLocation;
        return true;
    }

    function getGeohash() public constant returns (string) {
         return locations[msg.sender].geohash;
    }

    function getLatitude() public constant returns (bytes32) {
        return locations[msg.sender].latitude;
    }

    function getLongitude() public constant returns (bytes32) {
        return locations[msg.sender].longitude;
    }

    function getLocation() public constant returns (bytes32, bytes32, string) {
        LocationUser l = locations[msg.sender];
        return (l.latitude, l.longitude, l.geohash);
    }

    function getUsers(string geohash) public constant returns (LocationUser[]) {
        return geohashUsers[geohash];
    }

    function kill() public {
        require(owner == msg.sender);
        selfdestruct(owner);
    }
}
