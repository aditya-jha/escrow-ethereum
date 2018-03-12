pragma solidity 0.4.20;


contract Helpers {


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