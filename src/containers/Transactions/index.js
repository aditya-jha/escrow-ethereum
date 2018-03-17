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
        return(
            <div>
                <Header {...this.props}/>
                <div className="page_margin">
                    <h2>Transactions</h2>
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

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);