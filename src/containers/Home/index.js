/*
 * created by aditya on 17/03/2018
 */

import React from "react";
import {connect} from "react-redux";
import Header from "./../../components/Header";

class Home extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <div>
                <Header {...this.props}/>
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return state;
};


const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
