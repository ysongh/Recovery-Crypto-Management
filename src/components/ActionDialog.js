import React from 'react';
import { Container, DialogTitle, Dialog, FormControl, InputLabel, TextField, MenuItem, Select, Button } from '@mui/material';

import { TOKEN_ADDRESSES } from '../config/token-addresses';

function ActionDialog({ onClose, open, amount, userAssets, setAmount, action, feeToken, setFeeToken, type }) {
  const handleClose = () => {
    onClose();
  };

  const handleChange = (event) => {
    setFeeToken(event.target.value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Container>
        <DialogTitle>{type} Token</DialogTitle>
        <TextField
          style={{ width: '500px' }}
          label="Amount"
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          size="small" />
         <br />
         <br />
         <FormControl fullWidth>
          <InputLabel id="feelabel">Pay Fee With</InputLabel>
          <Select
            labelId="feelabel"
            id="feeselect"
            value={feeToken}
            label="Age"
            onChange={handleChange}
            size="small"
          >
            {userAssets.map(token => (
              <MenuItem key={token.address} value={token.address}>{token.symbol} ({token.balance})</MenuItem>
            ))}
            
          </Select>
        </FormControl>
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