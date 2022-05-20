import React, { useEffect, useState } from 'react';
import { Provider } from "zksync-web3";
import { ethers } from "ethers";

import WalletTable from '../WalletTable';
import ActionDialog from '../ActionDialog';
import { TOKEN_ADDRESSES } from '../../config/token-addresses';

const provider = new Provider('https://zksync2-testnet.zksync.dev');

function UserWallet({ userSigner, safeAddress }) {
  const [open, setOpen] = useState(false);
  const [userAssets, setUserAssets] = useState([]);
  const [selectedToken, setSelectedToken] = useState("");
  const [feeToken, setFeeToken] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if(userSigner) {
      getWalletBalance();
    }
  }, [userSigner])

  const getWalletBalance = async () => {
    try{
      const assets = [];
      for(let i = 0; i < TOKEN_ADDRESSES.length; i++) {
        const balanceInUnits = await provider.getBalance("0x4d7FB3b1F1dae456b814f2173aA64BaAfBd8f7ba", "latest", TOKEN_ADDRESSES[i].address);
        const balance = ethers.utils.formatUnits(balanceInUnits, "18");
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
      <WalletTable
        assets={userAssets}
        handleClickOpen={handleClickOpen}
        type="Deposit" />
      <ActionDialog
        open={open}
        onClose={handleClose}
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