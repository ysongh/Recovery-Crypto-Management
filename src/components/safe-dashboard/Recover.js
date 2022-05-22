import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

function Recover({ rsContract }) {
  const [oldAddress, setOldAddress] = useState("");

  const recoverSafe = async () => {
    const txHandle = await rsContract.changeSafeOwner(oldAddress, {
      customData: {
        // Passing the token to pay fee with
        feeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      },
    });

    await txHandle.wait();
  }

  return (
    <div>
      <h1>Recover</h1>

      <h2>Enter your old address to recover your safe</h2>
      <TextField label="Old Address" variant="outlined" size='small' value={oldAddress} onChange={(e) => setOldAddress(e.target.value)} />
      <Button variant="contained" onClick={recoverSafe}>Recover</Button>
    </div>
  )
}

export default Recover;