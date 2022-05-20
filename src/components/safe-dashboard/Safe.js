import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import { Provider } from "zksync-web3";

import WalletTable from '../WalletTable';

const provider = new Provider('https://zksync2-testnet.zksync.dev');
const TOKEN_ADDRESSES = [
  {
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    symbol: "ETH"
  },
  {
    address: "0xd35CCeEAD182dcee0F148EbaC9447DA2c4D449c4",
    symbol: "USDC"
  },
  {
    address: "0x5C221E77624690fff6dd741493D735a17716c26B",
    symbol: "DAI"
  },
  {
    address: "0xCA063A2AB07491eE991dCecb456D1265f842b568",
    symbol: "wBTC"
  }
];

function Safe({ safeAddress, rsContract }) {
  const [withdrawAmount, setWithdrawAmount] = useState(0);
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
          balance: balance
        })
      }

      setSafeAssets(assets);
    } catch(error) {
      console.error(error);
    }
  }

  getSafeBalance();

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
    <div>
      <WalletTable userAssets={safeAssets} />
      <input value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
        <button variant="contained" onClick={withdrawToken}>
          WithDraw
        </button>
    </div>
  )
}

export default Safe;