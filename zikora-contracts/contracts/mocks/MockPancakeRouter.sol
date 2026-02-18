// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IPancakeV3Router.sol";

/// @notice Mock PancakeSwap V3 router for testing.
///         Simulates a 1:1 swap (transfers amountIn of tokenIn, mints amountIn of tokenOut).
contract MockPancakeRouter {
    // 1:1 swap ratio for simplicity
    function exactInputSingle(
        IPancakeV3Router.ExactInputSingleParams calldata params
    ) external payable returns (uint256 amountOut) {
        // Pull tokenIn from caller
        IERC20(params.tokenIn).transferFrom(msg.sender, address(this), params.amountIn);

        // Send tokenOut to recipient (must have balance pre-funded)
        amountOut = params.amountIn; // 1:1 ratio
        IERC20(params.tokenOut).transfer(params.recipient, amountOut);

        return amountOut;
    }
}
