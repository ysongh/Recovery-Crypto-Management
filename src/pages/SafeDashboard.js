import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Toolbar, Button } from '@mui/material';

import Navbar from '../components/safe-dashboard/Navbar';
import Sidebar from '../components/safe-dashboard/Sidebar';
import UserWallet from '../components/safe-dashboard/UserWallet';
import Safe from '../components/safe-dashboard/Safe';
import Setting from '../components/safe-dashboard/Setting';
import Recover from '../components/safe-dashboard/Recover';

function SafeDashboard({ rsContract, domainData, ethAddress, userSigner }) {
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

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Navbar domainData={domainData} />
      <Sidebar
        ethAddress={ethAddress}
        safeAddress={safeAddress}
        setCurrentSection={setCurrentSection} />

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