export interface TokenMeta {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  vToken?: string; // Venus vToken address (mainnet)
}

// BSC Mainnet tokens
export const TOKENS: Record<string, TokenMeta> = {
  BNB: {
    symbol: 'BNB',
    name: 'BNB',
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB
    decimals: 18,
    vToken: '0xA07c5b74C9B40447a954e1466938b865b6BBea36',
  },
  WBNB: {
    symbol: 'WBNB',
    name: 'Wrapped BNB',
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    decimals: 18,
    vToken: '0xA07c5b74C9B40447a954e1466938b865b6BBea36',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0x55d398326f99059fF775485246999027B3197955',
    decimals: 18,
    vToken: '0xfD5840Cd36d94D7229439859C0112a4185BC0255',
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    decimals: 18,
  },
};

export function resolveToken(symbolOrAddress: string): TokenMeta | undefined {
  const upper = symbolOrAddress.toUpperCase();
  if (TOKENS[upper]) return TOKENS[upper];
  const lower = symbolOrAddress.toLowerCase();
  return Object.values(TOKENS).find(
    (t) => t.address.toLowerCase() === lower,
  );
}
