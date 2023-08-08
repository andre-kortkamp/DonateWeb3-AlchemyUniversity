const hre = require("hardhat");

async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx ++;
  }
}

async function printPost(posts) {
  for (const post of posts) {
    const timestamp = post.timestamp;
    const tipper = post.name;
    const tipperAddress = post.from;
    const message = post.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

async function main() {
  const [owner, tipper] = await hre.ethers.getSigners();

  const DonateWeb3 = await hre.ethers.getContractFactory("DonateWeb3");
  const donateWeb3 = await DonateWeb3.deploy();

  await donateWeb3.deployed();
  console.log("DonateWeb3 deployed to:", donateWeb3.address);

  const addresses = [owner.address, tipper.address, donateWeb3.address];
  console.log("start");
  await printBalances(addresses);

  const tip = {value: hre.ethers.utils.parseEther("1")};
  await donateWeb3.connect(tipper).donate("Andre", "Hello World", tip);

  console.log("donate count");
  await printBalances(addresses);

  await donateWeb3.connect(owner).withdrawTips();

  console.log("withdrawTips");
  await printBalances(addresses);

  console.log("posts");
  const posts = await donateWeb3.getPost();
  printPost(posts);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });