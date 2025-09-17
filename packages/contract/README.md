## Foundry とは

**Foundry は Rust で書かれた高速で移植性があり、モジュラーな Ethereum アプリケーション開発ツールキットです。**

Foundry の構成要素:

- **Forge**: Ethereum テストフレームワーク（Truffle、Hardhat、DappTools のような）
- **Cast**: EVM スマートコントラクトとの対話、トランザクション送信、チェーンデータ取得のためのツール
- **Anvil**: ローカル Ethereum ノード（Ganache、Hardhat Network のような）
- **Chisel**: 高速で実用的な Solidity REPL

## ドキュメント

https://book.getfoundry.sh/

# 実行手順

## 1. Anvil ローカルチェーンの起動

```bash
anvil -p 8549
# user04 = 8545+4=8549
```

## 2. 別ターミナルでコントラクトの準備とデプロイ

```bash
cd hacktivation-2025-summer/packages/contract
forge install
forge script script/PersonaRegistry.s.sol \
  --broadcast \
  --rpc-url 127.0.0.1:8549 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --via-ir --optimizer-runs 200
```

デプロイ後、コントラクトアドレスをメモしてください（例: 0x5FbDB2315678afecb367f032d93F642f64180aa3）

## 3. Cast を使用したコントラクトとの対話

### 総人格数の確認

```bash
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "getTotalPersonaCount()(uint256)" --rpc-url 127.0.0.1:8549
```

### 人格の作成

```bash
cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "createPersona(string,uint8,string,string,string,string,string,string,string,string,string,string)" "夏目漱石" 49 "小説家" "明治の文豪" "内省的,繊細" "文学的" "丁寧語" "文学,英文学" "大学教員" "ロンドン留学" "個人主義" "文学表現" --rpc-url 127.0.0.1:8549 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### 人格データの取得

```bash
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "getPersona(uint256)" 1 --rpc-url 127.0.0.1:8549
```

### ユーザーの人格 ID 一覧取得

```bash
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "getUserPersonaIds(address)" 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --rpc-url 127.0.0.1:8549
```

### 人格の基本情報のみ取得

```bash
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "getPersonaBasicInfo(uint256)" 1 --rpc-url 127.0.0.1:8549
```

## 基本的な使用方法

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
