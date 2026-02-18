// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice Mock Venus vToken for testing.
///         mint(): pulls underlying, mints vTokens 1:1
///         redeemUnderlying(): burns vTokens 1:1, returns underlying
contract MockVToken is ERC20 {
    address public underlying;
    bool public shouldFailMint;
    bool public shouldFailRedeem;

    constructor(
        string memory name_,
        string memory symbol_,
        address _underlying
    ) ERC20(name_, symbol_) {
        underlying = _underlying;
    }

    /// @notice Simulate Venus mint (supply). Returns 0 on success, non-zero on failure.
    function mint(uint256 mintAmount) external returns (uint256) {
        if (shouldFailMint) return 1;

        // Pull underlying from caller
        IERC20(underlying).transferFrom(msg.sender, address(this), mintAmount);

        // Mint vTokens 1:1
        _mint(msg.sender, mintAmount);

        return 0; // success
    }

    /// @notice Simulate Venus redeemUnderlying. Returns 0 on success.
    function redeemUnderlying(uint256 redeemAmount) external returns (uint256) {
        if (shouldFailRedeem) return 1;

        // Burn vTokens 1:1
        _burn(msg.sender, redeemAmount);

        // Return underlying
        IERC20(underlying).transfer(msg.sender, redeemAmount);

        return 0; // success
    }

    // --- Test helpers ---
    function setFailMint(bool _fail) external {
        shouldFailMint = _fail;
    }

    function setFailRedeem(bool _fail) external {
        shouldFailRedeem = _fail;
    }
}
