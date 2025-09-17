import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { localhost, sepolia } from 'wagmi/chains';

// Anvilローカルチェーンの設定
const anvil = {
  id: 31337,
  name: 'Anvil',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['http://127.0.0.1:8546'] },
    default: { http: ['http://127.0.0.1:8546'] },
  },
  blockExplorers: {
    default: { name: 'Local', url: 'http://localhost:8546' },
  },
} as const;

export const config = getDefaultConfig({
  appName: '不老不死デジタル人格アプリ',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'default-project-id',
  chains: [
    anvil,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});
