/*
 * created by aditya on 12/03/18
 */

"use strict";

const Migrations = artifacts.require("./IncomingTransaction.sol");

module.exports = function(deployer) {
    deployer.deploy(Migrations);
};
