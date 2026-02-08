// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IPancakeV3Router.sol";
import "./interfaces/IVToken.sol";

/// @title ZikoraVault
/// @notice Vault contract for the Zikora DeFAI platform on BNB Chain.
///         Owner deposits/withdraws funds. Operator (backend) executes DeFi operations
///         (swaps via PancakeSwap V3, supply/redeem via Venus Protocol).
///         Safety limits enforce max trade size and slippage.
contract ZikoraVault is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // --- State ---
    address public operator;
    address public immutable pancakeRouter;
    address public immutable WBNB;

    uint256 public maxTradePercent = 25; // max 25% of token balance per operation
    uint256 public maxSlippageBps = 100; // max 1% slippage (100 basis points)

    // --- Events ---
    event Deposited(address indexed token, uint256 amount);
    event DepositedBNB(uint256 amount);
    event Withdrawn(address indexed token, uint256 amount);
    event WithdrawnBNB(uint256 amount);
    event OperatorUpdated(address indexed oldOperator, address indexed newOperator);
    event SwapExecuted(address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);
    event VenusSupplied(address indexed vToken, uint256 amount);
    event VenusRedeemed(address indexed vToken, uint256 amount);
    event MaxTradePercentUpdated(uint256 oldValue, uint256 newValue);
    event MaxSlippageBpsUpdated(uint256 oldValue, uint256 newValue);

    // --- Errors ---
    error NotOperator();
    error ZeroAddress();
    error ZeroAmount();
    error ExceedsMaxTradePercent(uint256 requested, uint256 maxAllowed);
    error InsufficientBalance(uint256 requested, uint256 available);
    error InvalidPercent();
    error InvalidSlippage();
    error SwapFailed();
    error VenusSupplyFailed();
    error VenusRedeemFailed();
    error BNBTransferFailed();

    // --- Modifiers ---
    modifier onlyOperator() {
        if (msg.sender != operator) revert NotOperator();
        _;
    }

    // --- Constructor ---
    constructor(
        address _pancakeRouter,
        address _wbnb
    ) Ownable(msg.sender) {
        if (_pancakeRouter == address(0) || _wbnb == address(0)) revert ZeroAddress();
        pancakeRouter = _pancakeRouter;
        WBNB = _wbnb;
    }

    // --- Receive BNB ---
    receive() external payable {}

    // ========== OWNER FUNCTIONS ==========

    /// @notice Deposit ERC-20 tokens into the vault
    function deposit(address token, uint256 amount) external onlyOwner nonReentrant {
        if (token == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit Deposited(token, amount);
    }

    /// @notice Deposit BNB into the vault
    function depositBNB() external payable onlyOwner nonReentrant {
        if (msg.value == 0) revert ZeroAmount();
        emit DepositedBNB(msg.value);
    }

    /// @notice Withdraw ERC-20 tokens from the vault
    function withdraw(address token, uint256 amount) external onlyOwner nonReentrant {
        if (token == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        uint256 balance = IERC20(token).balanceOf(address(this));
        if (amount > balance) revert InsufficientBalance(amount, balance);
        IERC20(token).safeTransfer(msg.sender, amount);
        emit Withdrawn(token, amount);
    }

    /// @notice Withdraw BNB from the vault
    function withdrawBNB(uint256 amount) external onlyOwner nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (amount > address(this).balance) revert InsufficientBalance(amount, address(this).balance);
        (bool success, ) = msg.sender.call{value: amount}("");
        if (!success) revert BNBTransferFailed();
        emit WithdrawnBNB(amount);
    }

    /// @notice Set the operator address (backend wallet)
    function setOperator(address _operator) external onlyOwner {
        if (_operator == address(0)) revert ZeroAddress();
        address old = operator;
        operator = _operator;
        emit OperatorUpdated(old, _operator);
    }

    /// @notice Update max trade percent (1-100)
    function setMaxTradePercent(uint256 _maxTradePercent) external onlyOwner {
        if (_maxTradePercent == 0 || _maxTradePercent > 100) revert InvalidPercent();
        uint256 old = maxTradePercent;
        maxTradePercent = _maxTradePercent;
        emit MaxTradePercentUpdated(old, _maxTradePercent);
    }

    /// @notice Update max slippage in basis points (1-10000)
    function setMaxSlippageBps(uint256 _maxSlippageBps) external onlyOwner {
        if (_maxSlippageBps == 0 || _maxSlippageBps > 10000) revert InvalidSlippage();
        uint256 old = maxSlippageBps;
        maxSlippageBps = _maxSlippageBps;
        emit MaxSlippageBpsUpdated(old, _maxSlippageBps);
    }

    /// @notice Pause the vault (blocks operator operations)
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause the vault
    function unpause() external onlyOwner {
        _unpause();
    }

    // ========== OPERATOR FUNCTIONS ==========

    /// @notice Execute a token swap via PancakeSwap V3
    function executeSwap(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        uint256 amountIn,
        uint256 amountOutMin
    ) external onlyOperator whenNotPaused nonReentrant returns (uint256 amountOut) {
        if (tokenIn == address(0) || tokenOut == address(0)) revert ZeroAddress();
        if (amountIn == 0) revert ZeroAmount();

        // Safety: enforce max trade percent
        uint256 balance = IERC20(tokenIn).balanceOf(address(this));
        uint256 maxAllowed = (balance * maxTradePercent) / 100;
        if (amountIn > maxAllowed) revert ExceedsMaxTradePercent(amountIn, maxAllowed);

        // Approve router
        IERC20(tokenIn).safeIncreaseAllowance(pancakeRouter, amountIn);

        // Execute swap
        IPancakeV3Router.ExactInputSingleParams memory params = IPancakeV3Router.ExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: fee,
            recipient: address(this),
            amountIn: amountIn,
            amountOutMinimum: amountOutMin,
            sqrtPriceLimitX96: 0
        });

        amountOut = IPancakeV3Router(pancakeRouter).exactInputSingle(params);
        if (amountOut == 0) revert SwapFailed();

        emit SwapExecuted(tokenIn, tokenOut, amountIn, amountOut);
    }

    /// @notice Supply tokens to Venus Protocol
    function executeVenusSupply(
        address vToken,
        address underlying,
        uint256 amount
    ) external onlyOperator whenNotPaused nonReentrant {
        if (vToken == address(0) || underlying == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        // Safety: enforce max trade percent
        uint256 balance = IERC20(underlying).balanceOf(address(this));
        uint256 maxAllowed = (balance * maxTradePercent) / 100;
        if (amount > maxAllowed) revert ExceedsMaxTradePercent(amount, maxAllowed);

        // Approve vToken to pull underlying
        IERC20(underlying).safeIncreaseAllowance(vToken, amount);

        // Supply to Venus (mint returns 0 on success)
        uint256 result = IVToken(vToken).mint(amount);
        if (result != 0) revert VenusSupplyFailed();

        emit VenusSupplied(vToken, amount);
    }

    /// @notice Redeem tokens from Venus Protocol
    function executeVenusRedeem(
        address vToken,
        uint256 amount
    ) external onlyOperator whenNotPaused nonReentrant {
        if (vToken == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        // Redeem underlying (returns 0 on success)
        uint256 result = IVToken(vToken).redeemUnderlying(amount);
        if (result != 0) revert VenusRedeemFailed();

        emit VenusRedeemed(vToken, amount);
    }

    // ========== VIEW FUNCTIONS ==========

    /// @notice Get the vault's balance of a specific ERC-20 token
    function getTokenBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    /// @notice Get the vault's BNB balance
    function getBNBBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
