import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Box, Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Divider, ListItem, ListItemIcon, ListItemText, ListItemButton, Button } from '@mui/material';
import UAuth from '@uauth/js';

import UserWallet from '../components/safe-dashboard/UserWallet';
import Safe from '../components/safe-dashboard/Safe';
import Setting from '../components/safe-dashboard/Setting';
import Recover from '../components/safe-dashboard/Recover';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';

import { UNSTOPPABLEDOMAINS_CLIENTID, UNSTOPPABLEDOMAINS_REDIRECT_URI } from '../config/api-keys';

const drawerLinks = [
  {
    "text": "Your Wallet",
    "icon": <AccountBalanceWalletIcon />
  },
  {
    "text": "Your Safe",
    "icon": <InventoryIcon />
  },
  {
    "text": "Setting",
    "icon": <SettingsIcon />
  },
  {
    "text": "Recover",
    "icon": <DataSaverOnIcon />
  }
];
const drawerWidth = 200;
const uauth = new UAuth({
  clientID: UNSTOPPABLEDOMAINS_CLIENTID,
  redirectUri: UNSTOPPABLEDOMAINS_REDIRECT_URI,
});

function SafeDashboard({ rsContract, domainData, ethAddress, userSigner }) {
  const navigate = useNavigate();

  const [safeAddress, setSafeAddress] = useState("");
  const [userAssets, setUserAssets] = useState([]);
  const [currentSection, setCurrentSection] = useState("Your Wallet");

  useEffect(() => {
    if(rsContract) {
      getSafeAddress();
    }
  }, [rsContract])

  const getSafeAddress = async () => {
    try{
      const address = await rsContract.getSafeContract();
      setSafeAddress(address);
    } catch(err) {
      console.error(err);
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

  const disconnect = async () => {
    if(domainData){
      await uauth.logout();
    }
   
    navigate('/');
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between'}}>
          <Typography variant="h6" noWrap component="div">
            Recovery Crypto Management
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center'}}>
            <p style={{ marginRight: '.7rem' }}>{domainData?.sub}</p>
            <Button variant="contained" color="secondary" onClick={disconnect}>
              Disconnect
            </Button>
          </div>
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
          {drawerLinks.map((d, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {d.icon}
                </ListItemIcon>
                <ListItemText primary={d.text} onClick={() => setCurrentSection(d.text)}/>
              </ListItemButton>
            </ListItem>
          ))}
          <Divider />
          <ListItem>
            <div>
              <ListItemText primary="ETH Address" />
              <a href={`https://zksync2-testnet.zkscan.io/address/${ethAddress}`} target="_blank" rel="noopener noreferrer">
                {ethAddress && ethAddress.substring(0,8) + "..." + ethAddress.substring(34,42)}
              </a>
            </div>
          </ListItem>
          <ListItem>
            <div>
              <ListItemText primary="Safe Address" />
              <a href={`https://zksync2-testnet.zkscan.io/address/${safeAddress}`} target="_blank" rel="noopener noreferrer">
                {safeAddress && safeAddress.substring(0,8) + "..." + safeAddress.substring(34,42)}
              </a>
            </div>
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />

        {safeAddress === "0x0000000000000000000000000000000000000000"
          && <Button variant="contained" onClick={createSafe} style={{ marginTop: '1rem'}}>
              Create Safe
            </Button>}
        {currentSection === "Your Wallet"
            && <UserWallet
              ethAddress={ethAddress}
              userSigner={userSigner}
              userAssets={userAssets}
              safeAddress={safeAddress}
              setUserAssets={setUserAssets} /> }
          {currentSection === "Your Safe"
            && <Safe
              safeAddress={safeAddress}
              userAssets={userAssets}
              rsContract={rsContract} />}
          {currentSection === "Setting"
            && <Setting
              rsContract={rsContract} />}
          {currentSection === "Recover"
            && <Recover
              rsContract={rsContract} />}
      </Box>
    </Box>
  )
}

export default SafeDashboard;