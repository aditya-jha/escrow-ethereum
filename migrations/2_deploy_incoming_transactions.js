/*
 * created by aditya on 12/03/18
 */

"use strict";

const IndifiCoin = artifacts.require("./IndifiCoin.sol");

module.exports = function(deployer) {
    deployer.deploy(IndifiCoin);
};
