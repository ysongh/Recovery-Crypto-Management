import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import UAuth from '@uauth/js';

import { UNSTOPPABLEDOMAINS_CLIENTID, UNSTOPPABLEDOMAINS_REDIRECT_URI } from '../../../config/api-keys';

const drawerWidth = 200;

const uauth = new UAuth({
  clientID: UNSTOPPABLEDOMAINS_CLIENTID,
  redirectUri: UNSTOPPABLEDOMAINS_REDIRECT_URI,
});

function Navbar({ domainData }) {
  const navigate = useNavigate();

  const disconnect = async () => {
    if(domainData){
      await uauth.logout();
    }
   
    navigate('/');
  }

  return (
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
  )
}

export default Navbar;