/*
 * created by aditya on 17 March 2018
 */

import React from "react";
import {connect} from "react-redux";
import Header from "./../../components/Header";

class Transactions extends React.Component {
    constructor(props) {
       super();
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
                                            <th>S. No.</th>
                                            <th>Transaction</th>
                                            <th>Current Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.transactions.map((t, index) => (
                                            <tr key={t.txHash}>
                                                <td>{index + 1}</td>
                                                <td>{}</td>
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