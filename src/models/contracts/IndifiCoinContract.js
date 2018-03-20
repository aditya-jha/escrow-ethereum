/*
 * created by aditya on 14/03/18
 */

import BaseContract from "./BaseContract";
import ContractJson from "../../../build/contracts/IndifiCoin.json";

/*
 *  TODO: add a function to directly transfer tokens without allowance
 */
export default class IndifiCoinContract extends BaseContract {
    static getContractJson() {
        return ContractJson;
    }
    
    getBalance = (account) => {
        return new Promise((resolve, reject) => {
             this.contract.balanceOf(account, IndifiCoinContract.callback(resolve, reject));
        }).then(result => result.toNumber());
    }

    createTokens = (amount, from, gasLimit, gasPrice) => {
        return new Promise((resolve, reject) => {
            this.contract.createTokens.sendTransaction(amount, this.getTransactionObject(gasPrice, gasLimit), IndifiCoinContract.callback(resolve, reject));
        });
    }

    transferFrom = (from, to, amount, gasLimit, gasPrice) => {
        return new Promise((resolve, reject) => {
            this.contract.transferFrom.sendTransaction(from, to, amount, this.getTransactionObject(gasPrice, gasLimit), IndifiCoinContract.callback(resolve, reject));
        });
    }

    approve = (spender, amount, gasLimit, gasPrice) => {
        return new Promise((resolve, reject) => {
            this.contract.approve.sendTransaction(spender, amount, this.getTransactionObject(gasPrice, gasLimit), IndifiCoinContract.callback(resolve, reject));
        });
    }

    transferOwnerShip = (to, gasPrice, gasLimit) => {
        return new Promise((resolve, reject) => {
            this.contract.transferOwnership.sendTransaction(to, this.getTransactionObject(gasPrice, gasLimit), IndifiCoinContract.callback(resolve, reject));
        });
    }

    transferTokens = (to, amount, gasPrice, gasLimit) => {
        return new Promise((resolve, reject) => {
            this.contract.transferTokens.sendTransaction(to, amount, this.getTransactionObject(gasPrice, gasLimit), IndifiCoinContract.callback(resolve, reject));
        }); 
    }

    updateContractsWithAccess = (address, access, gasPrice, gasLimit) => {
        return new Promise((resolve, reject) => {
            this.contract.updateContractsWithAccess.sendTransaction(address, access, this.getTransactionObject(gasPrice, gasLimit), IndifiCoinContract.callback(resolve, reject));
        })
    }
}
