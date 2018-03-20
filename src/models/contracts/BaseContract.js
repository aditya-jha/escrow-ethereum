/*
 * created by aditya on 16/03/18
 */

 export default class BaseContract {
     constructor(_contract, _web3) {
         this.contract = _contract;
         this.web3 = _web3;
     }

    setWeb3(_web3) {
        this.web3 = _web3;
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

    getTransactionObject(gasPrice, gasLimit) {
        return {
            gasPrice: gasPrice,
            gasLimit: gasLimit,
            value: 0,
            data: "",
            from: this.web3.getAccountOwner()
        }
    }
 }