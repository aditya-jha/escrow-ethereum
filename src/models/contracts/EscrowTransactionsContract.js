/*
 * created by aditya on 14/03/18
 */

import BaseContract from "./BaseContract";
import ContractJson from "../../../build/contracts/EscrowTransactions.json";

 export default class EscrowTransactionsContract extends BaseContract {
    static getContractJson() {
        return ContractJson;
    }

    setIndifiCoinContract = (address, gasPrice, gasLimit) => {
        return new Promise((resolve, reject) => {
        	this.contract.updateIndifiCoinAddress.sendTransaction(address, this.getTransactionObject(gasPrice, gasLimit), EscrowTransactionsContract.callback(resolve, reject));
        })
    };

    setSplitPolicyContract = (address, gasPrice, gasLimit) => {
        return new Promise((resolve, reject) => {
		   this.contract
		   .updateSplitContractAddress
		   .sendTransaction(
			   address, 
			   this.getTransactionObject(gasPrice, gasLimit), 
			   EscrowTransactionsContract.callback(resolve, reject)
			);
        })
    };

	updateVirtualAccountConfiguration = (virtualAccount, policy, borrower, lender, bankAccount, ifscCode, gasPrice, gasLimit) => {
		return new Promise((resolve, reject) => {
			this.contract
			.updateVirtualAccountConfiguration
			.sendTransaction(
				virtualAccount, 
				policy, 
				borrower, 
				lender, 
				bankAccount,
				ifscCode,
				this.getTransactionObject(gasPrice, gasLimit), 
				EscrowTransactionsContract.callback(resolve, reject)
			);
		})
	};

	newEscrowTransaction = (hash, amount, virtualAccount, gasPrice, gasLimit) => {
		return new Promise((resolve, reject) => {
			this.contract
			.newEscrowTransaction
			.sendTransaction(
				hash, 
				amount, 
				virtualAccount, 
				this.getTransactionObject(gasPrice, gasLimit),
				EscrowTransactionsContract.callback(resolve, reject)
			)
		});	
	};

	getTotalTransactions = () => {
		return new Promise((resolve, reject) => {
			this.contract.getTotalTransactions.call(EscrowTransactionsContract.callback(resolve, reject));
		}).then(resut => resut.toNumber());
	};

	getTransactionStatus = (hash) => {
	    return new Promise((resolve, reject) => {
            this.getByte32FromString(hash)
                .then(result => {
                    this.contract.transactionHashToIndex.call(result, (error, result) => {
                        if (error) {
                            return reject(error);
                        } else {
                            this.contract.transactionIdToStatus.call(result.toNumber(), (error, result) => {
                                if (error) {
                                    return reject(error);
                                } else {
                                    resolve(result.toNumber());
                                }
                            });
                        }
                    });
                });
        })
	};

	getByte32FromString = (s) => {
	    return new Promise((resolve, reject) => {
	        this.contract._stringToBytes32.call(s, (error, result) => {
                if (error) {
                    return reject(error);
                } else {
                    resolve(result);
                }
	        })
        })
    };

	getVirtualAccount = (virtualAccountNo) => {
	    return new Promise((resolve, reject) => {
            this.getByte32FromString(virtualAccountNo)
                .then(result => {
                    this.contract.VirtualAccounts.call(result, (error, result) => {
                        if (error) {
                            return reject(error);
                        } else {
                            resolve(result);
                        }
                    });
                })
        });
    };

	getAllVirtualAccounts = () => {
        return new Promise((resolve, reject) => {
			this.contract.getAllVirtualAccounts.call(EscrowTransactionsContract.callback(resolve, reject));
		});
    };
 }
