import { createConfig, createStorage, http } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [bsc],
  connectors: [injected()],
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  }),
  transports: {
    [bsc.id]: http(
      process.env.NEXT_PUBLIC_BSC_RPC_URL ||
        'https://bsc-dataseed1.binance.org/'
    ),
  },
  ssr: true,
})
