import React, { useEffect, useState } from 'react';
import { Box, Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Divider, ListItem, ListItemText, ListItemButton, Button } from '@mui/material';
import { Provider } from "zksync-web3";
import { ethers } from "ethers";

import UserWallet from '../components/safe-dashboard/UserWallet';
import Safe from '../components/safe-dashboard/Safe';

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
  const [safeAddress, setSafeAddress] = useState("");
  const [currentSection, setCurrentSection] = useState("Your Wallet");
  const [userAssets, setUserAssets] = useState([]);

  useEffect(() => {
    if(rsContract) {
      getSafeAddress();
      getWalletBalance();
    }
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

  const getSafeAddress = async () => {
    const address = await rsContract.getSafeContract();
    setSafeAddress(address);
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
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} onClick={() => setCurrentSection(text)}/>
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
        <p>Safe Address: {safeAddress}</p>

        {safeAddress === "0x0000000000000000000000000000000000000000"
          ?  <Button variant="contained" onClick={createSafe} style={{ marginTop: '1rem'}}>
              Create Safe
            </Button>
          : <>
              {currentSection === "Your Wallet"
                && <UserWallet
                  userAssets={userAssets}
                  userSigner={userSigner}
                  safeAddress={safeAddress}
                  getWalletBalance={getWalletBalance} /> }
              {currentSection === "Your Safe"
                && <Safe
                  safeAddress={safeAddress}
                  rsContract={rsContract} />}
          </>}
        
      </Box>
    </Box>
  )
}

export default SafeDashboard;