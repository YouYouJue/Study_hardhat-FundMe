// SPDX-License-Identifier:MIT

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getConversionRate(
        uint256 ethValue,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethValueInUSD = (ethValue * ethPrice) / 1e18;
        return ethValueInUSD;
    }

    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        uint256 addDecimals = 1e18 / (10 ** getDecimals(priceFeed));
        return uint256(answer) * addDecimals;
    }

    function getDecimals(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        return priceFeed.decimals();
    }
}
