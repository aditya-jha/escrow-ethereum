/*
 * created by aditya on 05/02/18
 */

export const WEB3JS_SET_REFERENCE = "WEB3JS_SET_REFERENCE";
export const WEB3JS_NETWORK_ID = "WEB3JS_NETWORK_ID";
export const SET_CONTRACT_REFERENCE = "SET_CONTRACT_REFERENCE";

const defaultState = {
    web3js: null,
    network: null,
    contract: null
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
        case SET_CONTRACT_REFERENCE:
            return {
                ...state,
                contract: action.contract
            };
        default:
            return state;
    }
}

 