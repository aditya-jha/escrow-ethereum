/*
 * created by aditya on 02/04/18
 */

import React from "react";
import {
    Header,
    Loader
} from "./../../components";
import {connect} from "react-redux";
import {
    USER_VIEW_SET_TRANSACTIONS,
    USER_VIEW_IS_LOADING
} from "../../reducers/UserView";

class UserView extends React.Component {
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
        let transactions = this.props.userView;
        let owner;
        
        if (this.props.web3js && this.props.web3js.web3js) {
            owner = this.props.web3js.web3js.getAccountOwner();
        }

        if (owner && transactions.transactions.length) {
            transactions.transactions = transactions.transactions.filter(t => t.virtualAccountDetails.borrowerAddress === owner);
        }

        return (
            <div>
                <Header {...this.props}/>
                <div className="page_margin row">
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
                                            className="ml-5">Total: {transactions.transactions.length}</span></h5>
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
                                                            <li>{t.virtualAccountDetails.policyDetails.type + ", " + t.virtualAccountDetails.policyDetails.value}</li>
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
                                                            </ul>
                                                        </div>
                                                        <div className="col">
                                                            <p style={{margin: 0, padding: 0, fontWeight: "bold"}}>Lender Share</p>
                                                            <ul className="transactions-list-item">
                                                                <li>Rs. {this.convertToRupees(t.lenderShare.shareAmount)}</li>
                                                                <li><b>{this.statusToString(t.lenderShare.status)}</b></li>
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
        dispatch({type: USER_VIEW_IS_LOADING, isLoading: true});

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
                dispatch({type: USER_VIEW_SET_TRANSACTIONS, transactions: results.reverse()});
            })
            .catch(error => {
                alert(error.toString());
            })
            .finally(() => {
                dispatch({type: USER_VIEW_IS_LOADING, isLoading: false});
            })
    };

    convertToRupees(amount) {
        return amount/Math.pow(10, this.props.web3js.indifiCoinContract.decimals)
    }

    statusToString = (status) => {
        switch (status) {
            case 0:
                return "Proposed Split";
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
}

const mapStateToProps = (state) => {
    return {
        web3js: state.web3js,
        userView: state.userView
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
