/*
 * created by aditya on 02/04/18
 */

export const USER_VIEW_SET_ACCOUNT_OWNER = "USER_VIEW_SET_ACCOUNT_OWNER";
export const USER_VIEW_SET_TRANSACTIONS = "USER_VIEW_SET_TRANSACTIONS";
export const USER_VIEW_IS_LOADING = "USER_VIEW_IS_LOADING";

let defaultState = {
    isLoading: true,
    accountOwner: null,
    transactions: []
};

export function userView(state = defaultState, action) {
    switch (action.type) {
        case USER_VIEW_SET_ACCOUNT_OWNER:
            return {
                ...state,
                accountOwner: action.accountOwner
            };
        case USER_VIEW_SET_TRANSACTIONS:
            return {
                ...state,
                transactions: action.transactions
            };
        case USER_VIEW_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            };
        default:
            return state;
    }
}
