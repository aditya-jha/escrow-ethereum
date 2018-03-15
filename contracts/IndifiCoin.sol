pragma solidity ^0.4.18;


import "./ERC20Interface.sol";


contract IndifiCoin is ERC20Interface {

    string constant public symbol = "INDIFI";
    string constant public name = "Indifi Coin";
    uint8 constant public decimals = 4;
    uint public _totalSupply;

    mapping(address => uint) internal balances;
    mapping(address => mapping(address => uint)) internal allowed;

    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    function IndifiCoin() public {
        _totalSupply = 0;

    }

    // ------------------------------------------------------------------------
    // Don't accept ETH
    // ------------------------------------------------------------------------
    function() public payable {
        revert();
    }

    // ------------------------------------------------------------------------
    // Total supply
    // ------------------------------------------------------------------------
    function totalSupply() public constant returns (uint) {
        return _totalSupply;
    }

    // ------------------------------------------------------------------------
    // Get the token balance for account tokenOwner
    // ------------------------------------------------------------------------
    function balanceOf(address tokenOwner) public constant returns (uint) {
        return balances[tokenOwner];
    }

    // ------------------------------------------------------------------------
    // Transfer the balance from token owner's account to _to account
    // - Owner's account must have sufficient balance to transfer
    // - 0 value transfers are allowed
    // ------------------------------------------------------------------------
    function transfer(address to, uint tokens) public returns (bool success) {
        balances[msg.sender] = safeSub(balances[msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        Transfer(msg.sender, to, tokens);
        return true;
    }

    // ------------------------------------------------------------------------
    // Token owner can approve for spender to transferFrom(...) tokens
    // from the token owner's account
    //
    // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
    // recommends that there are no checks for the approval double-spend attack
    // as this should be implemented in user interfaces
    // ------------------------------------------------------------------------
    function approve(address spender, uint tokens) public returns (bool) {
        allowed[msg.sender][spender] = tokens;
        Approval(msg.sender, spender, tokens);
        return true;
    }

    // ------------------------------------------------------------------------
    // Transfer tokens from the from account to the to account
    //
    // The calling account must already have sufficient tokens approve(...)-d
    // for spending from the from account and
    // - From account must have sufficient balance to transfer
    // - Spender must have sufficient allowance to transfer
    // - 0 value transfers are allowed
    // ------------------------------------------------------------------------
    function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        balances[from] = safeSub(balances[from], tokens);
        allowed[from][msg.sender] = safeSub(allowed[from][msg.sender], tokens);
        balances[to] = safeAdd(balances[to], tokens);
        Transfer(from, to, tokens);
        return true;
    }

    // ------------------------------------------------------------------------
    // Returns the amount of tokens approved by the owner that can be
    // transferred to the spender's account
    // ------------------------------------------------------------------------
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }

    // ------------------------------------------------------------------------
    // Owner can transfer out any accidentally sent ERC20 tokens
    // ------------------------------------------------------------------------
    function transferAnyERC20Token(address tokenAddress, uint tokens) public onlyOwner returns (bool) {
        return ERC20Interface(tokenAddress).transfer(owner, tokens);
    }

    // ------------------------------------------------------------------------
    // Create new tokens and add it to the senders account
    // increase total supply by new token amount
    // TODO: check this logic for from address in Transfer event
    // ------------------------------------------------------------------------
    function createTokens(uint tokens) public returns (bool) {
        _totalSupply = safeAdd(_totalSupply, tokens);
        balances[msg.sender] = safeAdd(balances[msg.sender], tokens);
        Transfer(address(0), msg.sender, tokens);
    }

    // ------------------------------------------------------------------------
    // Transfer tokens of the owner to the mentioned address
    // ------------------------------------------------------------------------
    function transferTokens(address to, uint tokens) public returns (bool) {
        require(balances[msg.sender] >= tokens);
        balances[to] = safeAdd(balances[to], tokens);
        balances[msg.sender] = safeSub(balances[msg.sender], tokens);
        Transfer(msg.sender, to, tokens);
    }
}

/*
    TODO: totalSupply Logic
*/