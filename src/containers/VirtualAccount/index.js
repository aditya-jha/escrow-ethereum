/**
 * @author [Sahil Jadon]
 * @create date 2018-03-17 03:42:22
*/
import React from "react";
import Header from "./../../components/Header";
import {connect} from "react-redux";

class VirtualAccount extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <div>
                <Header {...this.props} />
                <div className="page_margin">
                    <div style={{width: "50%", margin: "auto"}}>
                        <div className="card my-3 ml-3 mt-3 mr-2">
                            <div className="card-body">
                                <h5 className="card-title text-center">Virtual Account Details</h5>
                                <div className="form-group">
                                    <input type="text" ref="virtualAccountNumber" placeholder="Virtual Account Number" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <input type="text" ref="borrowerAddress" placeholder="Borrower Wallet Address" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <input type="text" ref="lenderAddress" placeholder="Lender Wallet Address" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <select ref="policyType" className="form-control">
                                        <option value="">--Policy Type--</option>
                                        <option value="1">Fixed</option>
                                        <option value="2">Percent</option>
                                    </select>
                                </div>
                                <div className="form-group">    
                                    <input type="text" ref="policyValue" placeholder="Policy Value" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <input type="text" ref="bankAccountNumber" placeholder="Bank Account Number" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <input type="text" ref="ifscCode" placeholder="IFSC Code" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-primary form-control" onClick={this.addVirtualAccount.bind(this)}>Create Account</button>
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-primary form-control" onClick={this.getVirtualAccounts.bind(this)}>Get Accounts</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
    
    addVirtualAccount = (event) => {
        const {escrowTransactionsContract} = this.props.web3js;
        const virtualAccountNumber = this.refs.virtualAccountNumber.value;
        const policyType = this.refs.policyType.value;
        const policyValue = this.refs.policyValue.value;
        const borrower = this.refs.borrowerAddress.value;
        const lender = this.refs.lenderAddress.value;
        const bankAccount = this.refs.bankAccountNumber.value;
        const ifscCode = this.refs.ifscCode.value;
        escrowTransactionsContract.updateVirtualAccountConfiguration(virtualAccountNumber, [policyType, policyValue], borrower, lender, bankAccount, ifscCode)
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        });
    }

    getVirtualAccounts = (event) => {
        const {escrowTransactionsContract} = this.props.web3js;
        escrowTransactionsContract.getAllVirtualAccounts()
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

export default connect(mapStateToProps, mapDispatchToProps)(VirtualAccount);