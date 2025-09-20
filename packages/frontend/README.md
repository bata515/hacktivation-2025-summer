# 不老不死デジタル人格アプリ - フロントエンド

Next.js 15.3.3 とブロックチェーン技術を活用した永続的デジタル人格システムのフロントエンドアプリケーション。

## 🚀 クイックスタート

### 前提条件

- Node.js >= 20.0.0
- pnpm >= 10.16.0
- MetaMask またはその他の Web3 ウォレット
- Foundry (コントラクト開発用)

### セットアップ手順

1. **依存関係のインストール**
```bash
cd packages/frontend
pnpm install
```

2. **ローカルブロックチェーンの起動**
```bash
# 別のターミナルで実行
cd packages/contract
anvil
```

3. **スマートコントラクトのデプロイ**
```bash
cd packages/contract
forge script script/PersonaRegistry.s.sol --rpc-url http://localhost:8545 --broadcast
```

4. **フロントエンドの起動**
```bash
cd packages/frontend
pnpm dev
```

5. **ブラウザでアクセス**
```
http://localhost:3000
```

## 🏗️ アーキテクチャ

### 技術スタック

- **Framework**: Next.js 15.3.3 (App Router)
- **UI**: React 19.1.0 + Tailwind CSS
- **Web3**: wagmi 2.15.6 + viem 2.29.2 + RainbowKit 2.2.8
- **State Management**: React Hooks + Zustand (built-in)
- **Type Safety**: TypeScript 5.5.4

### ディレクトリ構造

```
src/
├── app/                      # Next.js App Router ページ
│   ├── page.tsx             # ホームページ
│   ├── layout.tsx           # ルートレイアウト
│   ├── providers.tsx        # Web3プロバイダー設定
│   └── personas/
│       ├── create/          # 人格作成ページ
│       └── [id]/            # 人格詳細・編集ページ
├── components/              # Reactコンポーネント
│   ├── Layout/              # レイアウトコンポーネント
│   ├── Persona/             # 人格関連コンポーネント
│   ├── Chat/                # チャット機能コンポーネント
│   └── Web3/                # Web3接続コンポーネント
├── hooks/                   # カスタムフック
│   └── usePersonaContract.ts # コントラクト操作フック
├── lib/                     # ユーティリティ
│   ├── contracts.ts         # コントラクト設定・ABI
│   └── utils.ts             # ヘルパー関数
├── types/                   # TypeScript型定義
│   └── persona.ts           # 人格データ型
└── styles/                  # スタイル
    └── globals.css          # グローバルCSS
```

## 🔗 主要機能

### 1. ウォレット接続
- RainbowKit による快適なウォレット接続体験
- MetaMask、WalletConnect など主要ウォレットに対応
- Anvil ローカルチェーンとの自動接続

### 2. 人格管理
- **作成**: 詳細な人格データ（基本情報、性格、知識、価値観）をブロックチェーンに保存
- **編集**: 既存人格の情報を更新（所有者のみ）
- **一覧表示**: ユーザーが所有する人格の表示
- **削除・再有効化**: 人格の無効化/再有効化機能

### 3. 対話システム
- 人格データに基づくデモ対話機能
- OpenAI API 統合の準備済み（システムプロンプト生成機能）
- リアルタイムチャットインターフェース

## 🛠️ 開発ガイド

### コントラクト操作

スマートコントラクトとの通信は `usePersonaContract.ts` フックを通じて行います：

```typescript
import { useCreatePersona, useUserPersonas } from '@/hooks/usePersonaContract';

// 人格作成
const { createPersona, isPending } = useCreatePersona();

// ユーザーの人格一覧取得
const { personas, isLoading } = useUserPersonas();
```

### 型安全性

すべてのコントラクトデータは TypeScript で型定義されています：

```typescript
import { Persona, PersonaFormData } from '@/types/persona';

// 人格データの型安全な操作
function handlePersona(persona: Persona) {
  console.log(persona.name); // 型安全
  console.log(persona.basicInfo.age); // ネストした型も安全
}
```

