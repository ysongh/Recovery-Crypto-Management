//SPDX-License-Identifier: MIT

/**
    ## Disclaimer
    These contracts are not audited.  Please review this code on your own before
    using any of the following code for production.  I will not be responsible or
    liable for all loss or damage caused from this project.
*/

pragma solidity ^0.8.0;

import "./RecoverableSafe.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RecoverableSafeFactory {
    RecoverableSafe[] public recoverableSafeList ;
    mapping(address => address) public userSafeAddress;

    constructor() {}

    function createRecoverableSafe() public {
        RecoverableSafe newSafe = new RecoverableSafe(msg.sender);
        recoverableSafeList.push(newSafe);
        userSafeAddress[msg.sender] = address(newSafe);
    }

    function getSafeContract() public view returns (address) {
        return userSafeAddress[msg.sender];
    }

    function getTokenAllowance(address _tokenAddress) public view returns (uint256) {
        IERC20 token = IERC20(_tokenAddress);
        return token.allowance(msg.sender, userSafeAddress[msg.sender]);
    }

    function approveTokenToSafe(address _tokenAddress, uint _amount) public {
        IERC20 token = IERC20(_tokenAddress);
        token.approve(userSafeAddress[msg.sender], _amount);
    }

    function depositTokenToSafe(address _tokenAddress, uint _amount) public {
        IERC20 token = IERC20(_tokenAddress);
        token.transferFrom(msg.sender, userSafeAddress[msg.sender], _amount);
    }

    function withdrawTokenfromSafe(address _tokenAddress, uint _amount) public {
        RecoverableSafe safe = RecoverableSafe(userSafeAddress[msg.sender]);
        safe.withdrawTokenfromSafe(_amount, _tokenAddress);
    }

    function getSafeBackupOwner() public view returns (address) {
        RecoverableSafe safe = RecoverableSafe(userSafeAddress[msg.sender]);
        return safe.backupOwner();
    }

    function setSafeBackupOwner(address _newBackupOwner) public {
        RecoverableSafe safe = RecoverableSafe(userSafeAddress[msg.sender]);
        safe.setBackupOwner(msg.sender, _newBackupOwner);
    }

    function changeSafeOwner(address _oldAddress) public {
        RecoverableSafe safe = RecoverableSafe(userSafeAddress[_oldAddress]);
        bool isChanged = safe.changeOwner(msg.sender);

        if (isChanged == true) {
            userSafeAddress[msg.sender] = address(safe);
        }
    }
}
