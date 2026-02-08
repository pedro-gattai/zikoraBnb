import { ethers } from "hardhat";

// BSC Mainnet addresses (same for testnet deployed copies)
const PANCAKE_V3_ROUTER = "0x13f4EA83D0bd40E75C8222255bc855a974568Dd4";
const WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";

// BSC Testnet addresses
const PANCAKE_V3_ROUTER_TESTNET = "0x1b81D678ffb9C0263b24A97847620C99d213eB14";
const WBNB_TESTNET = "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  console.log("Deploying ZikoraVault...");
  console.log("Deployer:", deployer.address);
  console.log("Chain ID:", chainId);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "BNB");

  // Select addresses based on network
  const isTestnet = chainId === 97;
  const routerAddress = isTestnet ? PANCAKE_V3_ROUTER_TESTNET : PANCAKE_V3_ROUTER;
  const wbnbAddress = isTestnet ? WBNB_TESTNET : WBNB;

  console.log(`\nNetwork: ${isTestnet ? "BSC Testnet" : "BSC Mainnet"}`);
  console.log("PancakeSwap V3 Router:", routerAddress);
  console.log("WBNB:", wbnbAddress);

  const ZikoraVault = await ethers.getContractFactory("ZikoraVault");
  const vault = await ZikoraVault.deploy(routerAddress, wbnbAddress);

  await vault.waitForDeployment();

  const vaultAddress = await vault.getAddress();
  console.log("\n✅ ZikoraVault deployed to:", vaultAddress);
  console.log("\nNext steps:");
  console.log(`  1. Verify: npx hardhat verify --network ${isTestnet ? "bscTestnet" : "bscMainnet"} ${vaultAddress} ${routerAddress} ${wbnbAddress}`);
  console.log(`  2. Set operator: call setOperator(<backend_wallet_address>)`);
  console.log(`  3. Copy vault address to zikora-app .env: NEXT_PUBLIC_VAULT_ADDRESS=${vaultAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
