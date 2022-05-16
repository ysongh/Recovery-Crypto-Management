import React, { useState } from 'react';
import { Container, Button } from '@mui/material';
import Web3 from 'web3';
import { Contract, Web3Provider, Provider } from "zksync-web3";
import { ethers } from "ethers";

import RecoverableSafeFactory from '../artifacts-zk/contracts/RecoverableSafeFactory.sol/RecoverableSafeFactory.json';
import { connectCB } from '../config/coinbase-wallet';

const GREETER_CONTRACT_ADDRESS = "0x3D63e9B9269f937e8C1D372E01AB29Ee48c9d111";
const GREETER_CONTRACT_ABI = RecoverableSafeFactory.abi;

function Home() {
  const [ethAddress, setEthAddress] = useState("");
  const [ethBalance, setETHBalance] = useState("");
  const [rsContract, setRSContract] = useState(""); 
  const [text, setText] = useState("");
  const [newText, setNewText] = useState("");

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
      .then(async () => {
        if (+window.ethereum.networkVersion == 280) {
          const provider = new Provider('https://zksync2-testnet.zksync.dev');
    
          // Note that we still need to get the Metamask signer
          const signer = (new Web3Provider(window.ethereum)).getSigner();

          const contract = new Contract(
              GREETER_CONTRACT_ADDRESS,
              GREETER_CONTRACT_ABI,
              signer
          );
          setRSContract(contract);

          const balanceInUnits = await signer.getBalance("0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
          const balance = ethers.utils.formatUnits(balanceInUnits, "18");
          setETHBalance(balance);
        } else {
          alert("Please switch network to zkSync!");
        }
      })
      .catch((e) => console.log(e)); 
  }

  const getGreetingList = async () => {
    const data = await rsContract.getGreeting("0");
    console.log(data);
    setText(data);
  }

  const createGreeting = async () => {
    const txHandle = await rsContract.createGreetContract("Hello", {
      customData: {
        // Passing the token to pay fee with
        feeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      },
    });

    await txHandle.wait();
  }

  const setGreeting = async () => {
    const txHandle = await rsContract.setGreeting("0", newText, {
      customData: {
        // Passing the token to pay fee with
        feeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      },
    });

    await txHandle.wait();
    await getGreetingList();
  }

  return (
    <Container maxWidth="lg">
      <h1>Recovery Crypto Management</h1>
      <p>ETH Address: {ethAddress}</p>
      <p>Balance: {ethBalance} ETH</p>
      <Button variant="contained" onClick={connectCoinbaseWallet}>
        Get Started
      </Button>
      <Button variant="contained" onClick={connectMetaMask}>
        Connect Wallet
      </Button>
      <br />
      <br />
      {rsContract && (
        <>
          <Button variant="contained" onClick={getGreetingList}>
            Get Greeting
          </Button>
          <Button variant="contained" onClick={createGreeting}>
            Create Greeting
          </Button>
          <br />
          <br />
          <input value={newText} onChange={(e) => setNewText(e.target.value)} />
          <Button variant="contained" onClick={setGreeting}>
            Set Greeting
          </Button>
        </>
      )}
      <p>{text}</p>
    </Container>
  )
}

export default Home;