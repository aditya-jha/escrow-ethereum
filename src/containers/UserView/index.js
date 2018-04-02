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
        ...state
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
