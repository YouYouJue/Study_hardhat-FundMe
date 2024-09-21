const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
    console.log("verify:verifying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("already veirfied...");
        } else {
            console.log(e);
        }
    }
};
module.exports = { verify };
