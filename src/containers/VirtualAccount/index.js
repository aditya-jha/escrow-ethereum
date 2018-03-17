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
                                <h5 className="card-title text-center">Borrower Details</h5>
                                <input type="text" ref="virtualAccountNumber" placeholder="Virtual Account"/>
                                <input type="text" ref="borrowerAddress" placeholder="Borrower Address"/>
                                <input type="text" ref="lenderAddress" placeholder="Lender Address"/>
                            </div>

                            <div className="card-body">
                                <h5 className="card-title text-center">Policy Details</h5>
                                <select ref="policyType">
                                    <option value="">--Select--</option>
                                    <option value="1">Fixed</option>
                                    <option value="2">Percent</option>
                                </select>
                                <input type="text" ref="policyValue" placeholder="Policy Value"/>
                            </div>

                            <div className="card-body">
                                <h5 className="card-title text-center">Bank Account Details</h5>
                                <input type="text" ref="bankAccountNumber" placeholder="Account Number"/>
                                <input type="text" ref="ifscCode" placeholder="IFSC Code"/>
                            </div>
                            <button className="btn btn-primary" onClick={this.addVirtualAccount.bind(this)}>Create Account</button>
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