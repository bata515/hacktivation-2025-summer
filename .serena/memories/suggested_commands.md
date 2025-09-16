# 推奨コマンド

## 開発サーバー起動
```bash
# フロントエンド
cd packages/frontend
pnpm dev

# ブロックチェーン（Anvil）
cd packages/contract
anvil
```

## ビルド
```bash
# フロントエンド
cd packages/frontend
pnpm build

# スマートコントラクト
cd packages/contract
forge build
```

## テスト
```bash
# スマートコントラクト
cd packages/contract
forge test
```

## デプロイ
```bash
# スマートコントラクト（ローカル）
cd packages/contract
forge script script/PersonaRegistry.s.sol --rpc-url http://localhost:8545 --broadcast
```

## 基本コマンド (macOS)
- ls - ディレクトリ内容表示
- cd - ディレクトリ変更
- grep - テキスト検索
- find - ファイル検索
- git - バージョン管理