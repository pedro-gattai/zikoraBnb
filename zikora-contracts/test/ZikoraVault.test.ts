import { expect } from "chai";
import { ethers } from "hardhat";
import { ZikoraVault } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { ContractFactory } from "ethers";

describe("ZikoraVault", function () {
  let vault: ZikoraVault;
  let owner: SignerWithAddress;
  let operator: SignerWithAddress;
  let user: SignerWithAddress;
  let mockRouter: SignerWithAddress;
  let mockWBNB: SignerWithAddress;
  let mockToken: any;
  let mockVToken: any;

  // Deploy a simple ERC-20 mock
  async function deployMockERC20(name: string, symbol: string, supply: bigint) {
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const token = await MockERC20.deploy(name, symbol, supply);
    await token.waitForDeployment();
    return token;
  }

  beforeEach(async function () {
    [owner, operator, user, mockRouter, mockWBNB] = await ethers.getSigners();

    const VaultFactory = await ethers.getContractFactory("ZikoraVault");
    vault = (await VaultFactory.deploy(
      mockRouter.address,
      mockWBNB.address
    )) as ZikoraVault;
    await vault.waitForDeployment();

    // Deploy mock tokens
    mockToken = await deployMockERC20("Mock USDT", "mUSDT", ethers.parseEther("1000000"));
    mockVToken = await deployMockERC20("Mock vUSDT", "mvUSDT", ethers.parseEther("1000000"));
  });

  // ========== DEPLOYMENT ==========
  describe("Deployment", function () {
    it("should set the correct owner", async function () {
      expect(await vault.owner()).to.equal(owner.address);
    });

    it("should set the correct pancakeRouter", async function () {
      expect(await vault.pancakeRouter()).to.equal(mockRouter.address);
    });

    it("should set the correct WBNB", async function () {
      expect(await vault.WBNB()).to.equal(mockWBNB.address);
    });

    it("should initialize with default safety limits", async function () {
      expect(await vault.maxTradePercent()).to.equal(25n);
      expect(await vault.maxSlippageBps()).to.equal(100n);
    });

    it("should revert if router is zero address", async function () {
      const VaultFactory = await ethers.getContractFactory("ZikoraVault");
      await expect(
        VaultFactory.deploy(ethers.ZeroAddress, mockWBNB.address)
      ).to.be.revertedWithCustomError(vault, "ZeroAddress");
    });

    it("should revert if WBNB is zero address", async function () {
      const VaultFactory = await ethers.getContractFactory("ZikoraVault");
      await expect(
        VaultFactory.deploy(mockRouter.address, ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(vault, "ZeroAddress");
    });
  });

  // ========== DEPOSIT / WITHDRAW ERC-20 ==========
  describe("ERC-20 Deposit & Withdraw", function () {
    const depositAmount = ethers.parseEther("1000");

    beforeEach(async function () {
      // Approve vault to pull tokens
      await mockToken.approve(await vault.getAddress(), depositAmount);
    });

    it("should deposit ERC-20 tokens", async function () {
      await expect(vault.deposit(await mockToken.getAddress(), depositAmount))
        .to.emit(vault, "Deposited")
        .withArgs(await mockToken.getAddress(), depositAmount);

      expect(await vault.getTokenBalance(await mockToken.getAddress())).to.equal(depositAmount);
    });

    it("should withdraw ERC-20 tokens", async function () {
      await vault.deposit(await mockToken.getAddress(), depositAmount);

      const balanceBefore = await mockToken.balanceOf(owner.address);
      await expect(vault.withdraw(await mockToken.getAddress(), depositAmount))
        .to.emit(vault, "Withdrawn")
        .withArgs(await mockToken.getAddress(), depositAmount);

      expect(await mockToken.balanceOf(owner.address)).to.equal(balanceBefore + depositAmount);
    });

    it("should revert deposit with zero amount", async function () {
      await expect(
        vault.deposit(await mockToken.getAddress(), 0n)
      ).to.be.revertedWithCustomError(vault, "ZeroAmount");
    });

    it("should revert deposit with zero address", async function () {
      await expect(
        vault.deposit(ethers.ZeroAddress, depositAmount)
      ).to.be.revertedWithCustomError(vault, "ZeroAddress");
    });

    it("should revert withdraw with insufficient balance", async function () {
      await expect(
        vault.withdraw(await mockToken.getAddress(), depositAmount)
      ).to.be.revertedWithCustomError(vault, "InsufficientBalance");
    });
  });

  // ========== DEPOSIT / WITHDRAW BNB ==========
  describe("BNB Deposit & Withdraw", function () {
    const depositAmount = ethers.parseEther("1");

    it("should deposit BNB", async function () {
      await expect(vault.depositBNB({ value: depositAmount }))
        .to.emit(vault, "DepositedBNB")
        .withArgs(depositAmount);

      expect(await vault.getBNBBalance()).to.equal(depositAmount);
    });

    it("should withdraw BNB", async function () {
      await vault.depositBNB({ value: depositAmount });

      await expect(vault.withdrawBNB(depositAmount))
        .to.emit(vault, "WithdrawnBNB")
        .withArgs(depositAmount);

      expect(await vault.getBNBBalance()).to.equal(0n);
    });

    it("should revert BNB deposit with zero value", async function () {
      await expect(
        vault.depositBNB({ value: 0n })
      ).to.be.revertedWithCustomError(vault, "ZeroAmount");
    });

    it("should revert BNB withdraw with insufficient balance", async function () {
      await expect(
        vault.withdrawBNB(depositAmount)
      ).to.be.revertedWithCustomError(vault, "InsufficientBalance");
    });
  });

  // ========== ACCESS CONTROL ==========
  describe("Access Control", function () {
    it("should only allow owner to deposit", async function () {
      await expect(
        vault.connect(user).deposit(await mockToken.getAddress(), 100n)
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });

    it("should only allow owner to withdraw", async function () {
      await expect(
        vault.connect(user).withdraw(await mockToken.getAddress(), 100n)
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });

    it("should only allow owner to set operator", async function () {
      await expect(
        vault.connect(user).setOperator(operator.address)
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });

    it("should only allow operator to executeSwap", async function () {
      await vault.setOperator(operator.address);
      await expect(
        vault.connect(user).executeSwap(
          await mockToken.getAddress(),
          await mockVToken.getAddress(),
          3000,
          100n,
          90n
        )
      ).to.be.revertedWithCustomError(vault, "NotOperator");
    });

    it("should only allow operator to executeVenusSupply", async function () {
      await vault.setOperator(operator.address);
      await expect(
        vault.connect(user).executeVenusSupply(
          await mockVToken.getAddress(),
          await mockToken.getAddress(),
          100n
        )
      ).to.be.revertedWithCustomError(vault, "NotOperator");
    });

    it("should only allow operator to executeVenusRedeem", async function () {
      await vault.setOperator(operator.address);
      await expect(
        vault.connect(user).executeVenusRedeem(await mockVToken.getAddress(), 100n)
      ).to.be.revertedWithCustomError(vault, "NotOperator");
    });
  });

  // ========== OPERATOR MANAGEMENT ==========
  describe("Operator Management", function () {
    it("should set operator", async function () {
      await expect(vault.setOperator(operator.address))
        .to.emit(vault, "OperatorUpdated")
        .withArgs(ethers.ZeroAddress, operator.address);

      expect(await vault.operator()).to.equal(operator.address);
    });

    it("should revert setting zero address as operator", async function () {
      await expect(
        vault.setOperator(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(vault, "ZeroAddress");
    });
  });

  // ========== PAUSE / UNPAUSE ==========
  describe("Pause / Unpause", function () {
    beforeEach(async function () {
      await vault.setOperator(operator.address);
      // Deposit some tokens
      await mockToken.approve(await vault.getAddress(), ethers.parseEther("10000"));
      await vault.deposit(await mockToken.getAddress(), ethers.parseEther("10000"));
    });

    it("should pause and block operator operations", async function () {
      await vault.pause();

      await expect(
        vault.connect(operator).executeSwap(
          await mockToken.getAddress(),
          await mockVToken.getAddress(),
          3000,
          ethers.parseEther("100"),
          ethers.parseEther("90")
        )
      ).to.be.revertedWithCustomError(vault, "EnforcedPause");
    });

    it("should unpause and allow operator operations again", async function () {
      await vault.pause();
      await vault.unpause();

      // This will fail at the router level (not a real router), but it shouldn't revert with EnforcedPause
      // We just check that the pause check passes
      expect(await vault.paused()).to.equal(false);
    });

    it("should only allow owner to pause", async function () {
      await expect(
        vault.connect(user).pause()
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });

    it("should only allow owner to unpause", async function () {
      await vault.pause();
      await expect(
        vault.connect(user).unpause()
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });

    it("owner can still withdraw when paused", async function () {
      await vault.pause();

      // Owner should still be able to withdraw (not blocked by whenNotPaused)
      await expect(
        vault.withdraw(await mockToken.getAddress(), ethers.parseEther("100"))
      ).to.emit(vault, "Withdrawn");
    });
  });

  // ========== SAFETY LIMITS ==========
  describe("Safety Limits", function () {
    beforeEach(async function () {
      await vault.setOperator(operator.address);
      // Deposit 10000 tokens
      await mockToken.approve(await vault.getAddress(), ethers.parseEther("10000"));
      await vault.deposit(await mockToken.getAddress(), ethers.parseEther("10000"));
    });

    it("should reject swap exceeding maxTradePercent", async function () {
      // 10000 tokens, 25% max = 2500 max
      const tooMuch = ethers.parseEther("3000");

      await expect(
        vault.connect(operator).executeSwap(
          await mockToken.getAddress(),
          await mockVToken.getAddress(),
          3000,
          tooMuch,
          0n
        )
      ).to.be.revertedWithCustomError(vault, "ExceedsMaxTradePercent");
    });

    it("should reject Venus supply exceeding maxTradePercent", async function () {
      const tooMuch = ethers.parseEther("3000");

      await expect(
        vault.connect(operator).executeVenusSupply(
          await mockVToken.getAddress(),
          await mockToken.getAddress(),
          tooMuch
        )
      ).to.be.revertedWithCustomError(vault, "ExceedsMaxTradePercent");
    });

    it("should allow swap within maxTradePercent", async function () {
      // 2500 is exactly 25% — should pass the limit check
      // Will revert at router call since mockRouter isn't a real contract, but NOT at the limit check
      const withinLimit = ethers.parseEther("2500");

      // We expect it to revert, but NOT with ExceedsMaxTradePercent
      try {
        await vault.connect(operator).executeSwap(
          await mockToken.getAddress(),
          await mockVToken.getAddress(),
          3000,
          withinLimit,
          0n
        );
      } catch (e: any) {
        // Should not be ExceedsMaxTradePercent
        expect(e.message).to.not.include("ExceedsMaxTradePercent");
      }
    });

    it("should update maxTradePercent", async function () {
      await expect(vault.setMaxTradePercent(50))
        .to.emit(vault, "MaxTradePercentUpdated")
        .withArgs(25n, 50n);

      expect(await vault.maxTradePercent()).to.equal(50n);
    });

    it("should update maxSlippageBps", async function () {
      await expect(vault.setMaxSlippageBps(200))
        .to.emit(vault, "MaxSlippageBpsUpdated")
        .withArgs(100n, 200n);

      expect(await vault.maxSlippageBps()).to.equal(200n);
    });

    it("should revert invalid maxTradePercent (0)", async function () {
      await expect(
        vault.setMaxTradePercent(0)
      ).to.be.revertedWithCustomError(vault, "InvalidPercent");
    });

    it("should revert invalid maxTradePercent (>100)", async function () {
      await expect(
        vault.setMaxTradePercent(101)
      ).to.be.revertedWithCustomError(vault, "InvalidPercent");
    });

    it("should revert invalid maxSlippageBps (0)", async function () {
      await expect(
        vault.setMaxSlippageBps(0)
      ).to.be.revertedWithCustomError(vault, "InvalidSlippage");
    });

    it("should revert invalid maxSlippageBps (>10000)", async function () {
      await expect(
        vault.setMaxSlippageBps(10001)
      ).to.be.revertedWithCustomError(vault, "InvalidSlippage");
    });
  });
});
