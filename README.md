# 不老不死デジタル人格アプリ

Engineer Cafe Hacktivation 2025 用リポジトリ

ブロックチェーン技術と AI を組み合わせて、永続的なデジタル人格を作成し対話できるシステムです。

## 📊 プレゼンテーション資料

- **ハッカソン発表スライド**: [docs/Hacktivation2025\_不老不死 dApp.pptx](docs/Hacktivation2025_不老不死dApp.pptx)
  - Engineer Cafe Hacktivation 2025 での発表資料

## 🚀 クイックスタート

### 前提条件

- Docker がインストールされていること
- Node.js 18+ がインストールされていること（ローカル実行の場合）
- pnpm がインストールされていること（モノレポ管理用）

### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd hacktivation-2025-summer
```

### 2. 開発環境を起動

```bash
./start-dev.sh
```

このスクリプトが自動的に以下を実行します：

- Anvil（ローカルブロックチェーン）の起動
- Foundry のインストール（必要に応じて）
- PersonaRegistry コントラクトのデプロイ
- フロントエンドの起動

### 3. アプリケーションにアクセス

- **フロントエンド**: http://localhost:3000
- **ローカルブロックチェーン**: http://localhost:8545

## 📋 開発環境の詳細

### サービス構成

| サービス | URL                   | 説明                        |
| -------- | --------------------- | --------------------------- |
| Anvil    | http://localhost:8545 | ローカル Ethereum ノード    |
| Frontend | http://localhost:3000 | Next.js + RainbowKit アプリ |

### デフォルトアカウント

開発用のプリセットアカウント：

- **アドレス**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **秘密鍵**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- **残高**: 10,000 ETH

## 🛠️ 開発コマンド

### スマートコントラクト (packages/contract)

```bash
cd packages/contract

# ビルド
forge build

# テスト実行
forge test

# Solidityコードのフォーマット
forge fmt

# PersonaRegistryをデプロイ
forge script script/PersonaRegistry.s.sol:PersonaRegistryScript \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast
```

### フロントエンド (packages/frontend)

```bash
cd packages/frontend

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start
```

## 🔗 MetaMask の設定

フロントエンドでウォレット接続するには、MetaMask に以下のネットワークを追加してください：

```
ネットワーク名: Anvil Local
RPC URL: http://localhost:8545
チェーンID: 31337
通貨記号: ETH
```

開発用アカウントをインポート：

- 上記の秘密鍵を使用してアカウントをインポート

## 🔄 環境のリセット

開発環境をクリーンアップして再起動：

```bash
# Dockerコンテナを停止・削除
docker stop anvil-dev 2>/dev/null || true
docker rm anvil-dev 2>/dev/null || true

# 再起動
./start-dev.sh
```

## 🏗️ アーキテクチャ

### プロジェクト構造

```
├── packages/
│   ├── contract/          # Solidity スマートコントラクト
│   │   ├── src/          # コントラクトソースコード
│   │   ├── test/         # テストファイル
│   │   └── script/       # デプロイスクリプト
│   └── frontend/         # Next.js フロントエンド
│       ├── src/          # アプリケーションソース
│       └── public/       # 静的ファイル
└── start-dev.sh          # 開発環境起動スクリプト
```

### データフロー

1. **人格作成**: ユーザーが人格情報を入力 → ブロックチェーンに保存
2. **人格選択**: 保存された人格をブロックチェーンから取得
3. **AI 対話**: 人格コンテキストと組み合わせて OpenAI API に送信
4. **レスポンス**: AI からの返答をチャット画面に表示

## 🐛 トラブルシューティング

### よくある問題

**Anvil に接続できない**

```bash
# ポート使用状況を確認
lsof -i :8545

# Dockerプロセスを確認
docker ps
```

**フロントエンドでウォレット接続エラー**

1. MetaMask で Anvil Local ネットワークが追加されているか確認
2. 開発用アカウントがインポートされているか確認
3. ブラウザキャッシュをクリア

**コントラクトデプロイが失敗**

```bash
# Anvilが起動中か確認
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545
```

## 📚 技術スタック

- **ブロックチェーン**: Foundry (Anvil)
- **スマートコントラクト**: Solidity
- **フロントエンド**: Next.js 15, TypeScript
- **ウォレット統合**: RainbowKit, Wagmi
- **AI 統合**: OpenAI API
- **スタイリング**: Tailwind CSS

## 🔗 参考リンク

- [Foundry Documentation](https://book.getfoundry.sh/)
- [Next.js Documentation](https://nextjs.org/docs)
- [RainbowKit Documentation](https://rainbowkit.com/)
- [Wagmi Documentation](https://wagmi.sh/)
