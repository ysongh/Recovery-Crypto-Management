import React, { useState } from 'react';
import { ethers } from "ethers";

import WalletTable from '../WalletTable';
import DepositDialog from '../DepositDialog';

function UserWallet({ userAssets, userSigner, safeAddress, getWalletBalance }) {
  const [open, setOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState("");
  const [depositAmount, setDepositAmount] = useState(0);

  const depositToSafe = async () => {
    const transferHandle = await userSigner.transfer({
      to: safeAddress,
      token: selectedToken,
      amount: ethers.utils.parseEther(depositAmount),
      feeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    });

    console.log(transferHandle);
    getWalletBalance();
    setOpen(false);
  }

  const handleClickOpen = (tokenAddress) => {
    setSelectedToken(tokenAddress);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <div>
      <WalletTable userAssets={userAssets} handleClickOpen={handleClickOpen}  />
      <DepositDialog
        open={open}
        onClose={handleClose}
        depositAmount={depositAmount}
        setDepositAmount={setDepositAmount}
        depositToSafe={depositToSafe}
        handleClickOpen={handleClickOpen} />
    </div>
  )
}

export default UserWallet;