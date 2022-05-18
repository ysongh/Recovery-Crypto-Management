//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RecoverableSafe.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RecoverableSafeFactory {
    RecoverableSafe[] public recoverableSafeList ;

    constructor() {}

    function createRecoverableSafe() public {
        RecoverableSafe newSafe = new RecoverableSafe(msg.sender);
        recoverableSafeList.push(newSafe);
    }

    function getTokenAllowance(uint _id, address _tokenAddress) public view returns (uint256) {
        IERC20 token = IERC20(_tokenAddress);
        return token.allowance(msg.sender, address(recoverableSafeList[_id]));
    }

    function approveTokenToSafe(uint _id, address _tokenAddress, uint _amount) public {
        IERC20 token = IERC20(_tokenAddress);
        token.approve(address(recoverableSafeList[_id]), _amount);
    }

    function depositTokenToSafe(uint _id, address _tokenAddress, uint _amount) public {
        IERC20 token = IERC20(_tokenAddress);
        token.transferFrom(msg.sender, address(recoverableSafeList[_id]), _amount);
    }

    function withdrawTokenfromSafe(uint _id, address _tokenAddress, uint _amount) public {
        RecoverableSafe safe = RecoverableSafe(address(recoverableSafeList[_id]));
        safe.withdrawTokenfromSafe(_amount, _tokenAddress);
    }
}
