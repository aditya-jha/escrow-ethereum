/*
 * created by aditya on 13/03/18
 */

"use strict";

const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const EthTx = require("ethereumjs-tx");
const GAS_PRICE = web3.toHex('20000000000');

const contractJSON = require("../build/contracts/IndifiCoin");
const address = contractJSON.networks[5777].address;
const abi = contractJSON.abi;

const contract = web3.eth.contract(contractJSON.abi);
const indifi = "0x4e890fa5710f252c856caeef42aee81ba39c18ec";
const indifiPrivateKey = new Buffer("cd53d9c28ebbff122dd51b95499f77e053e7808ab1e700ba159d89176230c294", "hex");

const borrower = "0x12856c9db1289de784bfdd6924cdd9765cb09c02";
const lender = "0xce069fff59596164c96dfad81ce61452111c3f75";

let contractInstance;

function getNonce(account) {
    return new Promise((resolve, reject) => {
        resolve(web3.toHex(web3.eth.getTransactionCount(account)));
    });
}

function getContract() {
    return new Promise((resolve, reject) => {
        contract.at(address, (error, instance) => {
            resolve(instance);
        })
    });
}

function getBalance(account) {
    return new Promise((resolve, reject) => {
        contractInstance.balanceOf.call(account, (error, result) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(result.toNumber());
            }
        })
    });
}

let events;

function addListeners() {
    // Or pass a callback to start watching immediately
    events = contractInstance.allEvents((error, log) => {
        if (!error)
            console.log(log);
    });
}

function main() {

    getContract()
        .then(instance => {
            contractInstance = instance;
            addListeners();
            return Promise.all([
                getBalance(indifi),
                getBalance(borrower),
                getBalance(lender)
            ]);
        })
        .then(results => {
            console.log(results);
        })
        .catch(error => {
            console.log(error);
        });
}

function createTokens() {
    return getNonce(indifi)
        .then(nonce => {
            const rawTx = {
                nonce: nonce,
                gasPrice: GAS_PRICE,
                gasLimit: web3.toHex('121000'),
                value: 0,
                data: "",
                from: indifi
            };
            let tx = new EthTx(rawTx);
            tx.sign(indifiPrivateKey);

            let serializedTx = `0x${tx.serialize().toString('hex')}`;
            return new Promise((resolve, reject) => {
                contractInstance.createTokens.sendTransaction(1000100, {
                    gasPrice: GAS_PRICE,
                    gasLimit: web3.toHex('121000'),
                    value: 0,
                    data: "",
                    from: indifi
                }, (error, result) => {
                    if (error) {
                        return reject(error);
                    } else {
                        return resolve(result);
                    }
                })
            });
        })
        .catch(error => {
            return error;
        })
}

function createTokensWrapper() {
    getContract()
        .then(instance => {
            contractInstance = instance;
            addListeners();
            return createTokens();
        })
        .then(result => {
            debugger;
        })
        .catch(error => {
            console.log(error);
        })
}

// createTokensWrapper();
main();
// TX: 0x9ef063cb30b1dc541a7bbe767a0666b5d34cc9857aae1ae59f0fd71c3ce9bd63