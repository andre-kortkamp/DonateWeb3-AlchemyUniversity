const hre = require("hardhat");
const abi = require("../artifacts/contracts/DonateWeb3.sol/DonateWeb3.json");

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
  const contractAddress="0x6c6907dE767ca88F75c12c6339Bc729a4d6195cB";
  const contractABI = abi.abi;

  const provider = new hre.ethers.providers.AlchemyProvider("sepolia", process.env.SEPOLIA_API_KEY);

  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const donateWeb3 = new hre.ethers.Contract(contractAddress, contractABI, signer);

  const donateWeb3Address = await donateWeb3.getAddress();

  console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
  const contractBalance = await getBalance(provider, donateWeb3Address);
  console.log("current balance of contract: ", await getBalance(provider, donateWeb3Address), "ETH");

  if (contractBalance !== "0.0") {
    console.log("withdrawing funds..")
    const withdrawTxn = await donateWeb3.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log("no funds to withdraw!");
  }

  console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });