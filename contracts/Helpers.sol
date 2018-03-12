pragma solidity ^0.4.18;


contract Helpers {

    function safeAdd(uint a, uint b) public pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }

    function safeSub(uint a, uint b) public pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }

    function safeMul(uint a, uint b) internal pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }

    function safeDiv(uint a, uint b) internal pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }

    function _stringToBytes32(string s) internal pure returns (bytes32 result) {
        if (bytes(s).length == 0) {
            return 0x0;
        }
        assembly {
            result := mload(add(s, 32))
        }
    }

    function isContract(address _base) internal view returns (bool _r) {
        assembly {
            _r := gt(extcodesize(_base), 0)
        }
    }
}