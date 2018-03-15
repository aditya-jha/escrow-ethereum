/*
 * created by aditya on 14/03/18
 */

/*
 *  TODO: add a function to directly transfer tokens without allowance
 *  TODO: make from part of the class
 */
export default class IndifiCoinContract {
    constructor(_contract, _web3) {
        this.contract = _contract;
        this.web3 = _web3;
    }

    getTransactionObject(gasPrice, gasLimit) {
        return {
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            value: 0,
            data: "",
            from: this.web3.getAccountOwner()
        }
    }

    static callback(resolve, reject) {
        return (error, result) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(result);
            }
        }
    }

    setWeb3(_web3) {
        this.web3 = _web3;
    }

    getBalance(account) {
        return new Promise((resolve, reject) => {
             this.contract.balanceOf(account, IndifiCoinContract.callback(resolve, reject));
        }).then(result => result.toNumber());
    }

    createTokens(amount, from, gasLimit, gasPrice) {
        return new Promise((resolve, reject) => {
            this.contract.createTokens.sendTransaction(amount, {
                gasPrice: gasPrice,
                gasLimit: gasLimit,
                value: 0,
                data: "",
                from: from
            }, (error, result) => {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(result);
                }
            })
        });
    }

    transferFrom(from, to, amount, gasLimit, gasPrice) {
        return new Promise((resolve, reject) => {
            this.contract.transferFrom.sendTransaction(from, to, amount, this.getTransactionObject(gasPrice, gasLimit), IndifiCoinContract.callback(resolve, reject));
        });
    }

    approve(spender, amount, gasLimit, gasPrice) {
        return new Promise((resolve, reject) => {
            this.contract.approve.sendTransaction(spender, amount, this.getTransactionObject(gasPrice, gasLimit), IndifiCoinContract.callback(resolve, reject));
        });
    }

    transferOwnerShip(to, gasPrice, gasLimit) {
        return new Promise((resolve, reject) => {
            this.contract.transferOwnership.sendTransaction(to, this.getTransactionObject(gasPrice, gasLimit), IndifiCoinContract.callback(resolve, reject));
        });
    }
}
