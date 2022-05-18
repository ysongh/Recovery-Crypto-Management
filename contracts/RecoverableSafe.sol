//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RecoverableSafe {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function getETHBalance() public view returns (uint) {
        return address(this).balance;
    }

    // function depositTokenToSafe(uint _tokenAmount, address _tokenAddress) public {
    //     IERC20 token = IERC20(_tokenAddress);
    //     token.transferFrom(msg.sender, address(this), _tokenAmount);
    // }

    function withdrawTokenfromSafe(uint _tokenAmount, address _tokenAddress) public {
        IERC20 token = IERC20(_tokenAddress);
        require(token.transfer(msg.sender, _tokenAmount), "Unable to transfer");    
    }
}
