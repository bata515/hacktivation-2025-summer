/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // TypeScript設定の強制
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  turbopack: {
    // Turbopackのルート設定（pnpm workspaceの警告対策）
    root: "../..",
    rules: {
      // Turbopack用の設定
    },
  },
  // Webpack設定（本番ビルドでのみ使用）
  webpack: (config, { dev }) => {
    // 開発環境でTurbopackを使用している場合はWebpack設定をスキップ
    if (dev) {
      return config;
    }
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

module.exports = nextConfig;
