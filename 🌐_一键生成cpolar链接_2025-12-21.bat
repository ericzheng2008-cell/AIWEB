@echo off
chcp 65001 >nul
title cpolar内网穿透 - 一键生成访问链接
color 0A

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║         🌐 cpolar 一键生成访问链接 v1.0                 ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:: 步骤1：检查cpolar是否安装
echo [1/6] 🔍 检查cpolar安装状态...
where cpolar >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ 未检测到cpolar！
    echo.
    echo 📥 正在打开cpolar官网，请按以下步骤操作：
    echo.
    echo    1️⃣  注册cpolar账号（完全免费）
    echo    2️⃣  下载Windows客户端
    echo    3️⃣  安装并认证Token
    echo    4️⃣  安装完成后重新运行此脚本
    echo.
    echo 💡 官网地址：https://www.cpolar.com
    echo.
    timeout /t 3 >nul
    start https://www.cpolar.com/download
    pause
    exit /b 1
)
echo ✅ cpolar已安装
echo.

:: 步骤2：清理旧进程
echo [2/6] 🧹 清理旧进程...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cpolar.exe >nul 2>&1
timeout /t 2 >nul
echo ✅ 清理完成
echo.

:: 步骤3：启动后端服务
echo [3/6] 🔧 启动后端服务（端口5000）...
cd /d "%~dp0server"
start /min "AIWEB-后端" cmd /k "title AIWEB后端服务 && echo [后端] 正在启动... && node index.js"
timeout /t 5 >nul
echo ✅ 后端已启动
echo.

:: 步骤4：启动前端服务
echo [4/6] 🎨 启动前端服务（端口3002）...
cd /d "%~dp0"
start /min "AIWEB-前端" cmd /k "title AIWEB前端服务 && echo [前端] 正在启动... && npm run dev"
timeout /t 15 >nul
echo ✅ 前端已启动
echo.

:: 步骤5：启动cpolar内网穿透
echo [5/6] 🌐 启动cpolar内网穿透...
start "cpolar内网穿透" cmd /k "title cpolar内网穿透 && color 0E && echo. && echo ═════════════════════════════════════ && echo    cpolar 内网穿透已启动 && echo ═════════════════════════════════════ && echo. && echo 💡 请查看下方显示的公网地址 && echo    格式：https://xxxxx.cpolar.cn && echo. && echo ⚠️  请不要关闭此窗口！ && echo. && cpolar http 3002"
timeout /t 8 >nul
echo ✅ cpolar已启动
echo.

:: 步骤6：显示访问信息
echo [6/6] 📋 生成访问信息...
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║                  🎉 启动完成！                           ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              📱 获取访问链接的3种方式                    ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   方式1：查看cpolar命令行窗口（最快）
echo   ─────────────────────────────────────────────────────
echo   ✅ 在刚才自动弹出的"cpolar内网穿透"窗口中
echo   ✅ 找到类似这样的地址：https://xxxxx.cpolar.cn
echo   ✅ 这就是您的公网访问地址！
echo.
echo.
echo   方式2：打开cpolar Web管理界面（最方便）
echo   ─────────────────────────────────────────────────────
echo   ✅ 浏览器访问：http://localhost:9200
echo   ✅ 在"Online"隧道列表中查看公网地址
echo   ✅ 5秒后将自动打开...
echo.
echo.
echo   方式3：登录cpolar在线控制台（最稳定）
echo   ─────────────────────────────────────────────────────
echo   ✅ 访问：https://dashboard.cpolar.com/status
echo   ✅ 登录您的cpolar账号
echo   ✅ 查看在线隧道列表
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              💡 使用说明                                 ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   1️⃣  获取上述任意方式的外网地址
echo   2️⃣  将地址分享给测试人员（微信/邮件/QQ）
echo   3️⃣  测试人员直接用浏览器打开
echo   4️⃣  支持手机/电脑/平板访问
echo   5️⃣  支持4G/5G/WiFi任意网络
echo   6️⃣  无需在同一局域网！
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              📋 分享给测试人员的信息模板                 ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   AIWEB 内测访问地址：
echo   （请在cpolar窗口获取地址后填写）
echo   https://____________.cpolar.cn
echo   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo   适用设备：手机、电脑、平板
echo   适用网络：4G/5G/WiFi（任意网络，不限局域网）
echo   适用浏览器：Chrome、Safari、Edge等现代浏览器
echo.
echo   操作步骤：
echo   1. 打开浏览器（推荐Chrome或Safari）
echo   2. 输入上述地址
echo   3. 等待10-20秒加载
echo   4. 开始测试AIWEB平台
echo.
echo   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              ⚙️  管理操作                                ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   📊 查看服务日志：切换到对应的命令行窗口
echo   🛑 停止所有服务：关闭所有命令行窗口
echo   🔄 重启服务：关闭后重新运行本脚本
echo   ⚠️  保持电脑开机和网络连接
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              💎 cpolar版本说明                           ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   免费版限制：
echo   ❌ 每次启动域名会变化（需重新分享地址）
echo   ❌ 每4小时自动断开（需重启）
echo   ✅ 无限流量
echo   ✅ 足够临时测试使用
echo.
echo   VIP版优势（¥10/月起）：
echo   ✅ 固定域名（永不变化，一次分享终身有效）
echo   ✅ 自定义子域名
echo   ✅ 无时间限制
echo   ✅ 3-10条隧道
echo   ✅ 适合长期部署
echo.
echo   升级地址：https://dashboard.cpolar.com/get-started
echo.
echo.
echo ═══════════════════════════════════════════════════════════
echo   正在自动打开浏览器...
echo ═══════════════════════════════════════════════════════════
echo.

:: 等待2秒
timeout /t 2 >nul

:: 打开本地预览
echo 📱 打开本地预览：http://localhost:5173
start http://localhost:5173
timeout /t 2 >nul

:: 打开cpolar管理界面
echo 🌐 打开cpolar管理界面：http://localhost:9200
start http://localhost:9200

echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║                  ✅ 全部启动完成！                       ║
echo ║                                                           ║
echo ║     下一步：在cpolar管理界面获取公网访问地址             ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo.
echo 💡 温馨提示：
echo    - cpolar窗口已自动打开，请查看其中的https地址
echo    - 或在浏览器查看 http://localhost:9200 获取地址
echo    - 将获取的地址分享给任何人即可访问
echo.
echo.
pause
