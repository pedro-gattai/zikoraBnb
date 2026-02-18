import { ADDRESSES } from './addresses';

export interface TokenMeta {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  vToken?: string; // Venus vToken address
}

/**
 * Returns token metadata for the given chainId, pulling addresses from addresses.ts.
 * Supports BSC Mainnet (56) and BSC Testnet (97).
 */
export function getTokens(chainId: number): Record<string, TokenMeta> {
  const addrs = ADDRESSES[chainId] || ADDRESSES[97];

  return {
    BNB: {
      symbol: 'BNB',
      name: 'BNB',
      address: addrs.WBNB,
      decimals: 18,
      vToken: addrs.vBNB,
    },
    WBNB: {
      symbol: 'WBNB',
      name: 'Wrapped BNB',
      address: addrs.WBNB,
      decimals: 18,
      vToken: addrs.vBNB,
    },
    USDT: {
      symbol: 'USDT',
      name: 'Tether USD',
      address: addrs.USDT,
      decimals: 18,
      vToken: addrs.vUSDT,
    },
    USDC: {
      symbol: 'USDC',
      name: 'USD Coin',
      address: addrs.USDC,
      decimals: 18,
    },
  };
}

export function resolveToken(
  symbolOrAddress: string,
  chainId: number,
): TokenMeta | undefined {
  const tokens = getTokens(chainId);
  const upper = symbolOrAddress.toUpperCase();
  if (tokens[upper]) return tokens[upper];
  const lower = symbolOrAddress.toLowerCase();
  return Object.values(tokens).find(
    (t) => t.address.toLowerCase() === lower,
  );
}
