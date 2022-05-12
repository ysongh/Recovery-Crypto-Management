import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

const APP_NAME = 'Recovery Crypto Management';
const APP_LOGO_URL = 'https://example.com/logo.png';
const DEFAULT_ETH_JSONRPC_URL = 'https://rpc-mainnet.matic.quiknode.pro';
const DEFAULT_CHAIN_ID = 80001;

export const connectCB = () => {
  // Initialize Coinbase Wallet SDK
  const coinbaseWallet = new CoinbaseWalletSDK({
    appName: APP_NAME,
    appLogoUrl: APP_LOGO_URL,
    darkMode: false
  });

  const ethereum = coinbaseWallet.makeWeb3Provider(DEFAULT_ETH_JSONRPC_URL, DEFAULT_CHAIN_ID);
  return ethereum;
}
