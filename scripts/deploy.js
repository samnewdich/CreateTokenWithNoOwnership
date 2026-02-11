const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const USDT = await ethers.getContractFactory("USDT", deployer);
  const usdt = await USDT.deploy();

  await usdt.waitForDeployment();

  console.log("USDT Treasury deployed to:", await usdt.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



/*const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const FlashArb = await ethers.getContractFactory("USDT");
  const arb = await FlashArb.deploy(deployer.address);

  await arb.deployed(); // old-style wait
  console.log("USDT Treasure deployed to:", arb.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
*/