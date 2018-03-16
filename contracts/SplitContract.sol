pragma solidity ^0.4.18;


contract SplitContract {
    
    function fixSplit(uint256 amount, uint256 fixAmount) public pure returns (uint256) {
        if (amount >= fixAmount) {
            return fixAmount;
        } else {
            return amount;
        }
        
        return 0;    
    }
    
    function fixPercentageSplit(uint256 amount, uint256 percentage) public pure returns (uint256) {
        return (amount * percentage) / 100;
    }
    
    function split(uint256 amount, uint256[] params) public pure returns (int256) {
        if (params[0] == 1) {
            return int(fixSplit(amount, params[1]));
        } else if (params[0] == 2) {
            return int(fixPercentageSplit(amount, params[1]));
        } else {
            return -1;   
        }
    }
}
