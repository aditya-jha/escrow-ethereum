/*
 * created by aditya on 14/03/18
 */

import BaseContract from "./BaseContract";
import ContractJson from "../../../build/contracts/EscrowTransactions.json";
import IndifiCoinContract from "./IndifiCoinContract";

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
                	this.contract.virtualAccountsToIndex.call(result, (error, result) => {
                		if (error) {
                			return reject(error);
						} else {
                            this.contract.getVirtualAccount.call(result.toNumber(), (error, result) => {
                                if (error) {
                                    return reject(error);
                                } else {
                                    resolve({
										virtualAccountNumber: result[0],
                                        borrowerAddress: result[1],
                                        lenderAddress: result[2],
                                        policyDetails: {
											type: result[3][0].toNumber(),
											value: result[3][1].toNumber()
										},
                                        bankAccountNumber: result[4],
                                        ifscCode: result[5]
									});
                                }
                            });
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

	getSplitTransactionByIndex = (splitTransactionIndex) => {
		return new Promise((resolve, reject) => {
			this.contract.splitTransactions.call(splitTransactionIndex, EscrowTransactionsContract.callback(resolve, reject));
		}).then(result => {
			return {
				shareAmount: result[0].toNumber(),
				status: result[1].toNumber(),
				id: splitTransactionIndex
			}
		});
	};

	getTransactionByIndex = (transactionIndex) => {
		let transaction = {};

		return new Promise((resolve, reject) => {
			this.contract.getTransaction.call(transactionIndex, EscrowTransactionsContract.callback(resolve, reject));
		}).then(result => {
			transaction = {
                hash: result[0],
                amount: result[1].toNumber(),
                virtualAccountNumber: result[2],
				borrowerShareId: result[3].toNumber(),
				lenderShareId: result[4].toNumber()
			};
			return Promise.all([
				this.getSplitTransactionByIndex(result[3].toNumber()),
                this.getSplitTransactionByIndex(result[4].toNumber()),
				this.getVirtualAccount(transaction.virtualAccountNumber)
			]);
		}).then(results => {
			transaction.borrowerShare = results[0];
			transaction.lenderShare = results[1];
			transaction.virtualAccountDetails = results[2];
			return transaction;
		});
	};

	waitForTransaction = (hash) => {
		return new Promise((resolve, reject) => {
            this.web3.getTransactionReceipt(hash)
				.then(result => {
                    if (result) {
                        resolve(result);
                    } else {
                    	resolve(this.waitForTransaction(hash));
                    }
				});

		})
	};

	updateSplitStatusToSentForSettlement = (splitTransactionId, gasPrice, gasLimit) => {
		return new Promise((resolve, reject) => {
			this.contract
				.updateSplitStatusToSentForSettlement.
				sendTransaction(
					[splitTransactionId],
                	this.getTransactionObject(gasPrice, gasLimit),
                	EscrowTransactionsContract.callback(resolve, reject)
				)
		}).then(result => {
			return this.waitForTransaction(result);
		})
	}
 }
