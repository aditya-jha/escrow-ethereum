/*
 * created by aditya on 20/02/18
 */

import React from "react";
import * as URL from "./../../data/Urls";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

class Header extends React.Component {
    constructor(props) {
        super();
        this.links = [{
            name: "Virtual Account",
            href: URL.VIRTUAL_ACCOUNTS
        }, {
            name: "Transactions",
            href: URL.TRANSACTIONS
        }, {
            name: "Coin",
            href: URL.INDIFI_COIN
        }]
    }

    render() {
        const {location} = this.props;

        return (
            <nav className="navbar navbar-dark bg-primary navbar-expand-md fixed-top my_header">
                <div className="container">
                    <Link className="navbar-brand" to={URL.HOME}>Escrow Ethereum</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarContent">
                        <ul className="navbar-nav mr-auto">
                            {this.links.map(link => (
                                <li key={link.name} className={location.pathname === link.href ? "nav-item ml-3 active" : "nav-item ml-3"}>
                                    <Link className="nav-link" to={link.href}>{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ...state.AppState,
        ...ownProps
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch: dispatch
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);