/*
 * created by aditya on 05/02/18
 */

export default class MyWeb3 {
    constructor(web3Instance) {
        if (web3Instance) {
            this._web3js = web3Instance;
        }
    }

    setWeb3Instance(web3Instance) {
        this._web3js = web3Instance;
    }

    getAccountOwner() {
        return this._web3js.eth.accounts[0];
    }

    getGasPrice() {
        return new Promise((resolve, reject) => {
            this._web3js.eth.getGasPrice((error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        });
    }

    getDefaultAccount() {
        return this._web3js.eth.defaultAccount;
    }

    getBalance(address, ether) {
        return new Promise((resolve, reject) => {
            this._web3js.eth.getBalance(address, (err, balance) => {
                if (err) {
                    reject(err);
                } else {
                    balance = balance.toNumber();
                    if (ether) {
                        balance = this._web3js.fromWei(balance);
                    }
                    resolve(balance);
                }
            })
        })
    }

    getContractReference(address, abi) {
        return this._web3js.eth.contract(abi).at(address);
    }

    getEthereumNetworkVersion() {
        return new Promise((resolve, reject) => {
            this._web3js.version.getNetwork((err, netId) => {
                switch (netId) {
                    case "1":
                        console.log('This is mainnet');
                        break;
                    case "2":
                        console.log('This is the deprecated Morden test network.');
                        break;
                    case "3":
                        console.log('This is the ropsten test network.');
                        break;
                    case "4":
                        console.log('This is the Rinkeby test network.');
                        break;
                    case "42":
                        console.log('This is the Kovan test network.');
                        break;
                    default:
                        console.log('This is an unknown network.')
                }
                resolve(netId);
            })
        })
    }

    getTransactionReceipt(hash) {
        return new Promise((resolve, reject) => {
            this._web3js.eth.getTransactionReceipt(hash, (error, result) => {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(resolve);
                }
            })
        });
    }
}

 