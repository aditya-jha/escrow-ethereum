/*
 * created by aditya on 14/03/18
 */

import BaseContract from "./BaseContract";
import ContractJson from "./../../build/contracts/EscrowTransactions.json";

 export default class EscrowTransactionsContract extends BaseContract {
     static getContractJson() {
         return ContractJson;
     }

     setIndifiCoinContract = (address, gasPrice, gasLimit) => {
         return new Promise((resolve, reject) => {
            this.contract.updateIndifiCoinAddress.sendTransaction(address, this.getTransactionObject(gasPrice, gasLimit), EscrowTransactionsContract.callback(resolve, reject));
         })
     }

     setSplitPolicyContract = (address, gasPrice, gasLimit) => {
        return new Promise((resolve, reject) => {
           this.contract.updateSplitContractAddress.sendTransaction(address, this.getTransactionObject(gasPrice, gasLimit), EscrowTransactionsContract.callback(resolve, reject));
        })
    }
 }