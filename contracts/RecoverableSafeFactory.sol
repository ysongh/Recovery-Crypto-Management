//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RecoverableSafe.sol";

contract RecoverableSafeFactory {
    RecoverableSafe[] public recoverableSafeList;

    constructor() {}

    function createGreetContract(string memory _text) public {
        RecoverableSafe newContract = new RecoverableSafe(_text);
        recoverableSafeList.push(newContract);
    }

    function getGreeting(uint _id) public view returns (string memory) {
        RecoverableSafe currentContract = RecoverableSafe(address(recoverableSafeList[_id]));
        return currentContract.greet();
    }

    function setGreeting(uint _id, string memory _greeting) public {
        RecoverableSafe currentContract = RecoverableSafe(address(recoverableSafeList[_id]));
        currentContract.setGreeting(_greeting);
    }
}
