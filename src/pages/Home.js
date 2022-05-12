import React, { useState } from 'react';
import { Button } from "@chakra-ui/core";
import Web3 from 'web3';

import { connectCB } from '../config/coinbase-wallet';

function Home() {
  const [ethAddress, setEthAddress] = useState("");

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
  return (
    <div>
      <h1>Recovery Crypto Management</h1>
      <p>ETH Address: {ethAddress}</p>
      <Button colorScheme='blue' onClick={connectCoinbaseWallet}>Get Started</Button>
    </div>
  )
}

export default Home;