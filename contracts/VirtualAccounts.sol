pragma solidity ^0.4.18;

import "./AccessControl.sol";


contract VirtualAccounts is AccessControl {


    struct VirtualAccount {
        bytes32 virtualAccountNumber;
        address borrowerAddress;
        address lenderAddress;
        uint[] policyDetails;
        bytes32 bankAccountNumber;
        bytes32 ifscCode;
    }

    // -------------------------------------------------------------------------
    // To keep track of all virtual accounts created
    // -------------------------------------------------------------------------
    VirtualAccount[] public virtualAccounts;

    // -------------------------------------------------------------------------
    // To keep the position of any virtual account in the virtualaccounts array
    // key: bytes32 - bytes32 representation of the virtual account
    // value: uint32 - index of the VirtualAccount struct in virtualaccounts array
    // -------------------------------------------------------------------------
    mapping(bytes32 => uint32) public virtualAccountsToIndex;

    function updateVirtualAccountConfiguration(
        string _virtualAccountNumber,
        uint256[] _policyDetails,
        address _borrower,
        address _lender,
        string _bankAccountNumber,
        string _ifscCode
    ) public onlyOwner returns (uint32) {
        bytes32 virtualAccountNumberBytes = _stringToBytes32(_virtualAccountNumber);
        VirtualAccount memory va = VirtualAccount({
            virtualAccountNumber: virtualAccountNumberBytes,
            borrowerAddress: _borrower,
            lenderAddress: _lender,
            policyDetails: _policyDetails,
            bankAccountNumber: _stringToBytes32(_bankAccountNumber),
            ifscCode: _stringToBytes32(_ifscCode)
            });
        uint32 index = uint32(virtualAccounts.push(va) - 1);
        virtualAccountsToIndex[virtualAccountNumberBytes] = index;
        return index;
    }

    function getTotalVirtualAccounts() public view returns (uint) {
        return virtualAccounts.length - 1;
    }

    function getVirtualAccount(uint32 id) public view returns(
        string virtualAccountNumber,
        address borrowerAddress,
        address lenderAddress,
        uint[] policyDetails,
        string bankAccountNumber,
        string ifscCode
    ) {
        VirtualAccount memory va = virtualAccounts[id];
        virtualAccountNumber = _bytes32ToString(va.virtualAccountNumber);
        borrowerAddress = va.borrowerAddress;
        lenderAddress = va.lenderAddress;
        policyDetails = va.policyDetails;
        bankAccountNumber = _bytes32ToString(va.bankAccountNumber);
        ifscCode = _bytes32ToString(va.ifscCode);
    }
}
