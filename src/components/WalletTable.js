import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

function WalletTable({ userAssets, handleClickOpen }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Asset</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Token Address</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userAssets.map((userAsset) => (
            <TableRow
              key={userAsset.address}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {userAsset.symbol}
              </TableCell>
              <TableCell>{userAsset.balance}</TableCell>
              <TableCell>{userAsset.address}</TableCell>
              <TableCell>
                <Button variant="outlined" onClick={handleClickOpen}>
                  Deposit
                </Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default WalletTable;