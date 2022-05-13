//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Greeter.sol";

contract GreeterFactory {
    Greeter[] public greeterList;

    constructor() {}

    function createGreetContract(string memory _text) public {
        Greeter newContract = new Greeter(_text);
        greeterList.push(newContract);
    }

    function getGreeting(uint _id) public view returns (string memory) {
        Greeter currentContract = Greeter(address(greeterList[_id]));
        return currentContract.greet();
    }

    function setGreeting(uint _id, string memory _greeting) public {
        Greeter currentContract = Greeter(address(greeterList[_id]));
        currentContract.setGreeting(_greeting);
    }
}
