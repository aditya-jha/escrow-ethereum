/*
 * created by aditya on 05/02/18
 */

export const WEB3JS_SET_REFERENCE = "WEB3JS_SET_REFERENCE";
export const WEB3JS_NETWORK_ID = "WEB3JS_NETWORK_ID";
export const SET_INDIFI_COIN_CONTRACT_REFERENCE = "SET_INDIFI_COIN_CONTRACT_REFERENCE";
export const SET_ESCROW_TRANSACTIONS_CONTRACT_REFERENCE = "SET_ESCROW_TRANSACTIONS_CONTRACT_REFERENCE";
export const SET_SPLIT_CONTRACT_REFERENCE = "SET_SPLIT_CONTRACT_REFERENCE";

const defaultState = {
    web3js: null,
    network: null,
    indifiCoinContract: null,
    escrowTransactionsContract: null,
    splitContractReference: null
};

export function web3js(state = defaultState, action) {
    switch (action.type) {
        case WEB3JS_SET_REFERENCE:
            return {
                ...state,
                web3js: action.web3js
            };
        case WEB3JS_NETWORK_ID:
            return {
                ...state,
                network: action.network
            };
        case SET_INDIFI_COIN_CONTRACT_REFERENCE:
            return {
                ...state,
                indifiCoinContract: action.contract
            };
        case SET_ESCROW_TRANSACTIONS_CONTRACT_REFERENCE:
            return {
                ...state,
                escrowTransactionsContract: action.contract
            };
        case SET_SPLIT_CONTRACT_REFERENCE:
            return {
                ...state,
                splitContractReference: action.contract
            };
        default:
            return state;
    }
}

 