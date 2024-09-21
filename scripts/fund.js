const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
    const deployer = (await getNamedAccounts()).deployer;
    const FundMe = await ethers.getContract("FundMe", deployer);

    console.log("执行Fund函数");
    const startContractBalance = await ethers.provider.getBalance(FundMe);
    console.log(`startContractBalance:${startContractBalance}`);

    const transactionResponse = await FundMe.Fund({
        value: ethers.parseEther("10"),
    });
    const transcationReceipt = transactionResponse.wait(1);

    const updateContractBalance = await ethers.provider.getBalance(FundMe);
    console.log(`updateContractBalance:${updateContractBalance}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
