/*
 * created by aditya on 27/03/18
 */

export const VIRTUAL_ACCOUNTS_IS_LOADING = "VIRTUAL_ACCOUNTS_IS_LOADING";
export const VIRTUAL_ACCOUNTS_ERROR = "VIRTUAL_ACCOUNTS_ERROR";
export const VIRTUAL_ACCOUNTS_INIT = "VIRTUAL_ACCOUNTS_INIT";

let defaultState = {
    isLoading: true,
    error: null,
    accounts: []
};

export function virtualAccounts(state = defaultState, action) {
    switch (action.type) {
        case VIRTUAL_ACCOUNTS_ERROR:
            return {
                ...state,
                error: action.error
            };
        case VIRTUAL_ACCOUNTS_INIT:
            return {
                ...state,
                accounts: action.accounts
            };
        case VIRTUAL_ACCOUNTS_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            };
        default:
            return state;
    }
}