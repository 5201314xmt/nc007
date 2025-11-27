#!/usr/bin/env bash
set -e

# --- 配置 ---
REPO_URL="https://github.com/5201314xmt/nc007.git"
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
if command -v apt-get >/dev/null 2>&1; then
    apt-get update -qq
    apt-get install -y -qq git curl build-essential
elif command -v yum >/dev/null 2>&1; then
    yum install -y git curl
else
    echo -e "${RED}不支持的系统包管理器，请手动安装 git 和 curl${NC}"
    exit 1
fi

# 3. 安装 Node.js (如果未安装)
if ! command -v node >/dev/null 2>&1; then
    echo -e "${YELLOW}>>> [2/6] 未检测到 Node.js，正在安装 v18.x...${NC}"
    if command -v apt-get >/dev/null 2>&1; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    elif command -v yum >/dev/null 2>&1; then
        curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
        yum install -y nodejs
    fi
else
    echo -e "${GREEN}>>> Node.js 已安装: $(node -v)${NC}"
fi

# 4. 安装 PM2 和 serve 全局工具
echo -e "${YELLOW}>>> [3/6] 安装进程管理工具 (PM2,
