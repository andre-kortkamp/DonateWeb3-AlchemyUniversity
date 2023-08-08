const hre = require("hardhat");

async function main() {
  const donateWeb3 = await hre.ethers.deployContract("DonateWeb3");
  await donateWeb3.waitForDeployment();
  const addressContract = await donateWeb3.getAddress();
  console.log("DonateWeb3 deployed to:", addressContract);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });