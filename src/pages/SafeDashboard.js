import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Box, Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Divider, ListItem, ListItemText, ListItemButton, Button } from '@mui/material';
import { Provider } from "zksync-web3";
import { ethers } from "ethers";

import UserWallet from '../components/safe-dashboard/UserWallet';
import Safe from '../components/safe-dashboard/Safe';

const drawerWidth = 200;

function SafeDashboard({ rsContract, ethAddress, userSigner }) {
  const navigate = useNavigate();

  const [safeAddress, setSafeAddress] = useState("");
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
          <Button variant="contained" color="secondary" onClick={disconnect}>
            Disconnect
          </Button>
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
                  safeAddress={safeAddress} /> }
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