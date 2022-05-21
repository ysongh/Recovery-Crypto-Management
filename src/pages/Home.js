import React from 'react';
import { useNavigate } from 'react-router-dom'
import { Container, Button } from '@mui/material';
import Web3 from 'web3';
import { Contract, Web3Provider } from "zksync-web3";
import { ethers } from "ethers";

import RecoverableSafeFactory from '../artifacts-zk/contracts/RecoverableSafeFactory.sol/RecoverableSafeFactory.json';
import { connectCB } from '../config/coinbase-wallet';

const RSF_CONTRACT_ADDRESS = "0x3E8aE2d515e00085087497fd7FAf81cc26da6887";
const RSF_CONTRACT_ABI = RecoverableSafeFactory.abi;

function Home({ setRSContract, setUserSigner, setEthAddress }) {
  const navigate = useNavigate();

  const connectCoinbaseWallet = () => {
    const ethereum = connectCB();
    const web3 = new Web3(ethereum);

    ethereum.request({ method: 'eth_requestAccounts' }).then(response => {
      const accounts = response;
      console.log(`User's address is ${accounts[0]}`)
      setEthAddress(accounts[0]);

      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(signer);

      const contract = new Contract(
        RSF_CONTRACT_ADDRESS,
        RSF_CONTRACT_ABI,
        signer
      );

      setRSContract(contract);
      navigate('./dashboard');
    
      // Optionally, have the default account set for web3.js
      web3.eth.defaultAccount = accounts[0]
    })
  }

  const connectMetaMask = async () => {
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(async () => {
        if (+window.ethereum.networkVersion == 280) {
          // Note that we still need to get the Metamask signer
          const signer = (new Web3Provider(window.ethereum)).getSigner();
          setUserSigner(signer);

          const contract = new Contract(
            RSF_CONTRACT_ADDRESS,
            RSF_CONTRACT_ABI,
            signer
          );
          setRSContract(contract);

          // const balanceInUnits = await signer.getBalance("0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
          // const balance = ethers.utils.formatUnits(balanceInUnits, "18");
          navigate('./dashboard');
        } else {
          alert("Please switch network to zkSync!");
        }
      })
      .catch((e) => console.log(e)); 
  }

  

  return (
    <Container maxWidth="lg">
      <h1>Recovery Crypto Management</h1>
      
      <Button variant="contained" onClick={connectCoinbaseWallet}>
        Get Started
      </Button>
      <Button variant="contained" onClick={connectMetaMask}>
        Connect Wallet
      </Button>
    </Container>
  )
}

export default Home;