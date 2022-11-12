import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Container, Card, CardContent, Button } from '@mui/material';
import { Contract, Web3Provider } from "zksync-web3";
import UAuth from '@uauth/js';

import RecoverableSafeFactory from '../artifacts-zk/contracts/RecoverableSafeFactory.sol/RecoverableSafeFactory.json';
import { UNSTOPPABLEDOMAINS_CLIENTID, UNSTOPPABLEDOMAINS_REDIRECT_URI, CONTRACT_ADDRESS } from '../config/api-keys';

const RSF_CONTRACT_ADDRESS = CONTRACT_ADDRESS;
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
      <Card style={{ marginTop: '10rem' }}>
        <CardContent>
          <h1 style={{ marginBottom: '.3rem' }}>Recovery Crypto Management</h1>
          <p style={{ marginBottom: '.5rem'}}>Store your Crypto on Recoverable Safe (zksync testnet)</p>
          
          <hr />
          <br />
          <Button variant="contained" onClick={loginWithUnstoppableDomains} fullWidth>
            Connect With Unstoppable Domain
          </Button>
          <br />
          <br />
          <Button variant="contained" onClick={connectMetaMask} fullWidth>
            Connect With Metamask
          </Button>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Home;