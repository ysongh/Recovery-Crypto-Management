import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Container, Button } from '@mui/material';
import Web3 from 'web3';
import { Contract, Web3Provider } from "zksync-web3";
import UAuth from '@uauth/js';

import RecoverableSafeFactory from '../artifacts-zk/contracts/RecoverableSafeFactory.sol/RecoverableSafeFactory.json';
import { connectCB } from '../config/coinbase-wallet';
import { UNSTOPPABLEDOMAINS_CLIENTID, UNSTOPPABLEDOMAINS_REDIRECT_URI } from '../config/api-keys';

const RSF_CONTRACT_ADDRESS = "0x965059d3F3929828ae351A04856a7F9AA26d20d7";
const RSF_CONTRACT_ABI = RecoverableSafeFactory.abi;

const uauth = new UAuth({
  clientID: UNSTOPPABLEDOMAINS_CLIENTID,
  redirectUri: UNSTOPPABLEDOMAINS_REDIRECT_URI,
});

function Home({ setRSContract, setUserSigner, setEthAddress, setDomainData }) {
  const navigate = useNavigate();

  useEffect(() => {
    uauth
      .user()
      .then(userData => {
        console.log(userData);
        setDomainData(userData);
        setEthAddress(userData.wallet_address);
        navigate('./dashboard');
      })
      .catch(error => {
        console.error('profile error:', error);
      })
  }, [])

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
      .then(async accounts => {
        if (+window.ethereum.networkVersion == 280) {
          setEthAddress(accounts[0]);

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

  const loginWithUnstoppableDomains = async () => {
    try {
      const authorization = await uauth.loginWithPopup();
      authorization.sub = authorization.idToken.sub;
      console.log(authorization);

      setDomainData(authorization);
      setEthAddress(authorization.idToken.wallet_address);
      navigate('./dashboard');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column'}}>
      <h1 style={{ marginTop: '10rem'}}>Recovery Crypto Management</h1>
      <p style={{ marginBottom: '.5rem'}}>Store your Crypto on Recoverable Safe</p>
      
      <hr />
      <br />
      <Button variant="contained" onClick={connectCoinbaseWallet}>
        Connect With Coinbase Wallet
      </Button>
      <br />
      <Button variant="contained" onClick={loginWithUnstoppableDomains}>
        Connect With Unstoppable Domain
      </Button>
      <br />
      <Button variant="contained" onClick={connectMetaMask}>
        Connect With Metamask
      </Button>
    </Container>
  )
}

export default Home;