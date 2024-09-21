// SPDX-License-Identifier:MIT

pragma solidity ^0.8.7;

import "./PriceConverter.sol";
// import "hardhat/console.sol";

error FundMe__NotOwner();
error FundMe__TakeFailTheMoney();
error FundMe__BelowMinimum();

/**
 * @title 筹款项目
 * @author 油油爵
 * @notice 仅供学习使用
 * @dev 用了喂价合约 若是本地节点 会自动部署喂价合约
 */
contract FundMe {
    using PriceConverter for uint256;
    address[] private s_funders;
    mapping(address => uint256) private s_addressToFundValue;
    address private s_owner;
    AggregatorV3Interface private s_priceFeed;
    uint256 minimumUsd = 8 * 1e18;

    modifier onlyOwner() {
        if (msg.sender != s_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address priceFeedAddress) {
        s_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    //receive()
    //fallback()
    //external()

    function Fund() public payable {
        // console.log("!!!solidity console.log!!!");
        if (msg.value.getConversionRate(s_priceFeed) < minimumUsd) {
            revert FundMe__BelowMinimum();
        }
        s_funders.push(msg.sender);
        s_addressToFundValue[msg.sender] += msg.value.getConversionRate(
            s_priceFeed
        );
    }

    function changeMinimumUsd(uint256 _minimumUsd) public {
        minimumUsd = _minimumUsd;
    }

    function removeMoney() public onlyOwner {
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        if (callSuccess != true) {
            revert FundMe__TakeFailTheMoney();
        }
    }

    function getFunders(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToFundValue(
        address funder
    ) public view returns (uint256) {
        return s_addressToFundValue[funder];
    }

    function getOwner() public view returns (address) {
        return s_owner;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
