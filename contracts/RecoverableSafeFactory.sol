//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RecoverableSafe.sol";

contract RecoverableSafeFactory {
    RecoverableSafe[] public recoverableSafeList ;

    constructor() {}

    function createRecoverableSafe() public {
        RecoverableSafe newSafe = new RecoverableSafe(msg.sender);
        recoverableSafeList.push(newSafe);
    }

    function getETHBalance(uint _id) public view returns (uint) {
        address payable safeAddress = payable(address(recoverableSafeList[_id]));
        RecoverableSafe safe = RecoverableSafe(safeAddress);
        return safe.getETHBalance();
    }

    function depositETHToSafe(uint _id) public payable {
        address payable safeAddress = payable(address(recoverableSafeList[_id]));
        payable(safeAddress).transfer(msg.value);
    }
}
