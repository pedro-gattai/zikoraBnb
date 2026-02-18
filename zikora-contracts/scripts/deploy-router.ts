import { ethers } from "hardhat";

// BSC Mainnet
const PANCAKE_V3_ROUTER = "0x13f4EA83D0bd40E75C8222255bc855a974568Dd4";
const WBNB_MAINNET = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";

// BSC Testnet
const PANCAKE_V3_ROUTER_TESTNET = "0x1b81D678ffb9C0263b24A97847620C99d213eB14";
const WBNB_TESTNET = "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  console.log("Deploying ZikoraRouter...");
  console.log("Deployer:", deployer.address);
  console.log("Chain ID:", chainId);
  console.log(
    "Balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "BNB"
  );

  const isTestnet = chainId === 97;
  const routerAddress = isTestnet ? PANCAKE_V3_ROUTER_TESTNET : PANCAKE_V3_ROUTER;
  const wbnbAddress = isTestnet ? WBNB_TESTNET : WBNB_MAINNET;
  const feeRecipient = deployer.address; // deployer collects fees initially

  console.log(`\nNetwork: ${isTestnet ? "BSC Testnet" : "BSC Mainnet"}`);
  console.log("PancakeSwap V3 Router:", routerAddress);
  console.log("WBNB:", wbnbAddress);
  console.log("Fee Recipient:", feeRecipient);

  const ZikoraRouter = await ethers.getContractFactory("ZikoraRouter");
  const router = await ZikoraRouter.deploy(routerAddress, wbnbAddress, feeRecipient);
  await router.waitForDeployment();

  const routerAddr = await router.getAddress();
  console.log("\nZikoraRouter deployed to:", routerAddr);
  console.log("Fee: 0.10% (10 bps)");
  console.log("\nNext steps:");
  console.log(
    `  1. Verify: npx hardhat verify --network ${isTestnet ? "bscTestnet" : "bscMainnet"} ${routerAddr} ${routerAddress} ${wbnbAddress} ${feeRecipient}`
  );
  console.log(
    `  2. Update zikora-server addresses.ts: zikoraRouter = "${routerAddr}"`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
