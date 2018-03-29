/*
 * created by aditya on 12/03/18
 */

import React from "react";
import {Provider} from "react-redux";
import Web3 from "web3";
import configureStore from "./reducers/store";
import {
    WEB3JS_NETWORK_ID, WEB3JS_SET_REFERENCE, SET_INDIFI_COIN_CONTRACT_REFERENCE,
    SET_ESCROW_TRANSACTIONS_CONTRACT_REFERENCE, SET_SPLIT_CONTRACT_REFERENCE
} from "./reducers/web3js";
import MyWeb3 from "./models/MyWeb3";
import {
    IndifiCoinContract,
    EscrowTransactionsContract,
    SplitContract
} from "./models/contracts";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import _404 from "./components/_404";
import * as URLS from "./data/Urls";
import IndifiCoin from "./containers/IndifiCoin";
import Home from "./containers/Home";
import VirtualAccount from "./containers/VirtualAccount";
import Transactions from "./containers/Transactions";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";

import "./styles/index.css";

const store = configureStore();

let indifiCoinContractEvents, escrowTransactionContractEvents;

export default class App extends React.Component {
    constructor(props) {
        super();
    }

    componentDidMount() {
        if (typeof window.web3 !== "undefined") {
            // Use Mist/MetaMask's provider
            const web3js = new Web3(window.web3.currentProvider);
            const myWeb3Instance = new MyWeb3();
            myWeb3Instance.setWeb3Instance(web3js);

            store.dispatch({
                type: WEB3JS_SET_REFERENCE,
                web3js: myWeb3Instance
            });

            myWeb3Instance.getEthereumNetworkVersion().then(netId => {
                const indifiCoinContractRef = myWeb3Instance.getContractReference(
                    IndifiCoinContract.getContractJson().networks[netId].address, 
                    IndifiCoinContract.getContractJson().abi
                );
                const indifiCoinContractInstance = new IndifiCoinContract(indifiCoinContractRef, myWeb3Instance);
                
                const escrowTransactionsContractRef = myWeb3Instance.getContractReference(
                    EscrowTransactionsContract.getContractJson().networks[netId].address,
                    EscrowTransactionsContract.getContractJson().abi
                );
                const escrowTransactionsContractInstance = new EscrowTransactionsContract(escrowTransactionsContractRef, myWeb3Instance);

                const splitContratRef = myWeb3Instance.getContractReference(
                    SplitContract.getContractJson().networks[netId].address,
                    SplitContract.getContractJson().abi
                );
                const splitContractInstance = new SplitContract(splitContratRef, myWeb3Instance);

                store.dispatch({
                    type: SET_SPLIT_CONTRACT_REFERENCE,
                    contract: splitContractInstance
                });

                store.dispatch({
                    type: SET_INDIFI_COIN_CONTRACT_REFERENCE,
                    contract: indifiCoinContractInstance
                });

                store.dispatch({
                    type: SET_ESCROW_TRANSACTIONS_CONTRACT_REFERENCE,
                    contract: escrowTransactionsContractInstance
                });

                window.indifiCoinContract = indifiCoinContractInstance;
                window.escrowTransactionsContract = escrowTransactionsContractInstance;
                window.splitContractReference = splitContractInstance;

                indifiCoinContractEvents = indifiCoinContractRef.allEvents();
                indifiCoinContractEvents.watch((error, event) => {
                    if (error) {
                        console.log("Error: " + error);
                    } else {
                        console.log(event.event + ": " + JSON.stringify(event.args));
                    }
                });
                
                escrowTransactionContractEvents = escrowTransactionsContractRef.allEvents();
                escrowTransactionContractEvents.watch((error, event) => {
                    if (error) {
                        console.log("Error: " + error); 
                    } else {
                        console.log(event.event + ": " + JSON.stringify(event.args));
                    }
                });

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
                    <div>
                        <Switch>
                            <Route exact path={URLS.HOME} component={Home}/>
                            <Route exact path={URLS.INDIFI_COIN} component={IndifiCoin}/>
                            <Route exact path={URLS.VIRTUAL_ACCOUNTS} component={VirtualAccount}/>
                            <Route exact path={URLS.TRANSACTIONS} component={Transactions}/>
                            <Route path="*" component={_404}/>
                        </Switch>
                    </div>
                </Router>
            </Provider>
        )
    }
}