# Recovery Crypto Management
A Dapp where you can store your cryptos on the Recoverable Safe contract

## Technologies
- React 17
- Material UI
- hardhat-zksync
- zksync-web3
- zkSync - I deployed the contract on zkSync Testnet for cheap gas fee and allow anyone to pay the gas fee with any tokens
- Unstoppable Domains - Allow the user to login with Unstoppable

## Running the dapp on local host
- Clone or download this repository
- Run `yarn install` to install the dependencies
- Create a file called '.env' on the root folder and add the following code
```
ALCHEMYAPI_KEY = <KEY from Goerli Network>
```
- Run Docker and run `yarn hardhat compile` to compile contract
- Run `yarn hardhat deploy-zksync` to deploy contract
- Create a file called 'api-keys.js' on the src/config folder and add the following code
```
export const UNSTOPPABLEDOMAINS_CLIENTID = <KEY>;
export const UNSTOPPABLEDOMAINS_REDIRECT_URI = <KEY>;
export const CONTRACT_ADDRESS = <contract address from runing 'yarn hardhat deploy-zksync'>;
```
- Run `yarn start` to start the dapp

## Disclaimer
These contracts are not audited.  Please review this code on your own before using any of the following code for production.  I will not be responsible or liable for all loss or damage caused from this project.