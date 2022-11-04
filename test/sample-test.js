const { expect } = require("chai");
const hre = require("hardhat");

describe("Recoverable Safe Factory", function () {
  let recoverableSafeFactoryContract;

  beforeEach(async function () {
    const RecoverableSafeFactory = await hre.ethers.getContractFactory("RecoverableSafeFactory");
    recoverableSafeFactoryContract = await RecoverableSafeFactory.deploy();
  })
});
