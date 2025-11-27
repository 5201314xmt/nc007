#!/bin/bash
set -e

# --- 配置 ---
REPO_URL="https://github.com/5201314xmt/ncqb.git"
APP_DIR="/opt/ncqb"
APP_NAME="ncqb"
PORT="${PORT:-3000}" # 默认端口 3000，可通过 export PORT=8080 修改

# --- 颜色定义 ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}==============================================${NC}"
echo -e "${GREEN}   Netcup VPS Sentinel (NCQB) 一键部署脚本   ${NC}"
echo -e "${GREEN}==============================================${NC}"

# 1. 检查 Root 权限
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}错误: 请使用 root 权限运行此脚本 (sudo ./deploy.sh)${NC}"
  exit 1
fi

# 2. 安装基础系统依赖
echo -e "${YELLOW}>>> [1/6] 检测并安装系统依赖 (git, curl)...${NC}"
if command -v apt-get &> /dev/null; then
    apt-get update -qq
    apt-get install -y -qq git curl build-essential
elif command -v yum &> /dev/null; then
    yum install -y git curl
else
    echo -e "${RED}不支持的系统包管理器，请手动安装 git 和 curl${NC}"
    exit 1
fi

# 3. 安装 Node.js (如果未安装)
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}>>> [2/6] 未检测到 Node.js，正在安装 v18.x...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    if command -v apt-get &> /dev/null; then
        apt-get install -y nodejs
    elif command -v yum &> /dev/null; then
        yum install -y nodejs
    fi
else
    echo -e "${GREEN}>>> Node.js 已安装: $(node -v)${NC}"
fi

# 4. 安装 PM2 和 Serve 全局工具
echo -e "${YELLOW}>>> [3/6] 安装进程管理工具 (PM2, serve)...${NC}"
npm install -g pm2 serve

# 5. 拉取或更新代码
if [ -d "$APP_DIR" ]; then
    echo -e "${YELLOW}>>> [4/6] 目录已存在，正在更新代码...${NC}"
    cd "$APP_DIR"
    git reset --hard
    git pull
else
    echo -e "${YELLOW}>>> [4/6] 克隆代码仓库...${NC}"
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# 6. 安装依赖并构建
echo -e "${YELLOW}>>> [5/6] 安装项目依赖并构建...${NC}"
npm install
npm run build

# 7. 启动服务
echo -e "${YELLOW}>>> [6/6] 配置并启动服务...${NC}"

# 确定构建目录 (适配 Vite 或 Create-React-App)
if [ -d "dist" ]; then
    BUILD_DIR="dist"
elif [ -d "build" ]; then
    BUILD_DIR="build"
else
    echo -e "${RED}错误: 构建失败，未找到 dist 或 build 目录。${NC}"
    exit 1
fi

# 如果已存在同名进程，先删除
if pm2 list | grep -q "$APP_NAME"; then
    pm2 delete "$APP_NAME"
fi

# 使用 pm2 启动 serve
pm2 start serve --name "$APP_NAME" -- -s "$BUILD_DIR" -l "$PORT" --no-request-logging

# 保存 PM2 状态并设置开机自启
pm2 save
# 尝试生成开机自启命令 (可能会提示用户手动运行)
pm2 startup | tail -n 1 | bash > /dev/null 2>&1 || true

# 获取公网 IP (仅供参考)
PUBLIC_IP=$(curl -s ifconfig.me || echo "你的服务器IP")

echo -e "${GREEN}==============================================${NC}"
echo -e "${GREEN} 部署成功！ ${NC}"
echo -e "${GREEN} 访问地址: http://${PUBLIC_IP}:${PORT} ${NC}"
echo -e "${GREEN} 管理命令: pm2 status/log/restart ncqb ${NC}"
echo -e "${GREEN}==============================================${NC}"
