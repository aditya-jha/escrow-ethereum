/*
 * created by aditya on 12/03/18
 */

import {
    createStore,
    applyMiddleware,
    compose
} from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";

import reducers from "./index";

let middleware = [thunk, logger];

export default function configureStore() {
    // const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const composeEnhancers = compose;
    return createStore(
        reducers,
        composeEnhancers(applyMiddleware(...middleware))
    )
}


