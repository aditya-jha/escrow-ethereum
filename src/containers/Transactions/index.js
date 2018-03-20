/*
 * created by aditya on 17 March 2018
 */

import React from "react";
import {connect} from "react-redux";
import Header from "./../../components/Header";
import Axios from "axios";
import * as URL from "./../../data/Urls";
import {INIT_TRANSACTIONS} from "./../../reducers/Transactions";

class Transactions extends React.Component {
    constructor(props) {
       super();
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.web3js.escrowTransactionsContract && nextProps.web3js.escrowTransactionsContract) {
            const self = this;
            window.setTimeout(() => {
                let transactions = window.localStorage.getItem("transactions");
                if (transactions) {
                    transactions = JSON.parse(transactions);
                    Promise.all([
                        Promise.all(transactions.map(d => nextProps.web3js.escrowTransactionsContract.getVirtualAccount(d.virtualAccountNo))),
                        Promise.all(transactions.map(d => nextProps.web3js.escrowTransactionsContract.getTransactionStatus(d.hash)))
                    ]).then(results => {
                            for (let i=0; i<results[1].length; i++) {
                                transactions[i].status = results[1][i];
                                transactions[i].statusText = this.statusToString(results[1][i]);
                                transactions[i].virtualAccount = results[0][i];
                            }
                            this.props.dispatch({
                                type: INIT_TRANSACTIONS,
                                transactions: transactions
                            });
                        })

                }
            }, 100);
        }
    }

    render() {
        const {transactions} = this.props;
    
        return(
            <div>
                <Header {...this.props}/>
                <div className="page_margin row">
                    <div className="col-12">
                        <div className="card my-3 ml-3 mt-3 mr-3">
                            <div className="card-body">
                                <h5 className="card-title text-center">Add Transaction</h5>
                                <div className="form-group row">
                                    <div className="col">
                                        <input type="number" className="form-control" ref="transactionAmount" placeholder="amount"/>
                                    </div>
                                    <div className="col">
                                    <input type="text" className="form-control" ref="transactionHash" placeholder="transction hash"/>
                                    </div>
                                    <div className="col">
                                        <input type="text" className="form-control col" ref="virtualAccount" placeholder="virtual account number"/>
                                    </div>
                                </div>
                                <button className="btn btn-primary" onClick={this.addTransaction.bind(this)}>Add Transaction</button>
                                <hr/>
                                <div className="row">
                                    <div className="col-8">
                                        <input className="form-control" ref="paymentsFile" type="file"/>
                                    </div>
                                    <div className="col-4">
                                        <button className="btn btn-primary" onClick={this.uploadPaymentsFile.bind(this)}>Upload</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card my-3 ml-3 mt-3 mr-3">
                            <div className="card-body">
                                <h5 className="card-title text-center">Transactions</h5>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            {/*<th>S. No.</th>*/}
                                            <th>Transaction</th>
                                            <th>Virtual Account Details</th>
                                            <th>Current Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.transactions.map((t, index) => (
                                            <tr key={t.hash}>
                                                {/*<td>{index + 1}</td>*/}
                                                <td>
                                                    <ul className="transactions-list-item">
                                                        <li>Rs. {t.amount}</li>
                                                        <li>{t.virtualAccountNo}</li>
                                                        <li>{t.date}</li>
                                                        <li>{t.senderName}</li>
                                                    </ul>
                                                </td>
                                                <td>something</td>
                                                <td>{t.statusText}</td>
                                                <td>{this.getAction(t.status, index)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    transactionActionHandler = (index, event) => {
        const target = event.target;
        const {escrowTransactionsContract} = this.props.web3js;
        const payment = this.props.transactions.transactions[index];
        if (payment.status === 0) {
            // save and split
            target.disabled = true;
            escrowTransactionsContract.newEscrowTransaction(payment.hash, payment.amount * 10000, payment.virtualAccountNo)
                .then(result => {
                    console.log(result);
                })
                .finally(() => {
                    target.disabled = false;
                })
        }
    };

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
    };

    uploadPaymentsFile = (event) => {
        const paymentFile = this.refs.paymentsFile.files[0];
        if (!paymentFile) {
            return;
        }

        const data = new FormData();
        data.append("file", paymentFile);

        let payments = [];
        Axios.request({
            method: "POST",
            baseURL: "http://localhost:8082",
            url: URL.UPLOAD_TRANSACTIONS,
            data
        }).then(result => {
            payments = result.data.data;
            window.localStorage.setItem("transactions", JSON.stringify(payments));
            const {escrowTransactionsContract} = this.props.web3js;

            return Promise.all([
                Promise.all(payments.map(d => escrowTransactionsContract.getVirtualAccount(d.virtualAccountNo))),
                Promise.all(payments.map(d => escrowTransactionsContract.getTransactionStatus(d.hash)))
            ]);
        }).then(results => {
            for (let i=0; i<results[1].length; i++) {
                payments[i].status = results[1][i];
                payments[i].statusText = this.statusToString(results[1][i]);
                payments[i].virtualAccount = results[0][i];
            }
            this.props.dispatch({
                type: INIT_TRANSACTIONS,
                transactions: payments
            });
        }).catch(error => {
            alert("error occured");
        })
    };

    statusToString = (status) => {
        switch (status) {
            case 1:
                return "Split Done";
            default:
                return "Not Saved";
        }
    };

    getAction = (status, index) => {
        switch (status) {
            case 1:
                return (
                    <button className="btn btn-danger" onClick={this.transactionActionHandler.bind(this, index)}>Debit</button>
                );
            default:
                return (
                    <button className="btn btn-success" onClick={this.transactionActionHandler.bind(this, index)}>Split</button>
                )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        ...state,
        transactions: state.transactions
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);