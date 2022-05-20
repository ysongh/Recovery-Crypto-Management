import React, { useState } from 'react';
import { Container, DialogTitle, Dialog, TextField, Button } from '@mui/material';

function DepositDialog({ onClose, open, depositAmount, setDepositAmount, depositToSafe }) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Container>
        <DialogTitle>Deposit</DialogTitle>
        <TextField
          style={{ width: '500px' }}
          label="Amount"
          variant="outlined"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          size="small" />
         <br />
         <br />
        <Button variant="contained" onClick={depositToSafe}>
          Deposit
        </Button>
        <br />
        <br />
      </Container>
    </Dialog>
  );
}

export default DepositDialog;