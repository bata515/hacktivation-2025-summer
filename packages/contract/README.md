## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

# 実行手順

## 1. Anvilローカルチェーンの起動

```bash
anvil -p 8550
# user05 = 8545+5=8550
```

## 2. 別ターミナルでコントラクトの準備とデプロイ

```bash
cd hacktivation-2025-summer/packages/contract
forge install
forge script script/PersonaRegistry.s.sol --broadcast --rpc-url 127.0.0.1:8550 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

デプロイ後、コントラクトアドレスをメモしてください（例: 0x5FbDB2315678afecb367f032d93F642f64180aa3）

## 3. Cast を使用したコントラクトとの対話

### 総人格数の確認
```bash
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "getTotalPersonaCount()(uint256)" --rpc-url 127.0.0.1:8550
```

### 人格の作成
```bash
cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "createPersona(string,uint8,string,string,string,string,string,string,string,string,string,string)" "夏目漱石" 49 "小説家" "明治の文豪" "内省的,繊細" "文学的" "丁寧語" "文学,英文学" "大学教員" "ロンドン留学" "個人主義" "文学表現" --rpc-url 127.0.0.1:8550 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### 人格データの取得
```bash
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "getPersona(uint256)" 1 --rpc-url 127.0.0.1:8550
```

### ユーザーの人格ID一覧取得
```bash
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "getUserPersonaIds(address)" 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --rpc-url 127.0.0.1:8550
```

### 人格の基本情報のみ取得
```bash
cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "getPersonaBasicInfo(uint256)" 1 --rpc-url 127.0.0.1:8550
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
