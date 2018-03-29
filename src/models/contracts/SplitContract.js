/*
 * created by aditya on 29/03/18
 */

import BaseContract from "./BaseContract";
import ContractJson from "../../../build/contracts/SplitContract.json";

export default class SplitContract extends BaseContract {
    static getContractJson() {
        return ContractJson;
    }

    split = (amount, policyDetails) => {
        console.log(amount);
        console.log(policyDetails);
        return new Promise((resolve, reject) => {
            this.contract.split.call(amount, policyDetails, SplitContract.callback(resolve, reject));
        }).then(result => {
            return result.toNumber();
        })
    }
}