const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
    const deployer = (await getNamedAccounts()).deployer;
    const FundMe = await ethers.getContract("FundMe", deployer);

    console.log("执行removeMoney函数");
    const startContractBalance = await ethers.provider.getBalance(FundMe);
    const startDeployerBalance = await ethers.provider.getBalance(deployer);
    console.log(`startContractBalance:${startContractBalance}`);
    console.log(`startDeployerBalance:${startDeployerBalance}`);
    const transactionResponse = await FundMe.removeMoney();
    const transcationReceipt = transactionResponse.wait(1);
    const updateContractBalance = await ethers.provider.getBalance(FundMe);
    const updateDeployerBalance = await ethers.provider.getBalance(deployer);
    console.log(`updateDeployerBalance:${updateDeployerBalance}`);
    console.log(`updateContractBalance:${updateContractBalance}`);
}

main();
