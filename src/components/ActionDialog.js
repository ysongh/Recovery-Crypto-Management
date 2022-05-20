import React from 'react';
import { Container, DialogTitle, Dialog, TextField, Button } from '@mui/material';

function ActionDialog({ onClose, open, amount, setAmount, action, type }) {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Container>
        <DialogTitle>{type}</DialogTitle>
        <TextField
          style={{ width: '500px' }}
          label="Amount"
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          size="small" />
         <br />
         <br />
        <Button variant="contained" onClick={action}>
          {type}
        </Button>
        <br />
        <br />
      </Container>
    </Dialog>
  );
}

export default ActionDialog;