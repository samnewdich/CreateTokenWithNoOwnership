const hre = require("hardhat");
const { ethers } = hre;
//const { ethers } = require("hardhat");
const routerAbi = require("../routerAbi");
const erc20Abi = require("../erc20Abi");

async function main() {

  const [signer] = await ethers.getSigners();

  console.log("Wallet:", signer.address);

  const network = hre.network.name;

  /* ---------------------------- */
  /* ROUTER ADDRESS               */
  /* ---------------------------- */

  let routerAddress;

  if (network === "bsc") {
    routerAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
  }

  if (network === "bscTestnet") {
    routerAddress = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
  }

  const router = new ethers.Contract(routerAddress, routerAbi, signer);

  /* ---------------------------- */
  /* TOKEN ADDRESSES              */
  /* ---------------------------- */

  const myTokenAddress = "0xE33928461a9B4cb224AEAecDF20120B65F51f178";

  const usdtAddress = network === "bsc" ? "0x55d398326f99059fF775485246999027B3197955" : "TESTNET_USDT_ADDRESS";

  const token = new ethers.Contract(myTokenAddress, erc20Abi, signer);
  const usdt = new ethers.Contract(usdtAddress, erc20Abi, signer);

  const tokenDecimals = await token.decimals();
  const usdtDecimals = await usdt.decimals();

  /* ---------------------------- */
  /* SMALL AMOUNT EXAMPLE         */
  /* ---------------------------- */

  const tokenAmount = ethers.parseUnits("1", tokenDecimals);
  const usdtAmount = ethers.parseUnits("1", usdtDecimals);

  /* ---------------------------- */
  /* APPROVE BOTH TOKENS          */
  /* ---------------------------- */

  console.log("Approving token...");
  await (await token.approve(routerAddress, tokenAmount)).wait();

  console.log("Approving USDT...");
  await (await usdt.approve(routerAddress, usdtAmount)).wait();

  /* ---------------------------- */
  /* ADD LIQUIDITY TOKEN + USDT   */
  /* ---------------------------- */

  const deadline = Math.floor(Date.now() / 1000) + 600;

  console.log("Adding Token/USDT liquidity...");

  const tx = await router.addLiquidity(
    myTokenAddress,
    usdtAddress,
    tokenAmount,
    usdtAmount,
    0,
    0,
    signer.address,
    deadline
  );

  await tx.wait();

  console.log("Liquidity added successfully");
}

main().catch(console.error);
