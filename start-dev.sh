#!/bin/bash

# 開発環境を起動するスクリプト

set -e

echo "🚀 Starting Local Development Environment"
echo "======================================="

# 既存のコンテナをクリーンアップ
echo "🧹 Cleaning up existing containers..."
docker stop anvil-dev 2>/dev/null || true
docker rm anvil-dev 2>/dev/null || true

# Anvilを起動
echo "🔗 Starting Anvil..."
docker run -d --name anvil-dev \
  -p 8545:8545 \
  -e ANVIL_IP_ADDR=0.0.0.0 \
  -e FOUNDRY_DISABLE_NIGHTLY_WARNING=true \
  ghcr.io/foundry-rs/foundry:latest \
  anvil --port 8545 --chain-id 31337 --accounts 10 --balance 10000

# 少し待機
sleep 5

# 接続テスト
echo "🔍 Testing Anvil connection..."
if curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8545 | grep -q result; then
    echo "✅ Anvil is running!"

    # コントラクトをデプロイ
    echo "📄 Deploying contracts..."
    cd packages/contract

    # Foundryがインストールされていない場合はインストール
    if ! command -v forge &> /dev/null; then
        echo "🔧 Installing Foundry..."
        curl -L https://foundry.paradigm.xyz | bash
        source ~/.zshenv || source ~/.bashrc
        foundryup
    fi

    # forge-stdがない場合はインストール
    if [ ! -d "lib/forge-std" ]; then
        echo "📚 Installing forge-std..."
        forge install foundry-rs/forge-std
    fi

    # コントラクトをデプロイ
    echo "🚀 Deploying PersonaRegistry..."
    forge script script/PersonaRegistry.s.sol:PersonaRegistryScript \
        --rpc-url http://localhost:8545 \
        --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
        --broadcast \
        --via-ir

    cd ../..

    # フロントエンドを起動
    echo "🌐 Starting frontend..."
    cd packages/frontend
    npm install
    npm run dev &
    FRONTEND_PID=$!
    cd ../..

    echo ""
    echo "🎉 Development environment is ready!"
    echo "📍 Services:"
    echo "  - Anvil (Blockchain): http://localhost:8545"
    echo "  - Frontend: http://localhost:3000"
    echo "  - PersonaRegistry Contract: Deployed and ready"
    echo ""
    echo "🛑 To stop:"
    echo "  docker stop anvil-dev && docker rm anvil-dev"
    echo "  kill $FRONTEND_PID"
else
    echo "❌ Failed to connect to Anvil"
    docker stop anvil-dev && docker rm anvil-dev
    exit 1
fi