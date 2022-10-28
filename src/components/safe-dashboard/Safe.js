import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { ethers } from "ethers";
import { Provider } from "zksync-web3";

import WalletTable from '../common/WalletTable';
import ActionDialog from '../common/ActionDialog';
import { TOKEN_ADDRESSES } from '../../config/token-addresses';

const provider = new Provider('https://zksync2-testnet.zksync.dev');

function Safe({ safeAddress, userAssets, rsContract }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [feeToken, setFeeToken] = useState("");
  const [selectedToken, setSelectedToken] = useState("");
  const [safeAssets, setSafeAssets] = useState([]);

  useEffect(() => {
    if(safeAddress) {
      getSafeBalance();
    }
  }, [safeAddress])

  const getSafeBalance = async () => {
    try{
      const assets = [];
      for(let i = 0; i < TOKEN_ADDRESSES.length; i++) {
        const balanceInUnits = await provider.getBalance(safeAddress, "latest", TOKEN_ADDRESSES[i].address);
        const balance = ethers.utils.formatUnits(balanceInUnits, "18");
        assets.push({
          address: TOKEN_ADDRESSES[i].address,
          symbol: TOKEN_ADDRESSES[i].symbol,
          decimal: TOKEN_ADDRESSES[i].decimal,
          balance: balance
        })
      }

      setSafeAssets(assets);
    } catch(error) {
      console.error(error);
    }
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

  const withdrawToken = async () => {
    try {
      const txHandle = await rsContract.withdrawTokenfromSafe(selectedToken, ethers.utils.parseEther(amount), {
        customData: {
          // Passing the token to pay fee with
          feeToken: feeToken
        },
      });
  
      await txHandle.wait();
      setOpen(false);
    }
    catch(error) {
      console.error(error);
      console.log(error.transaction.value.toString());
    }
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
      <h1>Your Safe</h1>
      {safeAddress === "0x0000000000000000000000000000000000000000"
        ? <Button variant="contained" onClick={createSafe} style={{ marginTop: '1rem'}}>
            Create Safe
          </Button>
        : <WalletTable
        assets={safeAssets}
        handleClickOpen={handleClickOpen}
        type="Withdraw" />
      }
      
      <ActionDialog
        open={open}
        onClose={handleClose}
        amount={amount}
        userAssets={userAssets}
        setAmount={setAmount}
        action={withdrawToken}
        handleClickOpen={handleClickOpen}
        feeToken={feeToken}
        setFeeToken={setFeeToken}
        type="Withdraw" />
    </div>
  )
}

export default Safe;