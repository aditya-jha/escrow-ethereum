pragma solidity ^0.4.18;

import "./IndifiCoin.sol";
import "./SplitContract.sol";
import "./VirtualAccounts.sol";


contract EscrowTransactions is VirtualAccounts {

    event NewTransaction(uint256 indexed transactionId, uint256 indexed amount);

    struct Transaction {
        bytes32 transactionHash;
        uint256 amount;
        bytes32 virtualAccountNumber;
        uint timestamp;
    }

    struct SplitTransaction {
        uint256 shareAmount;
        uint8 status;
    }

    Transaction[] public transactions;
    SplitTransaction[] public splitTransactions;

    IndifiCoin public indifiCoin;
    SplitContract public splitContract;

    // -------------------------------------------------------------------------
    // To keep the position of any transaction in the transactions array
    // key: bytes32 - bytes32 representation of the sha256 hash of the transaction
    // value: uint256 - index of the Transaction struct in transactions array
    // -------------------------------------------------------------------------
    mapping(bytes32 => uint256) public transactionHashToIndex;

    mapping(uint256 => uint256) public transactionIdToBorrowerSharesId;

    mapping(uint256 => uint256) public transactionIdToLenderSharesId;

    function EscrowTransactions() public {
        _createTransaction(0x0, 0, 0x0);
        updateVirtualAccountConfiguration("", new uint[](2), address(0), address(0), "", "");
    }

    function updateIndifiCoinAddress(address _indifiCoinAddress) public onlyOwner returns (bool) {
        indifiCoin = IndifiCoin(_indifiCoinAddress);
    }

    function updateSplitContractAddress(address _splitContractAddress) public onlyOwner returns (bool) {
        splitContract = SplitContract(_splitContractAddress);
    }

    function newEscrowTransaction(string _hash, uint256 amount, string _vAccNo) public onlyOwner returns (bool) {
        // check if this transaction is new by comparing hash
        bytes32 hashBytes = _stringToBytes32(_hash);
        bytes32 vAccNoBytes = _stringToBytes32(_vAccNo);

        require(transactionHashToIndex[hashBytes] <= 0);

        // create new Transaction object and save
        uint256 id = _createTransaction(hashBytes, amount, vAccNoBytes);

        // emit new transaction created
        NewTransaction(id, amount);

        // allocate coins equal to the amount into owners account
        indifiCoin.createTokens(amount);

        // get VirtualAccount
        VirtualAccount memory va = virtualAccounts[virtualAccountsToIndex[vAccNoBytes]];

        int256 lenderShare = splitContract.split(amount, va.policyDetails);
        if (lenderShare != - 1) {
            uint256 borrowerShare = safeSub(amount, uint256(lenderShare));
            indifiCoin.transferTokens(va.lenderAddress, uint256(lenderShare));
            indifiCoin.transferTokens(va.borrowerAddress, borrowerShare);

            uint256 borrowerShareId = _createSplitTransaction(borrowerShare);
            transactionIdToBorrowerSharesId[id] = borrowerShareId;

            uint256 lenderShareId = _createSplitTransaction(uint256(lenderShare));
            transactionIdToLenderSharesId[id] = lenderShareId;
        }

        return true;
    }

    function getTotalTransactions() public view returns (uint256) {
        return transactions.length - 1;
    }

    function getTransaction(uint256 id) public view returns (
        string transactionHash,
        uint256 amount,
        string virtualAccountNumber,
        uint256 borrowerShareId,
        uint256 lenderShareId
    ) {
        Transaction memory t = transactions[id];
        transactionHash = _bytes32ToString(t.transactionHash);
        amount = t.amount;
        virtualAccountNumber = _bytes32ToString(t.virtualAccountNumber);
        borrowerShareId = transactionIdToBorrowerSharesId[id];
        lenderShareId = transactionIdToLenderSharesId[id];
    }

    function updateSplitStatusToSentForSettlement(uint256[] ids) public returns (bool) {
        for (uint256 i = 0; i < ids.length; i++) {
            SplitTransaction memory st = splitTransactions[ids[i]];
            if (st.status == 1) {
                st.status = 2;
                splitTransactions[ids[i]] = st;
            }
        }
    }

    function updateSplitStatusToSettled(uint256[] ids) public returns (bool) {
        for (uint256 i = 0; i < ids.length; i++) {
            SplitTransaction memory st = splitTransactions[ids[i]];
            if (st.status == 2) {
                st.status = 3;
                splitTransactions[ids[i]] = st;
            }
        }
    }

    function _createSplitTransaction(uint256 _amount) internal returns (uint256) {
        SplitTransaction memory st = SplitTransaction({
            shareAmount : _amount,
            status : 1
            });

        uint256 id = splitTransactions.push(st) - 1;
        return id;
    }

    function _createTransaction(bytes32 _hashBytes, uint256 amount, bytes32 _vAccNoBytes) internal returns (uint256) {
        Transaction memory t = Transaction({
            transactionHash : _hashBytes,
            amount : amount,
            virtualAccountNumber : _vAccNoBytes,
            timestamp : now
        });

        uint256 id = transactions.push(t) - 1;
        transactionHashToIndex[_hashBytes] = id;

        return id;
    }
}
