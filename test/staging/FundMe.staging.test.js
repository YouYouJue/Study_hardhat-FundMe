const { getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChain } = require("../../helper-hardhat-config");

developmentChain.includes(network.config.chainId)
    ? describe.skip
    : describe("FundMe", async () => {
          console.log("上链环境");

          let FundMe, deployer;
          const sendValue = ethers.parseEther("10");

          /**
           * @dev 获取账户及合约，并且账户连接合约
           */
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              FundMe = ethers.getContract("FundMe", deployer);
          });

          it("", async () => {});
      });
