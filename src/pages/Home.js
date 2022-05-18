import React, { useState } from 'react';
import { Container, Button } from '@mui/material';
import Web3 from 'web3';
import { Contract, Web3Provider, Provider } from "zksync-web3";
import { ethers } from "ethers";

import RecoverableSafeFactory from '../artifacts-zk/contracts/RecoverableSafeFactory.sol/RecoverableSafeFactory.json';
import { connectCB } from '../config/coinbase-wallet';

const RSF_CONTRACT_ADDRESS = "0x63b3F646e124F161AC3ff9C7AA4E35a8a3F733A4";
const RSF_CONTRACT_ABI = RecoverableSafeFactory.abi;

function Home() {
  const [ethAddress, setEthAddress] = useState("");
  const [ethBalance, setETHBalance] = useState("");
  const [safeETHBalance, setSafeETHBalance] = useState(0);
  const [rsContract, setRSContract] = useState("");
  const [userSigner, setUserSigner] = useState(""); 
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

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
          setUserSigner(signer);

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
    const balance = await rsContract.getTokenAllowance("0", "0x5C221E77624690fff6dd741493D735a17716c26B");
    console.log(balance.toString());
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

  const depositToSafe = async () => {
    const transferHandle = userSigner.transfer({
      to: "0xf5F2e25c091A8449cc41185937E0217151dcd7Ee",
      token: "0x5C221E77624690fff6dd741493D735a17716c26B",
      amount: ethers.utils.parseEther(depositAmount),
      feeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    });

    console.log(transferHandle);
  }

  const withdrawToken = async () => {
    try {
      const txHandle = await rsContract.withdrawTokenfromSafe("0", "0x5C221E77624690fff6dd741493D735a17716c26B", ethers.utils.parseEther(withdrawAmount), {
        customData: {
          // Passing the token to pay fee with
          feeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        },
      });
  
      await txHandle.wait();
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
          <Button variant="contained" onClick={depositToSafe}>
            Deposit
          </Button>
          <br />
          <input value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
          <Button variant="contained" onClick={withdrawToken}>
            WithDraw
          </Button>
        </>
      )}
    </Container>
  )
}

export default Home;