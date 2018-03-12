pragma solidity ^0.4.18;


import "./VirtualAccountSplitPolicy.sol";


contract IncomingTransaction is VirtualAccountSplitPolicy {

    struct Transaction {
        string transaction_id;
        string recipient_account_number;
        uint256 amount;
        string remitter_name;
        string remitter_account;
        string transaction_reference_number;
        string virtual_account_number;
        string mode;
        string transaction_date;
        uint64 timestamp;
    }

    Transaction[] internal transactions;

    mapping(bytes32 => uint256) public TransactionIDToIndex;

    mapping(bytes32 => uint256) public TransactionReferenceNumberToIndex;

    function IncomingTransaction() public {
        owner = msg.sender;
    }

    function newIncomingTransaction(
        string transaction_id,
        string recipient_account_number,
        uint256 amount,
        string remitter_name,
        string remitter_account,
        string transaction_reference_number,
        string virtual_account_number,
        string mode,
        string transaction_date
    ) public onlyOwner returns (uint256) {
        bytes32 transaction_id_bytes = _stringToBytes32(transaction_id);
        bytes32 transaction_reference_number_bytes = _stringToBytes32(transaction_reference_number);

        require(TransactionIDToIndex[transaction_id_bytes] <= 0);
        require(TransactionReferenceNumberToIndex[transaction_reference_number_bytes] <= 0);

        Transaction memory txn = Transaction({
            transaction_id : transaction_id,
            recipient_account_number : recipient_account_number,
            amount : amount,
            remitter_name : remitter_name,
            remitter_account : remitter_account,
            transaction_reference_number : transaction_reference_number,
            virtual_account_number : virtual_account_number,
            mode : mode,
            transaction_date : transaction_date,
            timestamp : uint64(now)
            });

        uint256 txnId = transactions.push(txn) - 1;

        TransactionIDToIndex[transaction_id_bytes] = txnId;
        TransactionReferenceNumberToIndex[transaction_reference_number_bytes] = txnId;

        // generate amount equivalent to sent amount in borrowers account

        return txnId;
    }
}