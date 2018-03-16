pragma solidity ^0.4.18;


import "./AccessControl.sol";
import "./IndifiCoin.sol";
import "./SplitContract.sol";


contract EscrowTransactions is AccessControl {
    
    event NewTransaction(uint256 indexed transactionId, uint256 indexed amount);
    
    struct Transaction {
        bytes32 transactionHash;
        uint256 amount;
        bytes32 virtualAccountNumber;
        uint timestamp;
    }

    Transaction[] public transactions;
    
    IndifiCoin indifiCoin;
    SplitContract splitContract;
    
    // -------------------------------------------------------------------------
    // To keep the position of any transaction in the transactions array
    // key: bytes32 - bytes32 representation of the sha256 hash of the transaction
    // value: uint256 - index of the Transaction struct in transactions array
    // -------------------------------------------------------------------------
    mapping(bytes32 => uint256) public transactionHashToIndex;
    
    // -------------------------------------------------------------------------
    // To keep the status of the incoming transaction w.r.t settlement
    // 0 - split not done or not such transaction
    // 1 - split in coin contract done i.e. coins have been moved by indifi to lender and borrower respectively
    // 2 - settlement request sent to bank
    // 3 - settlement done
    // -------------------------------------------------------------------------
    mapping(uint256 => uint8) public transactionIdToStatus;
    
    mapping(bytes32 => uint256[]) public virtualAccountSplitPolicyMapping;
    
    // -------------------------------------------------------------------------
    // To keep the ethereum address of the corresponding virtual account number
    // key: bytes32 - bytes32 representation of the virtual account number
    // value: address - ethereum address of the borrower
    // -------------------------------------------------------------------------
    mapping(bytes32 => address) public borrowerAddress;
    
    // -------------------------------------------------------------------------
    // To keep the ethereum address of the lender againt the virtual account number
    // key: bytes32 - bytes32 representation of the virtual account number
    // value: address - ethereum address of the lender
    // -------------------------------------------------------------------------
    mapping(bytes32 => address) public lenderAddress;
    
    function EscrowTransactions() public {
        _createTransaction(0x0, 0, 0x0);
    }
    
    function updateIndifiCoinAddress(address _indifiCoinAddress) public onlyOwner returns (bool) {
        indifiCoin = IndifiCoin(_indifiCoinAddress);
    }
    
    function updateSplitContractAddress(address _splitContractAddress) public onlyOwner returns (bool) {
        splitContract = SplitContract(_splitContractAddress);
    }
    
    function updateVirtualAccountConfiguration(
        string _virtualAccountNumber, 
        uint256[] _policyDetails,
        address _borrower,
        address _lender
    ) public onlyOwner returns (bool) {
        bytes32 virtualAccountNumberBytes = _stringToBytes32(_virtualAccountNumber);
        virtualAccountSplitPolicyMapping[virtualAccountNumberBytes] = _policyDetails;
        borrowerAddress[virtualAccountNumberBytes] = _borrower;
        lenderAddress[virtualAccountNumberBytes] = _lender;
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

        // allocate coins equal to the amount into owners account
        indifiCoin.createTokens(amount);
        uint256[] storage policyDetails = virtualAccountSplitPolicyMapping[vAccNoBytes];
        
        int256 lenderShare = splitContract.split(amount, policyDetails);
        if (lenderShare != -1) {
            indifiCoin.transferTokens(lenderAddress[vAccNoBytes], uint256(lenderShare));
            indifiCoin.transferTokens(borrowerAddress[vAccNoBytes], safeSub(amount, uint256(lenderShare)));
            transactionIdToStatus[id] = 1; // split done
        }
        
        return true;
    }
    
    function getTotalTransactions() public view returns (uint256) {
        return transactions.length - 1;
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