const hre = require("hardhat");
const { ethers } = hre;
//const { ethers } = require("hardhat");
const routerAbi = require("../routerAbi");
const erc20Abi = require("../erc20Abi");

async function main() {

  const [signer] = await ethers.getSigners();

  console.log("Using wallet:", signer.address);

  /* -------------------------------- */
  /* SELECT NETWORK ROUTER            */
  /* -------------------------------- */

  const network = hre.network.name;

  let routerAddress;

  if (network === "bsc") {
    routerAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
  }

  if (network === "bscTestnet") {
    routerAddress = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
  }

  if (!routerAddress) {
    throw new Error("Unsupported network");
  }

  console.log("Router:", routerAddress);

  /* -------------------------------- */
  /* TOKEN ADDRESS                    */
  /* -------------------------------- */

  const tokenAddress = "0xc340B708841D523631a91DE28c6642AD6525e8CB"; //token contract address

  /* -------------------------------- */
  /* AMOUNTS (SMALL UNITS EXAMPLE)    */
  /* -------------------------------- */

  const token = new ethers.Contract(tokenAddress, erc20Abi, signer);

  const decimals = await token.decimals();

  // Example: 10 tokens
  const tokenAmount = ethers.parseUnits("10", decimals);

  // Example: 0.01 BNB
  const bnbAmount = ethers.parseEther("0.0001");

  /* -------------------------------- */
  /* CONNECT ROUTER                   */
  /* -------------------------------- */

  const router = new ethers.Contract(routerAddress, routerAbi, signer);

  /* -------------------------------- */
  /* APPROVE TOKEN                    */
  /* -------------------------------- */

  console.log("Approving token...");

  const approveTx = await token.approve(routerAddress, tokenAmount);
  await approveTx.wait();

  console.log("Approved");

  /* -------------------------------- */
  /* ADD LIQUIDITY                    */
  /* -------------------------------- */

  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  console.log("Adding liquidity...");

  const tx = await router.addLiquidityETH(
    tokenAddress,
    tokenAmount,
    0, // slippage safe for testing
    0,
    signer.address,
    deadline,
    { value: bnbAmount }
  );

  await tx.wait();

  console.log("Liquidity Added!");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
