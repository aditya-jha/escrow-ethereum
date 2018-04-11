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
        }).then(result => {
            return this.waitForTransaction(result);
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
        }).then(result => {
            return this.waitForTransaction(result);
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
        }).then(result => {
            return this.waitForTransaction(result);
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
        }).then(result => {
            return this.waitForTransaction(result);
        })
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

    getVirtualAccount = (index) => {
        return new Promise((resolve, reject) => {
            this.contract.getVirtualAccount.call(index, EscrowTransactionsContract.callback(resolve, reject));
        }).then(result => {
            let policyType = result[3][0].toNumber();
            return {
                id: index,
                virtualAccountNumber: result[0],
                borrowerAddress: result[1],
                lenderAddress: result[2],
                policyDetails: {
                    type: policyType === 1 ? "Fixed" : "Percent",
                    value: policyType === 1 ? `Rs. ${result[3][1].toNumber() / 10000 }` : `${result[3][1].toNumber()}%`
                },
                bankAccountNumber: result[4],
                ifscCode: result[5]
            };
        })
    };

    getVirtualAccountIndex = (virtualAccount) => {
        return new Promise((resolve, reject) => {
            this.getByte32FromString(virtualAccount)
                .then(result => {
                    this.contract.virtualAccountsToIndex.call(result, EscrowTransactionsContract.callback(resolve, reject))
                })
        }).then(result => {
            return result.toNumber();
        })
    };

    getVirtualAccountByNumber = (virtualAccountNumber) => {
        return this.getVirtualAccountIndex(virtualAccountNumber)
            .then(result => {
                return this.getVirtualAccount(result)
            })
    };

    getAllVirtualAccounts = () => {
        return this.getTotalVirtualAccounts()
            .then(result => {
                let promises = [];
                for (let i = 1; i <= result; i++) {
                    promises.push(this.getVirtualAccount(i));
                }
                return Promise.all(promises);
            });
    };

    getTotalVirtualAccounts = () => {
        return new Promise((resolve, reject) => {
            return this.contract.getTotalVirtualAccounts.call(EscrowTransactionsContract.callback(resolve, reject));
        }).then(result => {
            return result.toNumber();
        })
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

    getProposedSplit = (amount, policyDetails) => {
        let policyType = policyDetails.type === "Fixed" ? 1 : 2;
        let policyValue;
        if (policyType === 2) {
            policyValue = policyDetails.value.replace("%", '');
        } else {
            policyValue = policyValue = parseFloat(policyDetails.value.split(" ")[1]) * Math.pow(10, 4);
        }
        return window.splitContractReference.split(amount, [policyType, policyValue])
            .then(result => {
                let lenderShare = result;
                return [{
                    shareAmount: amount - lenderShare,
                    status: 0,
                    id: 0
                }, {
                    shareAmount: lenderShare,
                    status: 0,
                    id: 0
                }]
            });
    };

    getTransactionByIndex = (transactionIndex) => {
        let transaction = {};

        return new Promise((resolve, reject) => {
            this.contract.getTransaction.call(transactionIndex, EscrowTransactionsContract.callback(resolve, reject));
        }).then(result => {
            transaction = {
                id: transactionIndex,
                hash: result[0],
                amount: result[1].toNumber(),
                virtualAccountNumber: result[2],
                borrowerShareId: result[3].toNumber(),
                lenderShareId: result[4].toNumber()
            };

            return this.getVirtualAccountByNumber(transaction.virtualAccountNumber);
        }).then(result => {
            transaction.virtualAccountDetails = result;

            // if borrowerShareId and lenderShareId is 0
            // get proposed split
            // else get Split Values
            if (transaction.borrowerShareId === 0 && transaction.lenderShareId === 0) {
                return this.getProposedSplit(transaction.amount, result.policyDetails);
            } else {
                return Promise.all([
                    this.getSplitTransactionByIndex(transaction.borrowerShareId),
                    this.getSplitTransactionByIndex(transaction.lenderShareId)
                ]);
            }
        }).then(results => {
            transaction.borrowerShare = results[0];
            transaction.lenderShare = results[1];

            return transaction;
        })
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

    updateSplitStatusToSentForSettlement = (splitTransactionIds, gasPrice, gasLimit) => {
        return new Promise((resolve, reject) => {
            this.contract
                .updateSplitStatusToSentForSettlement
                .sendTransaction(
                    splitTransactionIds,
                    this.getTransactionObject(gasPrice, gasLimit),
                    EscrowTransactionsContract.callback(resolve, reject)
                )
        }).then(result => {
            return this.waitForTransaction(result);
        })
    };

    splitEscrowTransaction = (transactionId, gasPrice, gasLimit) => {
        return new Promise((resolve, reject) => {
            this.contract
                .splitEscrowTransaction
                .sendTransaction(
                    transactionId,
                    this.getTransactionObject(gasPrice, gasLimit),
                    EscrowTransactionsContract.callback(resolve, reject)
                )
        }).then(result => {
            return this.waitForTransaction(result);
        })
    }
}
