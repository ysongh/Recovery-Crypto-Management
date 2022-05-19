import React, { useEffect, useState } from 'react';
import { Box, Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Divider, ListItem, ListItemText, ListItemButton, Button } from '@mui/material';
import { Provider } from "zksync-web3";
import { ethers } from "ethers";

import WalletTable from './safe-dashboard/WalletTable';

const provider = new Provider('https://zksync2-testnet.zksync.dev');
const drawerWidth = 200;
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

function SafeDashboard({ rsContract, ethAddress, userSigner }) {
  const [safeETHBalance, setSafeETHBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [userAssets, setUserAssets] = useState([]);

  useEffect(() => {
    getWalletBalance();
  }, [rsContract])
  
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
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Recovery Crypto Management
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {['Your Wallet', 'Your Safe'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <p>ETH Address: {ethAddress}</p>

        <WalletTable
          userAssets={userAssets} />

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
      </Box>
    </Box>
  )
}

export default SafeDashboard;