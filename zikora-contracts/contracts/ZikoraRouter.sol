// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IPancakeV3Router.sol";
import "./interfaces/IVToken.sol";
import "./interfaces/IWBNB.sol";

/// @title ZikoraRouter
/// @notice Non-custodial fee router for Zikora DeFAI on BNB Chain.
///         Routes user transactions through PancakeSwap V3 and Venus Protocol
///         while collecting a small protocol fee (default 10 bps = 0.10%).
///         Users approve this contract, call the desired function, and receive
///         output tokens directly — no funds are held between transactions.
contract ZikoraRouter is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // --- State ---
    address public immutable pancakeRouter;
    address public immutable WBNB;

    uint256 public feeBps = 10; // 0.10% (10 basis points)
    address public feeRecipient;

    // --- Events ---
    event SwapExecuted(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 feeAmount
    );
    event SupplyExecuted(
        address indexed user,
        address indexed vToken,
        uint256 amountSupplied,
        uint256 feeAmount
    );
    event RedeemExecuted(
        address indexed user,
        address indexed vToken,
        uint256 amountRedeemed,
        uint256 feeAmount
    );
    event FeeBpsUpdated(uint256 oldBps, uint256 newBps);
    event FeeRecipientUpdated(address oldRecipient, address newRecipient);

    // --- Errors ---
    error ZeroAddress();
    error ZeroAmount();
    error FeeTooHigh();
    error SwapFailed();
    error VenusSupplyFailed();
    error VenusRedeemFailed();
    error BNBTransferFailed();

    // --- Constructor ---
    constructor(
        address _pancakeRouter,
        address _wbnb,
        address _feeRecipient
    ) Ownable(msg.sender) {
        if (_pancakeRouter == address(0) || _wbnb == address(0) || _feeRecipient == address(0))
            revert ZeroAddress();
        pancakeRouter = _pancakeRouter;
        WBNB = _wbnb;
        feeRecipient = _feeRecipient;
    }

    // --- Receive BNB (needed for WBNB unwrap / Venus redeem) ---
    receive() external payable {}

    // ========== USER FUNCTIONS ==========

    /// @notice Swap ERC-20 tokens via PancakeSwap V3 with protocol fee
    /// @param tokenIn  Input token address
    /// @param tokenOut Output token address
    /// @param poolFee  PancakeSwap V3 pool fee tier (e.g. 2500)
    /// @param amountIn Total amount to swap (fee deducted before swap)
    /// @param amountOutMin Minimum output after slippage
    function swapExactInput(
        address tokenIn,
        address tokenOut,
        uint24 poolFee,
        uint256 amountIn,
        uint256 amountOutMin
    ) external nonReentrant returns (uint256 amountOut) {
        if (amountIn == 0) revert ZeroAmount();

        // Pull tokens from user
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // Deduct fee
        uint256 fee = (amountIn * feeBps) / 10000;
        uint256 swapAmount = amountIn - fee;
        if (fee > 0) {
            IERC20(tokenIn).safeTransfer(feeRecipient, fee);
        }

        // Approve router
        IERC20(tokenIn).forceApprove(pancakeRouter, swapAmount);

        // Execute swap
        IPancakeV3Router.ExactInputSingleParams memory params = IPancakeV3Router
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: swapAmount,
                amountOutMinimum: amountOutMin,
                sqrtPriceLimitX96: 0
            });

        amountOut = IPancakeV3Router(pancakeRouter).exactInputSingle(params);
        if (amountOut == 0) revert SwapFailed();

        emit SwapExecuted(msg.sender, tokenIn, tokenOut, amountIn, amountOut, fee);
    }

    /// @notice Swap native BNB for tokens via PancakeSwap V3 with protocol fee
    /// @param tokenOut Output token address
    /// @param poolFee  PancakeSwap V3 pool fee tier
    /// @param amountOutMin Minimum output after slippage
    function swapExactInputBNB(
        address tokenOut,
        uint24 poolFee,
        uint256 amountOutMin
    ) external payable nonReentrant returns (uint256 amountOut) {
        if (msg.value == 0) revert ZeroAmount();

        // Deduct fee from BNB
        uint256 fee = (msg.value * feeBps) / 10000;
        uint256 swapAmount = msg.value - fee;
        if (fee > 0) {
            (bool sent, ) = feeRecipient.call{value: fee}("");
            if (!sent) revert BNBTransferFailed();
        }

        // Wrap BNB → WBNB
        IWBNB(WBNB).deposit{value: swapAmount}();

        // Approve router
        IERC20(WBNB).forceApprove(pancakeRouter, swapAmount);

        // Execute swap
        IPancakeV3Router.ExactInputSingleParams memory params = IPancakeV3Router
            .ExactInputSingleParams({
                tokenIn: WBNB,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: swapAmount,
                amountOutMinimum: amountOutMin,
                sqrtPriceLimitX96: 0
            });

        amountOut = IPancakeV3Router(pancakeRouter).exactInputSingle(params);
        if (amountOut == 0) revert SwapFailed();

        emit SwapExecuted(msg.sender, WBNB, tokenOut, msg.value, amountOut, fee);
    }

    /// @notice Supply tokens to Venus Protocol with protocol fee
    /// @param vToken  Venus vToken address (e.g. vUSDT)
    /// @param underlying Underlying token address (e.g. USDT)
    /// @param amount  Total amount to supply (fee deducted before supply)
    function supplyToVenus(
        address vToken,
        address underlying,
        uint256 amount
    ) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        // Pull tokens from user
        IERC20(underlying).safeTransferFrom(msg.sender, address(this), amount);

        // Deduct fee
        uint256 fee = (amount * feeBps) / 10000;
        uint256 supplyAmount = amount - fee;
        if (fee > 0) {
            IERC20(underlying).safeTransfer(feeRecipient, fee);
        }

        // Approve vToken
        IERC20(underlying).forceApprove(vToken, supplyAmount);

        // Supply to Venus (mint returns 0 on success)
        uint256 result = IVToken(vToken).mint(supplyAmount);
        if (result != 0) revert VenusSupplyFailed();

        // Transfer vTokens to user
        uint256 vTokenBalance = IERC20(vToken).balanceOf(address(this));
        if (vTokenBalance > 0) {
            IERC20(vToken).safeTransfer(msg.sender, vTokenBalance);
        }

        emit SupplyExecuted(msg.sender, vToken, supplyAmount, fee);
    }

    /// @notice Redeem tokens from Venus Protocol with protocol fee
    /// @param vToken  Venus vToken address
    /// @param underlying Underlying token address
    /// @param redeemAmount Amount of underlying to redeem
    /// @param vTokenAmount Amount of vTokens to pull from user (with buffer)
    function redeemFromVenus(
        address vToken,
        address underlying,
        uint256 redeemAmount,
        uint256 vTokenAmount
    ) external nonReentrant {
        if (redeemAmount == 0) revert ZeroAmount();

        // Pull vTokens from user
        IERC20(vToken).safeTransferFrom(msg.sender, address(this), vTokenAmount);

        // Redeem underlying (returns 0 on success)
        uint256 result = IVToken(vToken).redeemUnderlying(redeemAmount);
        if (result != 0) revert VenusRedeemFailed();

        // Return excess vTokens to user
        uint256 vTokenRemaining = IERC20(vToken).balanceOf(address(this));
        if (vTokenRemaining > 0) {
            IERC20(vToken).safeTransfer(msg.sender, vTokenRemaining);
        }

        // Deduct fee from redeemed output
        uint256 fee = (redeemAmount * feeBps) / 10000;
        uint256 userAmount = redeemAmount - fee;
        if (fee > 0) {
            IERC20(underlying).safeTransfer(feeRecipient, fee);
        }
        IERC20(underlying).safeTransfer(msg.sender, userAmount);

        emit RedeemExecuted(msg.sender, vToken, redeemAmount, fee);
    }

    // ========== ADMIN FUNCTIONS ==========

    /// @notice Update the protocol fee (max 100 bps = 1%)
    function setFeeBps(uint256 _feeBps) external onlyOwner {
        if (_feeBps > 100) revert FeeTooHigh();
        uint256 old = feeBps;
        feeBps = _feeBps;
        emit FeeBpsUpdated(old, _feeBps);
    }

    /// @notice Update the fee recipient address
    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        if (_feeRecipient == address(0)) revert ZeroAddress();
        address old = feeRecipient;
        feeRecipient = _feeRecipient;
        emit FeeRecipientUpdated(old, _feeRecipient);
    }

    /// @notice Withdraw accumulated ERC-20 fees
    function withdrawFees(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    /// @notice Withdraw accumulated BNB fees
    function withdrawBNBFees(uint256 amount) external onlyOwner {
        (bool sent, ) = msg.sender.call{value: amount}("");
        if (!sent) revert BNBTransferFailed();
    }

    /// @notice Rescue stuck ERC-20 tokens
    function rescueToken(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    /// @notice Rescue stuck BNB
    function rescueBNB(uint256 amount) external onlyOwner {
        (bool sent, ) = msg.sender.call{value: amount}("");
        if (!sent) revert BNBTransferFailed();
    }
}
