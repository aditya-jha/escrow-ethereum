/*
 * created by aditya on 12/03/18
 */

import React from "react";
import {Provider} from "react-redux";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Web3 from "web3";
import configureStore from "./reducers/store";
import {WEB3JS_NETWORK_ID, WEB3JS_SET_REFERENCE, SET_CONTRACT_REFERENCE} from "./reducers/web3js";
import MyWeb3 from "./models/MyWeb3";
import MuiThemeConfig from "./materialUIThemeConfig";

import IncomingTransactionContract from "./../build/contracts/IndifiCoin";
import {BrowserRouter as Router, Link, Switch, Route} from "react-router-dom";

import _404 from "./components/_404";
import * as URLS from "./data/Urls";
import IndifiCoin from "./containers/IndifiCoin";

const store = configureStore();
const muiTheme = getMuiTheme(MuiThemeConfig);

export default class App extends React.Component {
    constructor(props) {
        super();
    }

    componentDidMount() {
        if (typeof window.web3 !== "undefined") {
            // Use Mist/MetaMask's provider
            const web3js = new Web3(window.web3.currentProvider);
            // const web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
            const myWeb3Instance = new MyWeb3();
            myWeb3Instance.setWeb3Instance(web3js);

            store.dispatch({
                type: WEB3JS_SET_REFERENCE,
                web3js: myWeb3Instance
            });

            const {abi, networks} = IncomingTransactionContract;
            myWeb3Instance.getEthereumNetworkVersion().then(netId => {
                const {address} = networks[netId];
                const contract = myWeb3Instance.getContractReference(address, abi);
                store.dispatch({
                    type: SET_CONTRACT_REFERENCE,
                    contract: contract
                });
                window.contract = contract;
                store.dispatch({
                    network: netId,
                    type: WEB3JS_NETWORK_ID
                });
            }).catch(error => {
                console.log(error);
                // this.props.history.push(URL.ERROR_PAGE + this.props.location.pathname);
            });
        } else {
            console.log('No web3? You should consider trying MetaMask!')
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            /* TODO: leaving this for now */
        }
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <MuiThemeProvider muiTheme={muiTheme}>
                        <div>
                            <Link to={URLS.INDIFI_COIN}>Coin</Link>
                            <Switch>
                                <Route exact path={URLS.HOME} render={() => (<h2>Hi</h2>)}/>
                                <Route exact path={URLS.INDIFI_COIN} component={IndifiCoin}/>
                                <Route path="*" component={_404}/>
                            </Switch>
                        </div>
                    </MuiThemeProvider>
                </Router>
            </Provider>
        )
    }
}