# Netcup VPS Sentinel (NCQB)

Netcup VPS 流量限速监控与自动化流控系统。

## 🚀 一键安装 (Root)

无需手动配置环境，脚本自动处理 Node.js、Git、依赖安装与后台运行。

```bash
wget -O deploy.sh https://raw.githubusercontent.com/5201314xmt/ncqb/main/deploy.sh && chmod +x deploy.sh && ./deploy.sh
```

**脚本功能：**
*   自动安装 Node.js 环境
*   自动拉取/更新代码
*   自动编译构建
*   使用 PM2 启动服务 (端口 3000) 并设置开机自启

## 常用管理命令

*   **查看状态**: `pm2 status ncqb`
*   **查看日志**: `pm2 logs ncqb`
*   **重启服务**: `pm2 restart ncqb`
*   **停止服务**: `pm2 stop ncqb`

## 功能特性

*   **SCP 监控**: 对接 Netcup API 监控 VPS 限速状态。
*   **流控联动**: 限速时自动暂停 QB 下载，恢复时自动开启。
*   **流量统计**: 记录并可视化每日上传/下载历史数据。
*   **Telegram 通知**: 状态变更实时推送。
