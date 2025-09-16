// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Token {
    string public name = "Engineer Cafe Token";
    string public symbol = "ECT";
    uint public totalSupply;

    mapping(address => uint) public balanceOf;
    
    constructor() {
        uint initialAmount = 1000;
        balanceOf[msg.sender] = initialAmount;
        totalSupply += initialAmount;
    }

    function transfer(address to, uint amount) public {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
    }
}