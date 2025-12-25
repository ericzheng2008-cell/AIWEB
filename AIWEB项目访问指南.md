# AIWEB1 项目访问指南

## 🎯 问题说明

您在手机浏览器访问AIWEB网页时，出现404错误提示 `msaiweb.vip.cpolar.cn`

## 📊 项目信息

**项目位置:** `C:\Users\EricZ\CodeBuddy\AIWEB1`

**端口配置:**
- 前端: 5173
- 后端API: 5000

## ✅ 解决方案

### 方式1：使用一键启动脚本（推荐）

双击运行：`⚡_一键启动AIWEB_2025-12-22.bat`

该脚本会自动：
1. 启动后端服务器（端口5000）
2. 启动前端服务器（端口5173）  
3. 自动打开浏览器

### 方式2：手动启动

#### 步骤1：启动后端
```bash
cd C:\Users\EricZ\CodeBuddy\AIWEB1\server
node index.js
```

#### 步骤2：启动前端（新窗口）
```bash
cd C:\Users\EricZ\CodeBuddy\AIWEB1
npm run dev
```

## 📱 手机访问

### 前提条件
- 手机和电脑在同一WiFi网络

### 访问地址
```
http://192.168.31.103:5173
```

## 🔧 如果还是404

### 检查环境变量
查看 `.env.development` 文件：
```bash
VITE_API_BASE_URL=http://localhost:5000
```

### 确认服务器状态
```bash
# 检查端口占用
netstat -ano | findstr "5173"
netstat -ano | findstr "5000"
```

### 清除浏览器缓存
- 手机浏览器：设置 → 清除缓存
- 强制刷新：下拉刷新页面

## 🌐 cpolar.cn 说明

`msaiweb.vip.cpolar.cn` 是之前使用的内网穿透域名，已经失效。

现在有两个选择：

### 选项A：局域网访问（无需配置）
- 手机和电脑同一WiFi
- 访问 `http://192.168.31.103:5173`

### 选项B：重新配置cpolar
如需外网访问，需要重新启动cpolar：
```bash
# 安装cpolar后
cpolar http 5173
```

## 📝 注意事项

1. **不要关闭命令窗口**
   - 需要保持前端和后端两个窗口运行

2. **防火墙设置**
   - 可能需要允许端口5173和5000

3. **多个项目区分**
   - 明升智行Work(小程序): http://192.168.31.103:3000
   - AIWEB1(网页): http://192.168.31.103:5173

## 🚀 快速命令

### 查看电脑IP
```bash
ipconfig | findstr IPv4
```

### 停止服务器
```bash
# 停止所有node进程
taskkill /F /IM node.exe
```

### 重新启动
```bash
cd C:\Users\EricZ\CodeBuddy\AIWEB1
⚡_一键启动AIWEB_2025-12-22.bat
```

---
**现在正在启动AIWEB1服务器，请稍候...**
