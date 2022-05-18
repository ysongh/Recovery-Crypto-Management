import React, { useState } from 'react';
import { Container, Button } from '@mui/material';
import Web3 from 'web3';
import { Contract, Web3Provider, Provider } from "zksync-web3";
import { ethers } from "ethers";

import RecoverableSafeFactory from '../artifacts-zk/contracts/RecoverableSafeFactory.sol/RecoverableSafeFactory.json';
import { connectCB } from '../config/coinbase-wallet';

const RSF_CONTRACT_ADDRESS = "0x86498B8C456454305ED75f9C87e5687FC6B95CA9";
const RSF_CONTRACT_ABI = RecoverableSafeFactory.abi;

function Home() {
  const [ethAddress, setEthAddress] = useState("");
  const [ethBalance, setETHBalance] = useState("");
  const [safeETHBalance, setSafeETHBalance] = useState(0);
  const [rsContract, setRSContract] = useState(""); 
  const [depositAmount, setDepositAmount] = useState(0);

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
            RSF_CONTRACT_ADDRESS,
            RSF_CONTRACT_ABI,
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

  const getBalance = async () => {
    const balance = await rsContract.getETHBalance("0");
    console.log(balance);
    setSafeETHBalance(balance.toString());
  }

  const createSafe = async () => {
    const txHandle = await rsContract.createRecoverableSafe({
      customData: {
        // Passing the token to pay fee with
        feeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      },
    });

    await txHandle.wait();
  }

  const depositETH = async () => {
    try {
      const txHandle = await rsContract.depositETHToSafe("0", {
        customData: {
          // Passing the token to pay fee with
          feeToken: "0x5C221E77624690fff6dd741493D735a17716c26B",
          value: depositAmount
        },
      });
  
      await txHandle.wait();
      await getBalance();
    }
    catch(error) {
      console.error(error);
      console.log(error.transaction.value.toString());
    }
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
          <Button variant="contained" onClick={getBalance}>
            Get balance
          </Button>
          <Button variant="contained" onClick={createSafe}>
            Create Safe
          </Button>
          <br />
          <br />
          <p>Safe ETH balance: {safeETHBalance}</p>
          <input value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
          <Button variant="contained" onClick={depositETH}>
            Deposit
          </Button>
        </>
      )}
    </Container>
  )
}

export default Home;