import React, { useState } from 'react';
import { Button } from "@chakra-ui/core";
import Web3 from 'web3';
import { Contract, Web3Provider, Provider } from "zksync-web3";
import { ethers } from "ethers";

import RecoverableSafeFactory from '../artifacts-zk/contracts/RecoverableSafeFactory.sol/RecoverableSafeFactory.json';
import { connectCB } from '../config/coinbase-wallet';

const GREETER_CONTRACT_ADDRESS = "0x3D63e9B9269f937e8C1D372E01AB29Ee48c9d111";
const GREETER_CONTRACT_ABI = RecoverableSafeFactory.abi;

function Home() {
  const [ethAddress, setEthAddress] = useState("");
  console.log(GREETER_CONTRACT_ABI)

  const connectCoinbaseWallet = () => {
    const ethereum = connectCB();
    const web3 = new Web3(ethereum);

    ethereum.request({ method: 'eth_requestAccounts' }).then(response => {
      const accounts = response;
      console.log(`User's address is ${accounts[0]}`)
      setEthAddress(accounts[0]);
    
      // Optionally, have the default account set for web3.js
      web3.eth.defaultAccount = accounts[0]
    })

    console.log(web3);
  }

  const connectMetaMask = async () => {
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        if (+window.ethereum.networkVersion == 280) {
          const provider = new Provider('https://zksync2-testnet.zksync.dev');
    
          // Note that we still need to get the Metamask signer
          const signer = (new Web3Provider(window.ethereum)).getSigner();

          const contract = new Contract(
              GREETER_CONTRACT_ADDRESS,
              GREETER_CONTRACT_ABI,
              signer
          );

          console.log(provider, contract);
        } else {
          alert("Please switch network to zkSync!");
        }
      })
      .catch((e) => console.log(e)); 
  }

  return (
    <div>
      <h1>Recovery Crypto Management</h1>
      <p>ETH Address: {ethAddress}</p>
      <Button colorScheme='blue' onClick={connectCoinbaseWallet}>Get Started</Button>
      <Button colorScheme='blue' onClick={connectMetaMask}>Connect Wallet</Button>
    </div>
  )
}

export default Home;