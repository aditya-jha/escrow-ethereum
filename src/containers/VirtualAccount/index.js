/**
 * @author [Sahil Jadon]
 * @create date 2018-03-17 03:42:22
*/
import React from "react";
class VirtualAccount extends React.Component {
    render() {
        return (
            <form style={{width: "50%", margin: "auto"}}>
                <div className="card my-3 ml-3 mt-3 mr-2">
                <div className="card-body">
                    <h5 className="card-title text-center">Borrower Details</h5>
                    <input type="text" ref="virtualAccount" placeholder="Virtual Account"/>
                    <input type="text" ref="borrowerAddress" placeholder="Borrower Address"/>
                    <input type="text" ref="lenderAddress" placeholder="Lender Address"/>
                </div>

                <div className="card-body">
                    <h5 className="card-title text-center">Policy Details</h5>
                    <select ref="policyType">
                        <option value="">--Select--</option>
                        <option value="fix">Fixed</option>
                        <option value="percent">Percent</option>
                    </select>
                    <input type="text" ref="policyValue" placeholder="Policy Value"/>
                </div>

                <div className="card-body">
                    <h5 className="card-title text-center">Bank Account Details</h5>
                    <input type="text" ref="bankAccountNumber" placeholder="Account Number"/>
                    <input type="text" ref="ifscCode" placeholder="IFSC Code"/>
                </div>
                <input type="submit" value="Submit"/>
                </div>
            </form>

        )
    }   
}

export default VirtualAccount;