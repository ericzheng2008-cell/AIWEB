@echo off
chcp 65001 >nul
title AIWEB异地访问启动器

echo ========================================
echo   AIWEB 异地访问启动器 v1.0
echo ========================================
echo.

:: 检查cpolar是否安装
where cpolar >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ 未检测到cpolar，请先安装
    echo.
    echo 安装步骤：
    echo 1. 访问：https://www.cpolar.com
    echo 2. 注册账号（免费）
    echo 3. 下载Windows客户端
    echo 4. 安装并认证Token
    echo.
    echo 安装后重新运行此脚本
    echo.
    pause
    start https://www.cpolar.com/download
    exit /b 1
)

:: 清理旧进程
echo [1/5] 清理旧进程...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cpolar.exe >nul 2>&1
timeout /t 2 >nul
echo ✅ 清理完成
echo.

:: 启动后端
echo [2/5] 启动后端服务（端口5000）...
cd /d %~dp0server
start /min "AIWEB-后端" cmd /k "node index.js"
timeout /t 5 >nul
echo ✅ 后端已启动
echo.

:: 启动前端
echo [3/5] 启动前端服务（端口3002）...
cd /d %~dp0
start /min "AIWEB-前端" cmd /k "npm run dev"
timeout /t 15 >nul
echo ✅ 前端已启动
echo.

:: 启动cpolar内网穿透
echo [4/5] 启动内网穿透...
start "cpolar穿透" cmd /k "cpolar http 3002"
timeout /t 5 >nul
echo ✅ 内网穿透已启动
echo.

:: 获取外网地址
echo [5/5] 获取访问地址...
echo.
echo ========================================
echo   📱 异地手机访问地址获取方式
echo ========================================
echo.
echo 🔹 方式1：查看cpolar窗口（最直接）
echo    窗口中显示的 https://xxx.cpolar.cn 地址
echo.
echo 🔹 方式2：访问Web管理界面（最方便）
echo    电脑浏览器打开：http://localhost:9200
echo    查看 "Online" 隧道的公网地址
echo.
echo 🔹 方式3：cpolar控制台
echo    访问：https://dashboard.cpolar.com/status
echo    查看在线隧道列表
echo.
echo ========================================
echo   💡 使用说明
echo ========================================
echo.
echo 1️⃣  获取上述任一方式的外网地址
echo 2️⃣  将地址发送给异地测试人员
echo 3️⃣  测试人员用手机浏览器直接打开
echo 4️⃣  支持4G/5G/WiFi任意网络
echo 5️⃣  无需在同一局域网
echo.
echo ========================================
echo   📋 分享给测试人员的信息
echo ========================================
echo.
echo AIWEB内测访问地址：
echo （从cpolar获取后填写）https://________.cpolar.cn
echo.
echo 适用设备：手机、电脑、平板
echo 适用网络：4G/5G/WiFi（任意网络）
echo.
echo 操作步骤：
echo 1. 打开手机浏览器（Chrome/Safari）
echo 2. 输入上述地址
echo 3. 等待10-20秒加载
echo 4. 开始测试
echo.
echo ========================================
echo   🔧 管理操作
echo ========================================
echo.
echo ▪ 查看日志：切换到对应的命令行窗口
echo ▪ 停止服务：关闭所有命令行窗口
echo ▪ 保持电脑开机状态
echo ▪ 保持网络连接
echo.
echo ========================================
echo   ⚡ 升级建议
echo ========================================
echo.
echo 免费版限制：
echo ❌ 域名每次启动变化（需重新分享地址）
echo ✅ 无限流量
echo ✅ 够用于临时测试
echo.
echo VIP版优势（¥10/月）：
echo ✅ 固定域名（永不变化）
echo ✅ 自定义子域名
echo ✅ 3条隧道
echo.
echo 升级地址：https://dashboard.cpolar.com/get-started
echo.
echo ========================================
echo.

:: 自动打开本地预览
echo 正在打开本地预览...
start http://localhost:3002
timeout /t 2 >nul

:: 打开cpolar管理界面
echo 正在打开cpolar管理界面（获取外网地址）...
timeout /t 1 >nul
start http://localhost:9200
echo.
echo ✅ 启动完成！
echo.
echo 💡 下一步：在自动打开的cpolar界面获取外网地址
echo.
pause
