# プロジェクト概要

## プロジェクト目的
不老不死デジタル人格アプリ - ブロックチェーン技術を活用して永続的に保存されるデジタル人格と、OpenAI APIを組み合わせた対話システム

## 技術スタック
### フロントエンド
- Next.js 15.3.3 (Pages Router)
- React 19.1.0
- TypeScript 5.5.4
- wagmi 2.15.6 (Ethereum interactions)
- viem 2.29.2 (TypeScript Ethereum library)
- @rainbow-me/rainbowkit 2.2.8 (Wallet connection)

### ブロックチェーン
- Foundry (Solidity development framework)
- Anvil (Local Ethereum fork)
- Solidity (Smart contracts)

## プロジェクト構造
- packages/frontend/ - Next.jsフロントエンドアプリケーション
- packages/contract/ - Solidityスマートコントラクト
- docs/design.md - 詳細な技術設計書

## 現在のフォルダ構成 (Pages Router)
- src/pages/ - ページコンポーネント
- src/styles/ - CSSスタイル
- src/wagmi.ts - Web3設定