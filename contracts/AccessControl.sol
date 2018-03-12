pragma solidity ^0.4.18;


import "./Helpers.sol";


contract AccessControl is Helpers {


    address public owner;

    event OwnershipTransferred(address indexed _from, address indexed _to);

    function AccessControl() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0));
        owner = _newOwner;
    }
}