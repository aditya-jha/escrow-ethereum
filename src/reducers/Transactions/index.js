/*
 * created by aditya on 18/03/2018
 */

export const INIT_TRANSACTIONS = "INIT_TRANSACTIONS";

let defaultState = {
    transactions: []
}

export function transactions(state = defaultState, action) {
    switch(action.type) {
        case INIT_TRANSACTIONS:
            return {
                ...state,
                transactions: action.transactions
            }
        default:
            return state;
    }
}
