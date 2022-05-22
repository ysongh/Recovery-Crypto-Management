//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RecoverableSafe {
    address public owner;
    address public backupOwner;

    constructor(address _owner) {
        owner = _owner;
    }

    function getETHBalance() public view returns (uint) {
        return address(this).balance;
    }

    // Todo: change msg.sender to address that is pass from RecoverableSafeFactory to make this function work
    // function depositTokenToSafe(uint _tokenAmount, address _tokenAddress) public {
    //     IERC20 token = IERC20(_tokenAddress);
    //     token.transferFrom(msg.sender, address(this), _tokenAmount);
    // }

    function withdrawTokenfromSafe(uint _tokenAmount, address _tokenAddress) public {
        IERC20 token = IERC20(_tokenAddress);
        require(token.transfer(owner, _tokenAmount), "Unable to transfer");    
    }

    function setBackupOwner(address _owner, address _newBackupOwner) public returns (bool) {
        require(_owner == owner, "You cannot change backup owner role");
        backupOwner = _newBackupOwner;
        
        return true;
    }

    function changeOwner(address _newOwner) public returns (bool) {
        require(_newOwner == backupOwner, "You cannot change owner role");
        owner = _newOwner;
        
        return true;
    }
}
