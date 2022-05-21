import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Box, Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Divider, ListItem, ListItemText, ListItemButton, Button } from '@mui/material';
import UAuth from '@uauth/js';

import UserWallet from '../components/safe-dashboard/UserWallet';
import Safe from '../components/safe-dashboard/Safe';
import { UNSTOPPABLEDOMAINS_CLIENTID, UNSTOPPABLEDOMAINS_REDIRECT_URI } from '../config/api-keys';

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

  const disconnect = async () => {
    await uauth.logout();
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
        <p>Your Address: {ethAddress}</p>
        <p>Safe Address: {safeAddress}</p>

        {safeAddress === "0x0000000000000000000000000000000000000000"
          ?  <Button variant="contained" onClick={createSafe} style={{ marginTop: '1rem'}}>
              Create Safe
            </Button>
          : <>
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
          </>}
        
      </Box>
    </Box>
  )
}

export default SafeDashboard;