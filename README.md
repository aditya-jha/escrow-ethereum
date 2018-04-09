# Escrow Ethereum

## What is project about?
Escrow Ethereum is an Ethereum DAPP, a scaled down solidity port of the Escrow Solutions. The live version of the product uses virtual accounts and relational database. We are porting to
 Ethereum based DAPP.


## Running the  project
* Install truffle.js globally

> npm install -g truffle

* Navigate to the project directory and install dependencies

> npm install

* create a file named secret.config.json

> touch secret.config.json

* Add keys INFURA\_KEY and INDIFI\_ACCOUNT\_MNEMONIC

```json
{
"INFURA_KEY": "your_infura_api_key",
"INDIFI_ACCOUNT_MNEMONIC": "your_ethereum_account_mnemonic"
}
```

*  Start the development server

> npm run start

Now you can access the DAPP on [localhost:3000](http://localhost:3000)
