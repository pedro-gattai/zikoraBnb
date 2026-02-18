import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ZikoraRouter", function () {
  let router: any;
  let mockPancakeRouter: any;
  let mockWBNB: any;
  let tokenA: any; // "input" token
  let tokenB: any; // "output" token
  let mockVToken: any;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let feeRecipient: SignerWithAddress;
  let other: SignerWithAddress;

  const INITIAL_SUPPLY = ethers.parseEther("1000000");
  const FEE_BPS = 10n; // 0.10%

  beforeEach(async function () {
    [owner, user, feeRecipient, other] = await ethers.getSigners();

    // Deploy mock tokens
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    tokenA = await MockERC20.deploy("Token A", "TKA", INITIAL_SUPPLY);
    tokenB = await MockERC20.deploy("Token B", "TKB", INITIAL_SUPPLY);
    mockWBNB = await MockERC20.deploy("Wrapped BNB", "WBNB", INITIAL_SUPPLY);
    await tokenA.waitForDeployment();
    await tokenB.waitForDeployment();
    await mockWBNB.waitForDeployment();

    // Deploy mock PancakeSwap router
    const MockRouter = await ethers.getContractFactory("MockPancakeRouter");
    mockPancakeRouter = await MockRouter.deploy();
    await mockPancakeRouter.waitForDeployment();

    // Fund the mock router with tokenB so it can "output" tokens
    await tokenB.transfer(await mockPancakeRouter.getAddress(), ethers.parseEther("100000"));

    // Deploy mock vToken (underlying = tokenA)
    const MockVToken = await ethers.getContractFactory("MockVToken");
    mockVToken = await MockVToken.deploy("Venus TKA", "vTKA", await tokenA.getAddress());
    await mockVToken.waitForDeployment();

    // Fund vToken with underlying so it can redeem
    await tokenA.transfer(await mockVToken.getAddress(), ethers.parseEther("100000"));

    // Deploy ZikoraRouter
    const ZikoraRouter = await ethers.getContractFactory("ZikoraRouter");
    router = await ZikoraRouter.deploy(
      await mockPancakeRouter.getAddress(),
      await mockWBNB.getAddress(),
      feeRecipient.address
    );
    await router.waitForDeployment();

    // Give user some tokens
    await tokenA.transfer(user.address, ethers.parseEther("10000"));
  });

  // ========== DEPLOYMENT ==========
  describe("Deployment", function () {
    it("should set correct owner", async function () {
      expect(await router.owner()).to.equal(owner.address);
    });

    it("should set correct pancakeRouter", async function () {
      expect(await router.pancakeRouter()).to.equal(await mockPancakeRouter.getAddress());
    });

    it("should set correct WBNB", async function () {
      expect(await router.WBNB()).to.equal(await mockWBNB.getAddress());
    });

    it("should set correct feeRecipient", async function () {
      expect(await router.feeRecipient()).to.equal(feeRecipient.address);
    });

    it("should set default feeBps to 10", async function () {
      expect(await router.feeBps()).to.equal(10n);
    });

    it("should revert if pancakeRouter is zero", async function () {
      const ZikoraRouter = await ethers.getContractFactory("ZikoraRouter");
      await expect(
        ZikoraRouter.deploy(ethers.ZeroAddress, await mockWBNB.getAddress(), feeRecipient.address)
      ).to.be.revertedWithCustomError(router, "ZeroAddress");
    });

    it("should revert if WBNB is zero", async function () {
      const ZikoraRouter = await ethers.getContractFactory("ZikoraRouter");
      await expect(
        ZikoraRouter.deploy(await mockPancakeRouter.getAddress(), ethers.ZeroAddress, feeRecipient.address)
      ).to.be.revertedWithCustomError(router, "ZeroAddress");
    });

    it("should revert if feeRecipient is zero", async function () {
      const ZikoraRouter = await ethers.getContractFactory("ZikoraRouter");
      await expect(
        ZikoraRouter.deploy(await mockPancakeRouter.getAddress(), await mockWBNB.getAddress(), ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(router, "ZeroAddress");
    });
  });

  // ========== swapExactInput ==========
  describe("swapExactInput", function () {
    const swapAmount = ethers.parseEther("1000");

    beforeEach(async function () {
      // User approves router
      await tokenA.connect(user).approve(await router.getAddress(), swapAmount);
    });

    it("should execute swap and deduct fee", async function () {
      const feeRecipientBefore = await tokenA.balanceOf(feeRecipient.address);
      const userTokenBBefore = await tokenB.balanceOf(user.address);

      await router.connect(user).swapExactInput(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        2500,
        swapAmount,
        0
      );

      // Fee = 1000 * 10 / 10000 = 0.1 tokens
      const expectedFee = (swapAmount * FEE_BPS) / 10000n;
      const expectedSwapAmount = swapAmount - expectedFee;

      // Fee recipient received the fee
      const feeRecipientAfter = await tokenA.balanceOf(feeRecipient.address);
      expect(feeRecipientAfter - feeRecipientBefore).to.equal(expectedFee);

      // User received output (1:1 mock = expectedSwapAmount)
      const userTokenBAfter = await tokenB.balanceOf(user.address);
      expect(userTokenBAfter - userTokenBBefore).to.equal(expectedSwapAmount);
    });

    it("should emit SwapExecuted event", async function () {
      const expectedFee = (swapAmount * FEE_BPS) / 10000n;
      const expectedSwapAmount = swapAmount - expectedFee;

      await expect(
        router.connect(user).swapExactInput(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          2500,
          swapAmount,
          0
        )
      ).to.emit(router, "SwapExecuted").withArgs(
        user.address,
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        swapAmount,
        expectedSwapAmount, // 1:1 mock
        expectedFee
      );
    });

    it("should revert with zero amount", async function () {
      await expect(
        router.connect(user).swapExactInput(
          await tokenA.getAddress(),
          await tokenB.getAddress(),
          2500,
          0,
          0
        )
      ).to.be.revertedWithCustomError(router, "ZeroAmount");
    });
  });

  // ========== supplyToVenus ==========
  describe("supplyToVenus", function () {
    const supplyAmount = ethers.parseEther("1000");

    beforeEach(async function () {
      await tokenA.connect(user).approve(await router.getAddress(), supplyAmount);
    });

    it("should supply to Venus and deduct fee", async function () {
      const feeRecipientBefore = await tokenA.balanceOf(feeRecipient.address);

      await router.connect(user).supplyToVenus(
        await mockVToken.getAddress(),
        await tokenA.getAddress(),
        supplyAmount
      );

      const expectedFee = (supplyAmount * FEE_BPS) / 10000n;
      const expectedSupply = supplyAmount - expectedFee;

      // Fee recipient got fee
      const feeRecipientAfter = await tokenA.balanceOf(feeRecipient.address);
      expect(feeRecipientAfter - feeRecipientBefore).to.equal(expectedFee);

      // User received vTokens (1:1 in mock)
      const userVTokens = await mockVToken.balanceOf(user.address);
      expect(userVTokens).to.equal(expectedSupply);
    });

    it("should emit SupplyExecuted event", async function () {
      const expectedFee = (supplyAmount * FEE_BPS) / 10000n;
      const expectedSupply = supplyAmount - expectedFee;

      await expect(
        router.connect(user).supplyToVenus(
          await mockVToken.getAddress(),
          await tokenA.getAddress(),
          supplyAmount
        )
      ).to.emit(router, "SupplyExecuted").withArgs(
        user.address,
        await mockVToken.getAddress(),
        expectedSupply,
        expectedFee
      );
    });

    it("should revert with zero amount", async function () {
      await expect(
        router.connect(user).supplyToVenus(
          await mockVToken.getAddress(),
          await tokenA.getAddress(),
          0
        )
      ).to.be.revertedWithCustomError(router, "ZeroAmount");
    });

    it("should revert if Venus mint fails", async function () {
      await mockVToken.setFailMint(true);
      await expect(
        router.connect(user).supplyToVenus(
          await mockVToken.getAddress(),
          await tokenA.getAddress(),
          supplyAmount
        )
      ).to.be.revertedWithCustomError(router, "VenusSupplyFailed");
    });
  });

  // ========== redeemFromVenus ==========
  describe("redeemFromVenus", function () {
    const supplyAmount = ethers.parseEther("1000");

    beforeEach(async function () {
      // User supplies first to get vTokens
      await tokenA.connect(user).approve(await router.getAddress(), supplyAmount);
      await router.connect(user).supplyToVenus(
        await mockVToken.getAddress(),
        await tokenA.getAddress(),
        supplyAmount
      );
    });

    it("should redeem from Venus and deduct fee from output", async function () {
      const expectedFeeOnSupply = (supplyAmount * FEE_BPS) / 10000n;
      const vTokenBalance = supplyAmount - expectedFeeOnSupply; // what user got as vTokens
      const redeemAmount = vTokenBalance; // redeem all (1:1 in mock)

      // Approve router to pull vTokens
      await mockVToken.connect(user).approve(await router.getAddress(), vTokenBalance);

      const feeRecipientBefore = await tokenA.balanceOf(feeRecipient.address);
      const userBefore = await tokenA.balanceOf(user.address);

      await router.connect(user).redeemFromVenus(
        await mockVToken.getAddress(),
        await tokenA.getAddress(),
        redeemAmount,
        vTokenBalance
      );

      const redeemFee = (redeemAmount * FEE_BPS) / 10000n;
      const userReceived = redeemAmount - redeemFee;

      // Fee recipient got the redeem fee
      const feeRecipientAfter = await tokenA.balanceOf(feeRecipient.address);
      expect(feeRecipientAfter - feeRecipientBefore).to.equal(redeemFee);

      // User received underlying minus fee
      const userAfter = await tokenA.balanceOf(user.address);
      expect(userAfter - userBefore).to.equal(userReceived);
    });

    it("should emit RedeemExecuted event", async function () {
      const expectedFeeOnSupply = (supplyAmount * FEE_BPS) / 10000n;
      const vTokenBalance = supplyAmount - expectedFeeOnSupply;
      const redeemAmount = vTokenBalance;

      await mockVToken.connect(user).approve(await router.getAddress(), vTokenBalance);

      const redeemFee = (redeemAmount * FEE_BPS) / 10000n;

      await expect(
        router.connect(user).redeemFromVenus(
          await mockVToken.getAddress(),
          await tokenA.getAddress(),
          redeemAmount,
          vTokenBalance
        )
      ).to.emit(router, "RedeemExecuted").withArgs(
        user.address,
        await mockVToken.getAddress(),
        redeemAmount,
        redeemFee
      );
    });

    it("should revert with zero redeemAmount", async function () {
      await expect(
        router.connect(user).redeemFromVenus(
          await mockVToken.getAddress(),
          await tokenA.getAddress(),
          0,
          0
        )
      ).to.be.revertedWithCustomError(router, "ZeroAmount");
    });

    it("should revert if Venus redeem fails", async function () {
      const expectedFeeOnSupply = (supplyAmount * FEE_BPS) / 10000n;
      const vTokenBalance = supplyAmount - expectedFeeOnSupply;

      await mockVToken.connect(user).approve(await router.getAddress(), vTokenBalance);
      await mockVToken.setFailRedeem(true);

      await expect(
        router.connect(user).redeemFromVenus(
          await mockVToken.getAddress(),
          await tokenA.getAddress(),
          vTokenBalance,
          vTokenBalance
        )
      ).to.be.revertedWithCustomError(router, "VenusRedeemFailed");
    });
  });

  // ========== ADMIN FUNCTIONS ==========
  describe("Admin", function () {
    it("should update feeBps", async function () {
      await expect(router.setFeeBps(20))
        .to.emit(router, "FeeBpsUpdated")
        .withArgs(10n, 20n);
      expect(await router.feeBps()).to.equal(20n);
    });

    it("should allow feeBps = 0 (no fee)", async function () {
      await router.setFeeBps(0);
      expect(await router.feeBps()).to.equal(0n);
    });

    it("should revert feeBps > 100", async function () {
      await expect(router.setFeeBps(101))
        .to.be.revertedWithCustomError(router, "FeeTooHigh");
    });

    it("should update feeRecipient", async function () {
      await expect(router.setFeeRecipient(other.address))
        .to.emit(router, "FeeRecipientUpdated")
        .withArgs(feeRecipient.address, other.address);
      expect(await router.feeRecipient()).to.equal(other.address);
    });

    it("should revert feeRecipient to zero address", async function () {
      await expect(router.setFeeRecipient(ethers.ZeroAddress))
        .to.be.revertedWithCustomError(router, "ZeroAddress");
    });

    it("should only allow owner to setFeeBps", async function () {
      await expect(
        router.connect(user).setFeeBps(20)
      ).to.be.revertedWithCustomError(router, "OwnableUnauthorizedAccount");
    });

    it("should only allow owner to setFeeRecipient", async function () {
      await expect(
        router.connect(user).setFeeRecipient(other.address)
      ).to.be.revertedWithCustomError(router, "OwnableUnauthorizedAccount");
    });

    it("should withdraw ERC-20 fees", async function () {
      // Send tokens to router (simulating accumulated fees)
      await tokenA.transfer(await router.getAddress(), ethers.parseEther("100"));

      const before = await tokenA.balanceOf(owner.address);
      await router.withdrawFees(await tokenA.getAddress(), ethers.parseEther("100"));
      const after_ = await tokenA.balanceOf(owner.address);
      expect(after_ - before).to.equal(ethers.parseEther("100"));
    });

    it("should rescue stuck tokens", async function () {
      await tokenB.transfer(await router.getAddress(), ethers.parseEther("50"));

      const before = await tokenB.balanceOf(owner.address);
      await router.rescueToken(await tokenB.getAddress(), ethers.parseEther("50"));
      const after_ = await tokenB.balanceOf(owner.address);
      expect(after_ - before).to.equal(ethers.parseEther("50"));
    });
  });
});
