pragma solidity ^0.4.18;
import "./AccessControl.sol";

pragma experimental ABIEncoderV2;

contract VirtualAccounts is AccessControl {

    struct VirtualAccount {
        bytes32 virtualAccountNumber;
        address borrowerAddress;
        address lenderAddress;
        uint[] policyDetails;
        string bankAccountNumber;
        string ifscCode;
    }

    VirtualAccount[] public virtualAccounts;
    
    // -------------------------------------------------------------------------
    // To keep the position of any virtual account in the virtualaccounts array
    // key: bytes32 - bytes32 representation of the virtual account
    // value: uint256 - index of the VirtualAccount struct in virtualaccounts array
    // -------------------------------------------------------------------------
    mapping(bytes32 => uint32) public virtualAccountsToIndex;
    
    
    function updateVirtualAccountConfiguration(
        string _virtualAccountNumber, 
        uint256[] _policyDetails,
        address _borrower,
        address _lender,
        string _bankAccountNumber,
        string _ifscCode
    ) public onlyOwner returns (bool) {
        bytes32 virtualAccountNumberBytes = _stringToBytes32(_virtualAccountNumber);
        VirtualAccount memory va = VirtualAccount({
            virtualAccountNumber: virtualAccountNumberBytes,
            borrowerAddress: _borrower,
            lenderAddress: _lender,
            policyDetails: _policyDetails,
            bankAccountNumber: _bankAccountNumber,
            ifscCode: _ifscCode
        });
        uint32 index = uint32(virtualAccounts.push(va) - 1);
        virtualAccountsToIndex[virtualAccountNumberBytes] = index;
    }
    
    function getAllVirtualAccounts() public view returns(VirtualAccount[]) {
        return virtualAccounts;
    }
   
}
