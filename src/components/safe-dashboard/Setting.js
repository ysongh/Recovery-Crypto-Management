import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';

function Setting({ rsContract }) {
  const [backupAddress, setBackupAddress] = useState("");
  const [newBackupAddress, setNewBackupAddress] = useState("");
  const [showSetBackupAddress, setShowSetBackupAddress] = useState(false);

  useEffect(() => {
    if(rsContract) {
      getBackupOwnerAddress();
    }
  }, [rsContract])

  const getBackupOwnerAddress = async () => {
    const address = await rsContract.getSafeBackupOwner();
    setBackupAddress(address);
  }

  const setSafeBackupOwner = async () => {
    const txHandle = await rsContract.setSafeBackupOwner(newBackupAddress, {
      customData: {
        // Passing the token to pay fee with
        feeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      },
    });

    await txHandle.wait();
    setShowSetBackupAddress(false);
    getBackupOwnerAddress();
  }

  return (
    <div>
      <h1>Setting</h1>

      <h2>Backup Address</h2>
      <p>
        {backupAddress} <Button variant="contained" onClick={() => setShowSetBackupAddress(!showSetBackupAddress)}>{showSetBackupAddress ? 'Cancel' : 'Edit'}</Button
      ></p>
      {showSetBackupAddress && 
        <>
          <TextField label="BackupAddress" variant="outlined" size='small' value={newBackupAddress} onChange={(e) => setNewBackupAddress(e.target.value)} />
          <Button variant="contained" onClick={setSafeBackupOwner}>Update</Button>
        </>}
    </div>
  )
}

export default Setting