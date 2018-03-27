/*
 * created by aditya on 18/03/2018
 */

export const TRANSACTIONS_INIT_TRANSACTIONS = "TRANSACTIONS_INIT_TRANSACTIONS";
export const TRANSACTIONS_TOTAL_TRANSACTIONS = "TRANSACTIONS_TOTAL_TRANSACTIONS";
export const TRANSACTIONS_IS_LOADING = "TRANSACTIONS_IS_LOADING";

let defaultState = {
    isLoading: true,
    transactions: [],
    total: 0
};

export function transactions(state = defaultState, action) {
    switch(action.type) {
        case TRANSACTIONS_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            };
        case TRANSACTIONS_INIT_TRANSACTIONS:
            return {
                ...state,
                transactions: action.transactions
            };
        case TRANSACTIONS_TOTAL_TRANSACTIONS:
            return {
                ...state,
                total: action.total
            };
        default:
            return state;
    }
}
