import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { ethers } from "ethers";

import DepositDialog from '../../components/DepositDialog';

function WalletTable({ userAssets, userSigner, getWalletBalance }) {
  const [open, setOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);

  const depositToSafe = async () => {
    const transferHandle = await userSigner.transfer({
      to: "0xf5F2e25c091A8449cc41185937E0217151dcd7Ee",
      token: "0x5C221E77624690fff6dd741493D735a17716c26B",
      amount: ethers.utils.parseEther(depositAmount),
      feeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    });

    console.log(transferHandle);
    getWalletBalance();
    setOpen(false);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
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

      <DepositDialog
        open={open}
        onClose={handleClose}
        depositAmount={depositAmount}
        setDepositAmount={setDepositAmount}
        depositToSafe={depositToSafe} />
    </>
  )
}

export default WalletTable;