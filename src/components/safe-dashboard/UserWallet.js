import React, { useEffect, useState } from 'react';
import { Provider } from "zksync-web3";
import { ethers } from "ethers";

import WalletTable from '../common/WalletTable';
import ActionDialog from '../common/ActionDialog';
import { TOKEN_ADDRESSES } from '../../config/token-addresses';

const provider = new Provider('https://zksync2-testnet.zksync.dev');

function UserWallet({ ethAddress, userSigner, userAssets, safeAddress, setUserAssets }) {
  const [open, setOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState("");
  const [feeToken, setFeeToken] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if(ethAddress) {
      getWalletBalance();
    }
  }, [ethAddress])

  const getWalletBalance = async () => {
    try{
      const assets = [];
      for(let i = 0; i < TOKEN_ADDRESSES.length; i++) {
        const balanceInUnits = await provider.getBalance(ethAddress, "latest", TOKEN_ADDRESSES[i].address);
        const balance = ethers.utils.formatUnits(balanceInUnits, TOKEN_ADDRESSES[i].decimal);
        assets.push({
          address: TOKEN_ADDRESSES[i].address,
          symbol: TOKEN_ADDRESSES[i].symbol,
          balance: balance
        })
      }

      setUserAssets(assets);
    } catch(error) {
      console.error(error);
    }
  }

  const depositToSafe = async () => {
    const transferHandle = await userSigner.transfer({
      to: safeAddress,
      token: selectedToken,
      amount: ethers.utils.parseEther(amount),
      feeToken: feeToken,
    });

    console.log(transferHandle);
    getWalletBalance();
    setOpen(false);
  }

  const handleClickOpen = (tokenAddress) => {
    setSelectedToken(tokenAddress);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <div>
      <h1>Your Wallet</h1>
      <WalletTable
        assets={userAssets}
        handleClickOpen={handleClickOpen}
        type="Deposit" />
      <ActionDialog
        open={open}
        onClose={handleClose}
        userAssets={userAssets}
        amount={amount}
        setAmount={setAmount}
        action={depositToSafe}
        handleClickOpen={handleClickOpen}
        feeToken={feeToken}
        setFeeToken={setFeeToken}
        type="Deposit" />
    </div>
  )
}

export default UserWallet;