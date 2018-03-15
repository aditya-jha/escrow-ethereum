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
                {name: "Lender", address: "0x83546836c108b2e855f69dc1038ce5fbc4fef90a", balance: 0}]
        }
    }

    refreshBalances = () => {
        const {contract} = this.props.web3js;
        const {accounts} = this.state;

        Promise.all(accounts.map(account => contract.getBalance(account.address)))
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

    createTokens = () => {
        const {contract} = this.props.web3js;
        debugger;
        contract.createTokens()
    };

    render() {
        const {accounts} = this.state;

        return (
            <div>
                <div className="row">
                    <div className="col-6">
                        <div className="card my-3 ml-3 mt-3 mr-3">
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
                        <div className="card my-3 ml-3 mt-3 mr-3">
                            <div className="card-body">
                                <h5 className="card-title text-center">Add Transaction</h5>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card my-3 ml-3 mt-3 mr-3">
                            <div className="card-body">
                                <h5 className="card-title text-center">Create Tokens</h5>
                                <div className="form-group">
                                    <input type="number" className="form-control" id="createTokensInput"/>
                                </div>
                                <br/>
                                <button className="btn btn-primary" onClick={this.createTokens.bind(this)}>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
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