/*
 * created by aditya on 29/01/18
 */

import {combineReducers} from "redux";
import {web3js} from "./web3js/index";
import {transactions} from "./Transactions/index";

export default combineReducers({
    web3js,
    transactions
});
