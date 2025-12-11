#!/bin/bash

# 部署脚本 - 用于服务器自动化部署

set -e

echo "🚀 开始部署明升伟业官网..."

# 1. 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 2. 安装依赖
echo "📦 安装依赖..."
npm install

# 3. 构建前端
echo "🔨 构建前端..."
npm run build

# 4. 停止旧容器
echo "🛑 停止旧容器..."
docker-compose down

# 5. 构建并启动新容器
echo "🐳 构建并启动新容器..."
docker-compose up -d --build

# 6. 清理旧镜像
echo "🧹 清理旧镜像..."
docker image prune -f

echo "✅ 部署完成！"
echo "🌐 访问地址: http://$(curl -s ifconfig.me)"
