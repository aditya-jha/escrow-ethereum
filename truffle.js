"use strict";

const HDWalletProvider = require("truffle-hdwallet-provider");
const fs = require("fs");
const path = require("path");

let secrets = {};
const secretFilePath = path.resolve(__dirname, "secret.config.json");
if (fs.existsSync(secretFilePath)) {
    secrets = JSON.parse(fs.readFileSync(secretFilePath).toString());
}

const INFURA_KEY = secrets.INFURA_KEY || process.env.ESCROW_INFURA_KEY;
const INDIFI_ACCOUNT_MNEMONIC = secrets.INDIFI_ACCOUNT_MNEMONIC || process.env.ESCROW_INDIFI_ACCOUNT_MNEMONIC;

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*"
        },
        rinkeby: {
            provider: new HDWalletProvider(INDIFI_ACCOUNT_MNEMONIC, "https://rinkeby.infura.io/ " + INFURA_KEY),
            network_id: 3
        }
    }
};
