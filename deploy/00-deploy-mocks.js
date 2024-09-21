const { network } = require("hardhat");
const { developmentChain } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts();
    const { deploy, log } = deployments;
    const chainId = network.config.chainId;
    const _decimals = 8;
    const _initialAnswer = 8e8;

    if (developmentChain.includes(chainId)) {
        log("in develpment...deploy mocks...");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [_decimals, _initialAnswer],
        });
        log("Mocks deployed!!!");
    }
};

module.exports.tags = ["all", "mocks"];
