"use strict";

const HDWalletProvider = require("truffle-hdwallet-provider");
const INFURA_KEY = "oZl5mQY289KieRzfBoeF";
const INDIFI_ACCOUNT_MNEMONIC = "journey peanut cruise anxiety spoon virus uncover like dice true strategy mutual";

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
