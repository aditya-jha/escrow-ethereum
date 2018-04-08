/*
 * created by aditya on 02/04/18
 */

import React from "react";
import {
    Header,
    Loader
} from "./../../components";
import {connect} from "react-redux";

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
        return (
            <div>
                <Header {...this.props}/>
                <div className="page_margin row">
                    <h1 className="col text-center">User View</h1>
                </div>
            </div>
        )
    }
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
