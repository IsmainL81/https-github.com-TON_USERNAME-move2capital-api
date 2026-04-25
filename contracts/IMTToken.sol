// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IMTToken is ERC20, Ownable {
    mapping(bytes32 => bool) public processedActivityIds;

    constructor(address initialOwner)
        ERC20("Ismain Move Token", "IMT")
        Ownable(initialOwner)
    {}

    function mintForActivity(
        address to,
        uint256 amount,
        bytes32 activityId
    ) external onlyOwner {
        require(!processedActivityIds[activityId], "Already minted");
        processedActivityIds[activityId] = true;
        _mint(to, amount);
    }

    function spend(
        address from,
        address treasury,
        uint256 amount
    ) external onlyOwner {
        _transfer(from, treasury, amount);
    }
}