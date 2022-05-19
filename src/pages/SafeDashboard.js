import React, { useState } from 'react';
import { Container, Button } from '@mui/material';
import { ethers } from "ethers";

function SafeDashboard({ ethAddress, rsContract, ethBalance, userSigner }) {
  const [safeETHBalance, setSafeETHBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  const getBalance = async () => {
    const balance = await rsContract.getTokenAllowance("0", "0x5C221E77624690fff6dd741493D735a17716c26B");
    console.log(balance.toString());
    setSafeETHBalance(balance.toString());
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

  const depositToSafe = async () => {
    const transferHandle = userSigner.transfer({
      to: "0xf5F2e25c091A8449cc41185937E0217151dcd7Ee",
      token: "0x5C221E77624690fff6dd741493D735a17716c26B",
      amount: ethers.utils.parseEther(depositAmount),
      feeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    });

    console.log(transferHandle);
  }

  const withdrawToken = async () => {
    try {
      const txHandle = await rsContract.withdrawTokenfromSafe("0", "0x5C221E77624690fff6dd741493D735a17716c26B", ethers.utils.parseEther(withdrawAmount), {
        customData: {
          // Passing the token to pay fee with
          feeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        },
      });
  
      await txHandle.wait();
    }
    catch(error) {
      console.error(error);
      console.log(error.transaction.value.toString());
    }
  }

  return (
    <Container maxWidth="lg">
      <p>ETH Address: {ethAddress}</p>
      <p>Balance: {ethBalance} ETH</p>
      <Button variant="contained" onClick={getBalance}>
        Get balance
      </Button>
      <Button variant="contained" onClick={createSafe}>
        Create Safe
      </Button>
      <br />
      <br />
      <p>Safe ETH balance: {safeETHBalance}</p>
      <input value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
      <Button variant="contained" onClick={depositToSafe}>
        Deposit
      </Button>
      <br />
      <input value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
      <Button variant="contained" onClick={withdrawToken}>
        WithDraw
      </Button>
    </Container>
  )
}

export default SafeDashboard;