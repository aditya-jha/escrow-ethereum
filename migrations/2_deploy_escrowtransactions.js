/*
 * created by aditya on 12/03/18
 */

const SplitContract = artifacts.require("./SplitContract.sol");
const IndifiCoinContract = artifacts.require("./IndifiCoin.sol");
const EscrowTransactions = artifacts.require("./EscrowTransactions");
const VirtualAccounts = artifacts.require("./VirtualAccounts");

module.exports = (deployer) => {
     deployer.deploy(IndifiCoinContract)
    .then(() => {
         // return deployer.deploy(SplitContract);
    }).then(() => {
       return deployer.deploy(EscrowTransactions);
    });
};
