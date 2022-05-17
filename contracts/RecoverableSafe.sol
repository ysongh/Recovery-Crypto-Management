//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RecoverableSafe {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    // receive money
    fallback() external payable {}
    receive() external payable {}

    function getETHBalance() public view returns (uint) {
        return address(this).balance;
    }
}
