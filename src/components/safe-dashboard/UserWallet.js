import React, { useState } from 'react';
import { ethers } from "ethers";

import WalletTable from '../WalletTable';
import DepositDialog from '../DepositDialog';

function UserWallet({ userAssets, userSigner, getWalletBalance }) {
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
    <div>
      <WalletTable userAssets={userAssets} />
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