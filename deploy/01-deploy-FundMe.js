const { network } = require("hardhat");
const { verify } = require("../utils/verify");

/*
function deployFunc() {
    console.log("test");
}

module.exports.default = deployFunc;
*/
const { networkConfig, developmentChain } = require("../helper-hardhat-config");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let priceFeedAddress;
    log("test:");
    log(process.env.SEPOLIA_ETH_CHAIN_ID.toString());
    log("--------------");

    if (developmentChain.includes(chainId)) {
        log("in the developmentChain...");
        const priceFeedContract = await deployments.get("MockV3Aggregator");
        priceFeedAddress = priceFeedContract["address"];
        log(priceFeedAddress);
    } else {
        log("no testChain");
        log(await networkConfig[chainId]);
        priceFeedAddress = networkConfig[chainId].priceFeedAddress;
        log(`chain Name:${networkConfig[chainId]["name"]}`);
    }

    log("-------------------------------");
    const args = priceFeedAddress;
    const FundMe = await deploy("FundMe", {
        from: deployer,
        args: [args], //参数，需要传入priceFeed，FundMe的构造函数
        log: true, //打印出来
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    if (!developmentChain.includes(chainId) && process.env.ETHERSCAN_API_KEY) {
        console.log("deploy:start verify contract...");
        await verify(FundMe.address, args);
    }
};

module.exports.tags = ["all", "FundMe"];
