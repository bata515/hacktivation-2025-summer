# コーディング規約

## TypeScript
- 厳密な型チェック有効
- ESModuleInterop使用
- JSX preserve設定

## ファイル命名
- コンポーネント: PascalCase (例: PersonaForm.tsx)
- ページ: kebab-case or camelCase
- ユーティリティ: camelCase

## 設計パターン
- App Router推奨（設計書では推奨されているが現在はPages Router使用）
- Zustand + Custom Hooks for状態管理
- Component-based architecture

## Web3関連
- wagmi hooksを使用
- viem for low-level operations
- RainbowKit for wallet connection