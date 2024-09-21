const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChain } = require("../../helper-hardhat-config");

!developmentChain.includes(network.config.chainId)
    ? describe.skip
    : describe("FundMe", async () => {
          console.log("测试环境");

          let FundMe, deployer, MockV3Aggregator, sendValue, accounts; //共用变量，在beforeEach里赋值

          beforeEach(async () => {
              await deployments.fixture(["all"]); //运行标签带“all”的部署脚本
              deployer = (await getNamedAccounts()).deployer;
              FundMe = await ethers.getContract("FundMe", deployer); //获取最新部署的名为“FundMe”的合约
              sendValue = ethers.parseEther("10");
              accounts = await ethers.getSigners();

              ///因为unit测试是在本地进行，所以我们要获取一下自己部署的喂价合约
              MockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              );
          });

          describe("constructor", async () => {
              it("测试FundMe中的喂价合约和我们获取到的喂价合约是否相同", async () => {
                  const response = await FundMe.getPriceFeed();
                  assert.equal(response, MockV3Aggregator.target);
              });
          });

          describe("Fund", async () => {
              it("测试不足够最低fund的以太", async () => {
                  await expect(FundMe.Fund()).to.be.revertedWithCustomError(
                      FundMe,
                      "FundMe__BelowMinimum"
                  );
              });

              it("测试addressToFundValue是否正常更新", async () => {
                  await FundMe.Fund({ value: sendValue });
                  const response = await FundMe.getAddressToFundValue(deployer);
                  const responseValue = response.toString() / 8; //返回的是USD，喂价合约设置的价格是1:8
                  assert.equal(responseValue, sendValue);
              });

              it("测试是否将deployer加入funder数组", async () => {
                  await FundMe.Fund({ value: sendValue });
                  const response = await FundMe.getFunders(0);
                  assert.equal(response, deployer);
              });

              it("测试正常fund以太", async () => {
                  await FundMe.Fund({ value: sendValue });
                  const updateContractBelance =
                      await ethers.provider.getBalance(FundMe);
                  assert.equal(sendValue, updateContractBelance);
              });

              it("测试多账户fund", async () => {
                  const startContractBalance = await ethers.provider.getBalance(
                      FundMe
                  );
                  console.log(`startContractBalance:${startContractBalance}`);
                  for (let i = 1; i < accounts.length; i++) {
                      const accountsFundMe = await FundMe.connect(accounts[i]);
                      const response = await accountsFundMe.Fund({
                          value: sendValue,
                      });
                      const receipt = await response.wait(1);
                      const updateContractBelance =
                          await ethers.provider.getBalance(FundMe.target);
                      console.log(
                          `updateContractBelance:${updateContractBelance}`
                      );
                  }
              });
          });

          describe("removeMoney", async () => {
              beforeEach(async () => {
                  await FundMe.Fund({ value: sendValue });
              });
              it("测试能否取出money", async () => {
                  const startContractBalance = await ethers.provider.getBalance(
                      FundMe.target
                  );
                  const startDeployerBalance = await ethers.provider.getBalance(
                      deployer
                  );
                  console.log(
                      `startContractBalance:${startContractBalance} startDeployerBalance:${startDeployerBalance}`
                  );
                  const transactionResponse = await FundMe.removeMoney();
                  const transactionReceipt = await transactionResponse.wait(1);
                  // gasPrice = 1595394582n
                  // gasUsed = 30509n
                  const { gasPrice, gasUsed } = transactionReceipt;
                  console.log(
                      `gasPrice:${gasPrice},gasUsed:${gasUsed}----${
                          (gasPrice * gasUsed).toString() / 1e18
                      }eth`
                  );

                  const endContractBalance = await ethers.provider.getBalance(
                      FundMe.target
                  );
                  const endDeployerBalance = await ethers.provider.getBalance(
                      deployer
                  );
                  console.log(
                      `endContractBalance:${endContractBalance} endDeployerBalance:${endDeployerBalance}`
                  );
                  assert.equal(endContractBalance, 0);
              });

              it("测试是否只有owner可以取出money", async () => {
                  const accountsFundMe = await FundMe.connect(accounts[1]);
                  // await accountsFundMe.removeMoney();
                  await expect(
                      accountsFundMe.removeMoney()
                  ).to.be.revertedWithCustomError(FundMe, "FundMe__NotOwner");
              });
          });
      });
