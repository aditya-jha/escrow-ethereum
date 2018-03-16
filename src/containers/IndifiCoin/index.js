/*
 * created by aditya on 13/03/18
 */

import React from "react";
import {connect} from "react-redux";

class IndifiCoin extends React.Component {
    constructor(props) {
        super();
        this.state = {
            accounts: [
                {name: "Indifi", address: "0x706d90f4a90f78ed88737cd92f1dae56f4dd31c5", balance: 0},
                {name: "Borrower", address: "0x0249c34a0cc78f6183b390ebc960e700ddf76269", balance: 0},
                {name: "Lender", address: "0x83546836c108b2e855f69dc1038ce5fbc4fef90a", balance: 0}],
            totalTransactions: 0
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.web3js.indifiCoinContract && nextProps.web3js.indifiCoinContract) {
            window.setTimeout(() => {
                this.refreshBalances();
            }, 100);
        }
        if (!this.props.web3js.escrowTransactionsContract && nextProps.web3js.escrowTransactionsContract) {
            const self = this;
            window.setTimeout(() => {
                nextProps.web3js.escrowTransactionsContract.getTotalTransactions()
                .then(result => {
                    self.setState({
                        totalTransactions: result
                    });
                })
            }, 100);
        }
    }

    render() {
        const {accounts, totalTransactions} = this.state;

        return (
            <div>
                <div className="row">
                    <div className="col-6">
                        <div className="card my-3 ml-3 mt-3 mr-2">
                            <div className="card-body">
                                <h5 className="card-title text-center">Balances Information</h5>
                                <table style={{width: "100%"}}>
                                    <thead>
                                    <tr>
                                        <th>Account</th>
                                        <th>Address</th>
                                        <th>Balance</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {accounts.map(account => (
                                            <tr key={account.name}>
                                                <td>{account.name}</td>
                                                <td>{account.address}</td>
                                                <td>{account.balance}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <br/>
                                <button className="btn btn-primary" onClick={this.refreshBalances.bind(this)}>Refresh</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card my-3 ml-2 mt-3 mr-3">
                            <div className="card-body">
                                <h5 className="card-title text-center">Transactions</h5>
                                <h4>Add Transaction</h4>
                                <div className="form-group row">
                                    <input type="number" className="form-control col mr-2" ref="transactionAmount" placeholder="amount"/>
                                    <input type="text" className="form-control col mr-2" ref="transactionHash" placeholder="transction hash"/>
                                    <input type="text" className="form-control col" ref="virtualAccount" placeholder="virtual account number"/>
                                </div>
                                <button className="btn btn-primary" onClick={this.addTransaction.bind(this)}>Add Transaction</button>
                                <hr/>
                                <p>Total Transactions: <b>{totalTransactions}</b></p>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card my-3 ml-3 mt-3 mr-3">
                            <div className="card-body">
                                <h5 className="card-title text-center">Create Tokens</h5>
                                <div className="form-group">
                                    <input type="number" className="form-control" ref="createTokensInput"/>
                                </div>
                                <br/>
                                <button className="btn btn-primary" onClick={this.createTokens.bind(this)}>Create</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card my-3 ml-3 mt-3 mr-3">
                            <div className="card-body">
                                <h5 className="card-title text-center">Transfer</h5>
                                <div className="form-group">
                                    <input type="text" className="form-control" ref="toAddress" placeholder="address"/>
                                    <br/>
                                    <input type="number" className="form-control" ref="transferAmount" placeholder="amount"/>
                                </div>
                                <br/>
                                <button className="btn btn-primary" onClick={this.transfer.bind(this)}>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    refreshBalances = (event) => {
        const {indifiCoinContract} = this.props.web3js;
        const {accounts} = this.state;
        
        if (!indifiCoinContract) {
            return;
        }

        Promise.all(accounts.map(account => indifiCoinContract.getBalance(account.address)))
            .then(results => {
                accounts[0].balance = results[0];
                accounts[1].balance = results[1];
                accounts[2].balance = results[2];
                this.setState({
                    accounts: accounts
                });
            })
            .catch(error => {
                console.log(error);
            })
    };

    createTokens = (event) => {
        const {indifiCoinContract} = this.props.web3js;
        const value = parseFloat(this.refs.createTokensInput.value);
        if (!value || value === 0) {
            return;
        }
        let tokens = value * Math.pow(10, 4);
        indifiCoinContract.createTokens(tokens)
            .catch(error => {
                alert("error creating tokens");
                console.log(error);
            })
    };

    transfer = (event) => {
        const {indifiCoinContract} = this.props.web3js;
        const amount = parseFloat(this.refs.transferAmount.value);
        const to = this.refs.toAddress.value;

        if (!amount || !to) {
            return;
        }

        indifiCoinContract.transferTokens(to, amount * Math.pow(10, 4))
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        });
    }

    addTransaction = (event) => {
        const {escrowTransactionsContract} = this.props.web3js;
        const amount = parseFloat(this.refs.transactionAmount.value);
        const transactionHash = this.refs.transactionHash.value;
        const virtualAccount = this.refs.virtualAccount.value;

        if (!virtualAccount || !amount || !transactionHash) {
            return;
        }

        escrowTransactionsContract.newEscrowTransaction(transactionHash, amount, virtualAccount)
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        });
    }
}

const mapStateToProps = (state) => {
    return {
        ...state
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(IndifiCoin);