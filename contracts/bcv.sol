// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract bcv is ERC20, Ownable {
    using SafeMath for uint256;

    string private bestCryptoName;
    uint256 private votingCost = 1000000000000000000 wei;

    mapping(address => bool) ownerAdded;
    address[] bcvOwners;

    constructor() ERC20("Best Crypto Token", "BCV") {
        bestCryptoName = "Harmony One";
        mintBcv(msg.sender);
    }

    function getBestCryptoName() external view returns (string memory) {
        return bestCryptoName;
    }

    // This fallback function
    // will keep all the Ether
    fallback() external payable {}

    receive() external payable {}

    function mintBcv(address receiver) private {
        if (!ownerAdded[receiver]) {
            bcvOwners.push(receiver);
            ownerAdded[receiver] = true;
        }

        _mint(msg.sender, votingCost);
    }

    function Elect(string memory _newBestCrypto) external payable {
        require(msg.value >= votingCost, "Election cost One's");

        uint256 amountSent = msg.value;
        uint256 supply = totalSupply();

        for (uint256 i = 0; i < bcvOwners.length; i++) {
            uint256 amountToSend = balanceOf(bcvOwners[i]).mul(amountSent);
            amountToSend = amountToSend.div(supply);
            payable(bcvOwners[i]).transfer(amountToSend);
        }

        mintBcv(msg.sender);
        bestCryptoName = _newBestCrypto;
    }

    function getBcvOwnerLength() public view returns (uint256) {
        return bcvOwners.length;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdrawFunds() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
