const { version } = require("chai");

require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
require("hardhat-deploy-ethers");

const SEPOLIA_ETH_RPC_URL =
    process.env.SEPOLIA_ETH_RPC_URL || "SEPOLIA_ETH_RPC_URL_NULL";
const SEPOLIA_ETH_PRIVATE_KEY =
    process.env.SEPOLIA_ETH_PRIVATE_KEY || "PRIVATE_KEY_NULL";
// const SEPOLIA_ETH_CHAIN_ID =
//     process.env.SEPOLIA_ETH_CHAIN_ID || "SEPOLIA_ETH_CHAIN_ID_NULL";  error???
const ETHERSCAN_API_KEY =
    process.env.ETHERSCAN_API_KEY || "ETHERSCAN_API_KEY_NULL";
// const CMC_API_KEY = process.env.CMC_API_KEY || "CMC_API_KEY_NULL";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },
    networks: {
        SepoliaETH: {
            url: SEPOLIA_ETH_RPC_URL,
            accounts: [SEPOLIA_ETH_PRIVATE_KEY],
            chainId: 11155111, //SEPOLIA_ETH_CHAIN_ID error????????????????
            blockConfirmations: 6,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            chainId: 31337,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },

    namedAccounts: {
        deployer: {
            default: 0,
            //若其他网络，位置不一，可自行定义 如 31337:1,
        },
    },

    gasReporter: {
        enabled: true,
        outputFile: "gas-reporter.txt",
        noColors: true,
    },
};
