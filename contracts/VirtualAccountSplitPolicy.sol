pragma solidity 0.4.20;

import "./AccessControl.sol";

contract VirtualAccountSplitPolicy is AccessControl {

    mapping(bytes32 => address) VirtualAccountSplitPolicyContractMapping;

    function addNewSplitPolicy(string virtual_account_number, address split_contract_address) public onlyOwner returns (bool) {
        // check that no address has been set previously

        bytes32 virtual_account_number_bytes = _stringToBytes32(virtual_account_number);

        require(split_contract_address != address(0));
        require(isContract(split_contract_address));

        require(VirtualAccountSplitPolicyContractMapping[virtual_account_number_bytes] == address(0));

        VirtualAccountSplitPolicyContractMapping[virtual_account_number_bytes] = split_contract_address;

        return true;
    }

    function updateSplitPolicy(string virtual_account_number, address split_contract_address) public onlyOwner returns (bool) {
        bytes32 virtual_account_number_bytes = _stringToBytes32(virtual_account_number);

        require(split_contract_address != address(0));
        require(isContract(split_contract_address));
        require(VirtualAccountSplitPolicyContractMapping[virtual_account_number_bytes] != split_contract_address);

        VirtualAccountSplitPolicyContractMapping[virtual_account_number_bytes] = split_contract_address;
    }

    function getSplitPolicyAddress(string virtual_account_number) public view returns (address) {
        bytes32 virtual_account_number_bytes = _stringToBytes32(virtual_account_number);
        return VirtualAccountSplitPolicyContractMapping[virtual_account_number_bytes];
    }
}