# CLAUDE.md

このファイルは、このリポジトリでコード作業を行う際の Claude Code (claude.ai/code) 向けのガイダンスです。
※迷うことがあれば、docs/requirements.md に要件がまとまっているので参照して方針がずれないようにしてください。

## プロジェクト概要

「不老不死デジタル人格」アプリケーションのモノレポです。ブロックチェーン技術と AI を組み合わせて、永続的なデジタル人格を作成し対話できるシステムを実装しています。pnpm workspaces で以下の 2 つのパッケージを管理：

- `packages/contract` - Solidity スマートコントラクト（Foundry 使用）
- `packages/frontend` - RainbowKit 統合の Next.js ウェブアプリケーション

## コマンド

### フロントエンド開発 (packages/frontend)

```bash
# 依存関係のインストール（ルートからpnpmを使用）
pnpm install

# 開発サーバー
cd packages/frontend && pnpm dev

# プロダクションビルド
cd packages/frontend && pnpm build

# プロダクションサーバー起動
cd packages/frontend && pnpm start
```

### スマートコントラクト開発 (packages/contract)

```bash
# コントラクトのビルド
cd packages/contract && forge build

# テスト実行
cd packages/contract && forge test

# Solidityコードのフォーマット
cd packages/contract && forge fmt

# ローカルブロックチェーンノード
cd packages/contract && anvil

# コントラクトのデプロイ
cd packages/contract && forge script script/Counter.s.sol:CounterScript --rpc-url <rpc_url> --private-key <private_key>
```

## アーキテクチャ

### アプリケーション構造

デジタル人格システムの実装：

1. ユーザー人格（人格コンテキスト）をスマートコントラクト経由でオンチェーンに保存
2. フロントエンドは MetaMask 経由でブロックチェーンに接続
3. チャットインターフェースはブラウザから直接 OpenAI API を呼び出し
4. バックエンドサーバーなし - 全ロジックがクライアントサイドで実行

### 主要コンポーネント

**フロントエンド (Next.js + TypeScript)**

- `packages/frontend/src/app/`で App Router パターンを使用
- `src/wagmi.ts`で RainbowKit ウォレット接続を設定
- チャット機能のための OpenAI API 直接統合
- 人格の保存/取得のためのブロックチェーン連携

**スマートコントラクト (Solidity + Foundry)**

- `test/`ディレクトリにテストファイル
- `script/`ディレクトリにデプロイスクリプト

### データフロー

1. ユーザーが人格を作成 → ブロックチェーンに保存
2. ユーザーが人格を選択 → ブロックチェーンからコンテキストを取得
3. チャットメッセージ → 人格コンテキストと結合 → OpenAI API に送信
4. AI レスポンス → チャット UI に表示

## 開発上の考慮事項

### 環境変数

フロントエンドで必要：

- `NEXT_PUBLIC_ENABLE_TESTNETS` - テストネットチェーンを有効化
- `wagmi.ts`で RainbowKit プロジェクト ID の設定が必要
- OpenAI API キー管理（クライアントサイド）

### ブロックチェーン統合

- 複数チェーンに対応設定済み（mainnet、polygon、optimism、arbitrum、base、sepolia）
- RainbowKit 経由の MetaMask ウォレット接続
- フロントエンド統合前にスマートコントラクトのデプロイが必要

### 人格データ構造

人格は JSON 形式で保存：

- 基本情報（名前、年齢、職業）
- 性格特徴と話し方
- 知識、経験、記憶
- 価値観と信念
- 作成/更新のタイムスタンプ
