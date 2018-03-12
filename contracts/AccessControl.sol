pragma solidity 0.4.20;


import "./Helpers.sol";


contract AccessControl is Helpers {


    address public owner;

    function AccessControl() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}