### コンポーネント設計

再利用可能なコンポーネントを中心とした設計：

```typescript
// 人格カード表示
<PersonaCard persona={persona} showActions={true} />

// 人格作成フォーム
<PersonaForm mode="create" onSuccess={handleSuccess} />

// チャットインターフェース
<ChatInterface persona={persona} />
```

## 🔧 設定

### 環境変数

`.env.local` ファイルを作成して以下を設定：

```bash
# OpenAI API（将来の機能拡張用）
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key

# WalletConnect Project ID（オプション）
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# ネットワーク設定
NEXT_PUBLIC_ENABLE_TESTNETS=true
```

### ローカル開発

Anvil ローカルチェーンを使用して開発：

```bash
# Anvilの起動（別ターミナル）
anvil

# コントラクトアドレスの確認
# packages/contract/broadcast/PersonaRegistry.s.sol/31337/run-latest.json
```

## 📝 使用例

### 基本的な使用フロー

1. **ウォレット接続**
   - ページ右上の「ウォレットを接続」ボタンをクリック
   - MetaMask で Anvil ネットワークに接続

2. **人格作成**
   - 「新しい人格を作成」ボタンをクリック
   - 必要な情報を入力（名前、年齢、職業、背景など）
   - トランザクションを承認

3. **対話開始**
   - 作成した人格カードの「チャット」ボタンをクリック
   - メッセージを入力して対話を開始

### サンプルデータ

開発・テスト用のサンプル人格データ：

```typescript
const samplePersona = {
  name: "Albert Einstein",
  age: 76,
  occupation: "Theoretical Physicist",
  background: "German-born theoretical physicist who developed the theory of relativity",
  traits: "Curious,Imaginative,Persistent,Humble",
  speakingStyle: "Thoughtful and profound, often using analogies",
  tone: "Formal but warm, sometimes playful",
  expertise: "Physics,Mathematics,Philosophy,Violin",
  experiences: "Theory of Relativity,Nobel Prize in Physics,Princeton Institute",
  memories: "E=mc2 formula,Patent office days,Sailing without wind",
  beliefs: "Science serves humanity,Peace over war,Imagination is more important than knowledge",
  priorities: "Understanding nature,Promoting peace,Helping young scientists"
};
```

## 🚨 注意事項

### 初心者が注意すべきポイント

1. **ネットワーク設定**
   - MetaMask で Anvil ネットワーク（Chain ID: 31337）に接続
   - RPC URL: `http://127.0.0.1:8545`

2. **トランザクション承認**
   - すべてのコントラクト操作でMetaMaskの承認が必要
   - ガス代は Anvil では無料

3. **データの永続性**
   - Anvil 再起動時にデータはリセットされる
   - 本番環境では永続的に保存される

4. **エラーハンドリング**
   - ネットワーク接続エラー
   - トランザクション失敗
   - 入力データ検証エラー

## 🔮 今後の拡張

### 実装予定機能

- **OpenAI API 統合**: 実際のAI対話機能
- **IPFS 統合**: 大容量データの分散保存
- **NFT 化**: 人格のNFTトークン化
- **マルチチェーン対応**: 複数ブロックチェーンへの対応
- **音声対話**: 音声入出力機能

### 設計上の考慮点

- **スケーラビリティ**: 大量の人格データに対応
- **セキュリティ**: プライベートキー管理とトランザクション安全性
- **ユーザビリティ**: Web3初心者向けのUI/UX改善
- **パフォーマンス**: ブロックチェーン読み込み速度の最適化

## 📚 参考資料

- [Next.js Documentation](https://nextjs.org/docs)
- [wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://www.rainbowkit.com/)
- [Foundry Documentation](https://book.getfoundry.sh/)
- [Solidity Documentation](https://docs.soliditylang.org/)

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。
