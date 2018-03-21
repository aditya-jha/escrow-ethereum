pragma solidity ^0.4.18;


import "./VirtualAccounts.sol";
import "./IndifiCoin.sol";
import "./SplitContract.sol";


contract EscrowTransactions is VirtualAccounts {
    
    event NewTransaction(uint256 indexed transactionId, uint256 indexed amount);
    
    struct Transaction {
        bytes32 transactionHash;
        uint256 amount;
        bytes32 virtualAccountNumber;
        uint timestamp;
    }

    struct SplitShares {
        uint256 borrowerShare;
        uint256 lenderShare;
    }

    struct VirtualAccount {
        bytes32 virtualAccountNumber;
        address borrowerAddress;
        address lenderAddress;
        uint[] policyDetails;
        string bankAccountNumber;
        string ifscCode;
    }

    Transaction[] public transactions;
    
    IndifiCoin public indifiCoin;
    SplitContract public splitContract;
    
    // -------------------------------------------------------------------------
    // To keep the position of any transaction in the transactions array
    // key: bytes32 - bytes32 representation of the sha256 hash of the transaction
    // value: uint256 - index of the Transaction struct in transactions array
    // -------------------------------------------------------------------------
    mapping(bytes32 => uint256) public transactionHashToIndex;
    
    // -------------------------------------------------------------------------
    // To keep the status of the incoming transaction w.r.t settlement
    // 0 - no such transaction
    // 1 - transaction saved to blockchain
    // 2 - split in coin contract done i.e. coins have been moved by indifi to lender and borrower respectively
    // 3 - settlement request sent to bank
    // 4 - settlement done
    // -------------------------------------------------------------------------
    mapping(uint256 => uint8) public transactionIdToStatus;


    // -------------------------------------------------------------------------
    // To keep virtual account details againt virtual account number during onboarding
    // key: bytes32 - bytes32 representation of the virtual account number
    // value: VirtualAccount - virtual account details
    // -------------------------------------------------------------------------
    mapping(bytes32 => VirtualAccount) public VirtualAccounts;

    mapping(uint256 => SplitShares) public transactionIdToSplitShares;

    function EscrowTransactions() public {
        _createTransaction(0x0, 0, 0x0);
    }
    
    function updateIndifiCoinAddress(address _indifiCoinAddress) public onlyOwner returns (bool) {
        indifiCoin = IndifiCoin(_indifiCoinAddress);
    }
    
    function updateSplitContractAddress(address _splitContractAddress) public onlyOwner returns (bool) {
        splitContract = SplitContract(_splitContractAddress);
    }
    
    function newEscrowTransaction(string _hash, uint256 amount, string _vAccNo) public onlyOwner returns(bool) {
        // check if this transaction is new by comparing hash
        bytes32 hashBytes = _stringToBytes32(_hash);
        bytes32 vAccNoBytes = _stringToBytes32(_vAccNo);
        
        require(transactionHashToIndex[hashBytes] <= 0);
        
        // create new Transaction object and save
        uint256 id = _createTransaction(hashBytes, amount, vAccNoBytes);
        
        // emit new transaction created
        NewTransaction(id, amount);
        transactionIdToStatus[id] = 1; // transaction saved

        // allocate coins equal to the amount into owners account
        indifiCoin.createTokens(amount);
        VirtualAccount memory va = VirtualAccounts[vAccNoBytes];
        
        int256 lenderShare = splitContract.split(amount, va.policyDetails);
        if (lenderShare != -1) {
            indifiCoin.transferTokens(va.lenderAddress, uint256(lenderShare));
            indifiCoin.transferTokens(va.borrowerAddress, safeSub(amount, uint256(lenderShare)));
            transactionIdToStatus[id] = 2; // split done
            SplitShares memory ss =
        }
        
        return true;
    }
    
    function getTotalTransactions() public view returns (uint256) {
        return transactions.length - 1;
    }

    function getTransaction(uint256 id) public view returns(
        string transactionHash,
        uint256 amount,
        string virtualAccountNumber
    ) {
        Transaction memory t = transactions[id];
        transactionHash = _bytes32ToString(t.transactionHash);
        amount = t.amount;
        virtualAccountNumber = _bytes32ToString(t.virtualAccountNumber);
    }

    function _createTransaction(bytes32 _hashBytes, uint256 amount, bytes32 _vAccNoBytes) internal returns (uint256) {
        Transaction memory t = Transaction({
            transactionHash: _hashBytes,
            amount: amount,
            virtualAccountNumber: _vAccNoBytes,
            timestamp: now
        });
        
        uint256 id = transactions.push(t) - 1;
        transactionHashToIndex[_hashBytes] = id;
        
        return id;
    }
}
