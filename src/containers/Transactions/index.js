/*
 * created by aditya on 17 March 2018
 */

import React from "react";
import {connect} from "react-redux";
import Header from "./../../components/Header";
import Axios from "axios";
import * as URL from "./../../data/Urls";
import {TRANSACTIONS_INIT_TRANSACTIONS} from "./../../reducers/Transactions";
import {TRANSACTIONS_IS_LOADING, TRANSACTIONS_TOTAL_TRANSACTIONS} from "../../reducers/Transactions";
import {Loader} from "./../../components";

class Transactions extends React.Component {
    constructor(props) {
        super();
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.web3js.escrowTransactionsContract && nextProps.web3js.escrowTransactionsContract) {
            this.loadTransactions(nextProps.web3js.escrowTransactionsContract, nextProps.dispatch);
        }
    }

    componentDidMount() {
        if (this.props.web3js.escrowTransactionsContract) {
            this.loadTransactions(this.props.web3js.escrowTransactionsContract, this.props.dispatch);
        }
    }

    render() {
        const {transactions} = this.props;

        return (
            <div>
                <Header {...this.props}/>
                <div className="page_margin row">
                    <div className="col-12">
                        <div className="card my-3 ml-3 mt-3 mr-3">
                            <div className="card-body">
                                <h5 className="card-title text-center">Add Transaction</h5>
                                <div className="form-group row">
                                    <div className="col">
                                        <input type="number" className="form-control" ref="transactionAmount"
                                               placeholder="amount"/>
                                    </div>
                                    <div className="col">
                                        <input type="text" className="form-control" ref="transactionHash"
                                               placeholder="transction hash"/>
                                    </div>
                                    <div className="col">
                                        <input type="text" className="form-control col" ref="virtualAccount"
                                               placeholder="virtual account number"/>
                                    </div>
                                </div>
                                <button className="btn btn-primary" onClick={this.addTransaction.bind(this)}>Add
                                    Transaction
                                </button>
                                {/*<hr/>*/}
                                {/*<div className="row">*/}
                                    {/*<div className="col-8">*/}
                                        {/*<input className="form-control" ref="paymentsFile" type="file"/>*/}
                                    {/*</div>*/}
                                    {/*<div className="col-4">*/}
                                        {/*<button className="btn btn-primary"*/}
                                                {/*onClick={this.uploadPaymentsFile.bind(this)}>Upload*/}
                                        {/*</button>*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                    {
                        transactions.isLoading ?
                            <div className="col text-center">
                                <Loader text="Loading Transactions..."/>
                            </div>
                            :
                            <div className="col-12">
                                <div className="card my-3 ml-3 mt-3 mr-3">
                                    <div className="card-body">
                                        <h5 className="card-title text-center">Transactions <span
                                            className="ml-5">Total: {transactions.total}</span></h5>
                                        <table className="table table-hover">
                                            <thead>
                                            <tr>
                                                {/*<th>S. No.</th>*/}
                                                <th>Transaction</th>
                                                <th>Virtual Account Details</th>
                                                <th>Splits</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {transactions.transactions.map((t, index) => (
                                                <tr key={t.hash}>
                                                    {/*<td>{index + 1}</td>*/}
                                                    <td>
                                                        <ul className="transactions-list-item">
                                                            <li>Rs. {this.convertToRupees(t.amount)}</li>
                                                            <li>{t.timestamp}</li>
                                                        </ul>
                                                    </td>
                                                    <td>
                                                        <ul className="transactions-list-item">
                                                            <li>{t.virtualAccountDetails.virtualAccountNumber}</li>
                                                            <li>{t.virtualAccountDetails.borrowerAddress}</li>
                                                            <li>{t.virtualAccountDetails.lenderAddress}</li>
                                                            <li>{t.virtualAccountDetails.policyDetails.type + "," + t.virtualAccountDetails.policyDetails.value}</li>
                                                            <li>{t.virtualAccountDetails.bankAccountNumber}</li>
                                                            <li>{t.virtualAccountDetails.ifscCode}</li>
                                                        </ul>
                                                    </td>
                                                    <td className="row">
                                                        <div className="col">
                                                            <p style={{margin: 0, padding: 0, fontWeight: "bold"}}>Borrower Share</p>
                                                            <ul className="transactions-list-item">
                                                                <li>Rs. {this.convertToRupees(t.borrowerShare.shareAmount)}</li>
                                                                <li><b>{this.statusToString(t.borrowerShare.status)}</b></li>
                                                                {t.borrowerShare.status === 1 ?
                                                                    <li><button className="btn btn-success" onClick={this.SendForSettlement.bind(this, t.borrowerShare)}>Settle</button></li> : null}
                                                            </ul>
                                                        </div>
                                                        <div className="col">
                                                            <p style={{margin: 0, padding: 0, fontWeight: "bold"}}>Lender Share</p>
                                                            <ul className="transactions-list-item">
                                                                <li>Rs. {this.convertToRupees(t.lenderShare.shareAmount)}</li>
                                                                <li><b>{this.statusToString(t.lenderShare.status)}</b></li>
                                                                {t.lenderShare.status === 1 ?
                                                                    <li><button className="btn btn-success" onClick={this.SendForSettlement.bind(this, t.lenderShare)}>Settle</button></li> : null}
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div>
        )
    }

    loadTransactions = (escrowTransactionsContract, dispatch) => {
        dispatch({type: TRANSACTIONS_IS_LOADING, isLoading: true});

        let transactions = {};
        escrowTransactionsContract.getTotalTransactions()
            .then(result => {
                // iterate over all transactions and load it
                transactions.total = result;
                let promises = [];
                for (let i = 1; i <= result; i++) {
                    promises.push(escrowTransactionsContract.getTransactionByIndex(i));
                }
                return Promise.all(promises);
            })
            .then(results => {
                console.log(results);
                dispatch({type: TRANSACTIONS_INIT_TRANSACTIONS, transactions: results});
                dispatch({type: TRANSACTIONS_TOTAL_TRANSACTIONS, total: transactions.total});
            })
            .catch(error => {
                alert(error.toString());
            })
            .finally(() => {
                dispatch({type: TRANSACTIONS_IS_LOADING, isLoading: false});
            })
    };

    convertToRupees(amount) {
        return amount/Math.pow(10, this.props.web3js.indifiCoinContract.decimals)
    }

    addTransaction = (event) => {
        const {escrowTransactionsContract} = this.props.web3js;
        const amount = parseFloat(this.refs.transactionAmount.value);
        const transactionHash = this.refs.transactionHash.value;
        const virtualAccount = this.refs.virtualAccount.value;

        if (!virtualAccount || !amount || !transactionHash) {
            return;
        }
        event.persist();
        event.target.disabled = true;
        escrowTransactionsContract.newEscrowTransaction(transactionHash, amount, virtualAccount)
            .then(result => {
                this.loadTransactions(escrowTransactionsContract, this.props.dispatch);
            })
            .catch(error => {
                alert(error.toString());
                console.log(error);
            })
            .finally(() => {
                event.target.disabled = false;
            })
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
            for (let i = 0; i < results[1].length; i++) {
                payments[i].status = results[1][i];
                payments[i].statusText = this.statusToString(results[1][i]);
                payments[i].virtualAccount = results[0][i];
            }
            this.props.dispatch({
                type: TRANSACTIONS_INIT_TRANSACTIONS,
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
            case 2:
                return "Pending Bank Transfer";
            case 3:
                return "Settled";
            default:
                return "Unknown";
        }
    };

    SendForSettlement = (splitTransaction, event) => {
        debugger;
        event.target.disabled = true;
        this.props.web3js.escrowTransactionsContract.updateSplitStatusToSentForSettlement(splitTransaction.id)
            .then(result => {
                this.loadTransactions(this.props.web3js.escrowTransactionsContract, this.props.dispatch);
            })
    }
}

const mapStateToProps = (state) => {
    return {
        web3js: state.web3js,
        transactions: state.transactions
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);