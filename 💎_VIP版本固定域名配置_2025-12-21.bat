@echo off
chcp 65001 >nul
title cpolar VIP版本 - 固定域名配置向导
color 0D

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║         💎 cpolar VIP版本 - 固定域名配置向导            ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              🎉 恭喜您升级到VIP版本！                   ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   VIP版本的核心优势：
echo.
echo   ✅ 固定域名 - 永久不变，一次分享终身有效
echo   ✅ 自定义子域名 - 个性化品牌展示
echo   ✅ 无时间限制 - 7×24小时稳定运行
echo   ✅ 3-10条隧道 - 支持多个服务同时穿透
echo   ✅ 专线节点 - 更快的访问速度
echo   ✅ IP白名单 - 企业级安全控制
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              📋 配置流程（4个步骤）                      ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   步骤1：登录cpolar控制台创建保留域名
echo   步骤2：配置本地cpolar客户端
echo   步骤3：启动固定隧道
echo   步骤4：获取永久访问地址
echo.
echo.
pause
cls

:: 步骤1：创建保留域名
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║         步骤1：创建保留域名（固定子域名）                ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo.
echo   📝 操作指南：
echo.
echo   1️⃣  打开cpolar控制台（5秒后自动打开）：
echo      https://dashboard.cpolar.com/reserved
echo.
echo   2️⃣  点击「预留」按钮
echo.
echo   3️⃣  填写保留信息：
echo      ┌─────────────────────────────────────────┐
echo      │ 地区：    China VIP                     │
echo      │ 二级域名： aiweb-mingsheng  (示例)      │
echo      │ 描述：    AIWEB企业内测平台             │
echo      │ 类型：    http                          │
echo      └─────────────────────────────────────────┘
echo.
echo   4️⃣  点击「保留」按钮
echo.
echo   💡 二级域名建议：
echo      • aiweb-company（公司名称）
echo      • aiweb-test（测试环境）
echo      • mingsheng-ai（品牌名称）
echo      • mycompany-demo（演示环境）
echo.
echo   ⚠️  注意：
echo      • 二级域名一旦创建不可修改
echo      • 建议使用有意义的名称
echo      • 可以创建多个保留域名
echo.
echo.
echo   按任意键打开cpolar控制台...
pause >nul

:: 打开控制台
start https://dashboard.cpolar.com/reserved

echo.
echo   ✅ 控制台已打开
echo.
echo   💡 完成后请回到此窗口继续...
echo.
echo   您创建的二级域名是什么？
set /p SUBDOMAIN=   请输入（例如：aiweb-test）: 

echo.
echo   ✅ 记录成功：%SUBDOMAIN%
echo.
echo   您的固定访问地址将是：
echo   🌐 https://%SUBDOMAIN%.cpolar.cn
echo.
echo.
pause
cls

:: 步骤2：配置本地客户端
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║         步骤2：配置本地cpolar客户端                      ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo.
echo   📝 正在自动创建配置文件...
echo.

:: 创建配置文件目录
if not exist "%USERPROFILE%\.cpolar" mkdir "%USERPROFILE%\.cpolar"

:: 备份旧配置（如果存在）
if exist "%USERPROFILE%\.cpolar\cpolar.yml" (
    echo   ⚠️  发现已有配置文件，正在备份...
    copy "%USERPROFILE%\.cpolar\cpolar.yml" "%USERPROFILE%\.cpolar\cpolar.yml.backup_%date:~0,4%%date:~5,2%%date:~8,2%" >nul
    echo   ✅ 已备份到：cpolar.yml.backup_%date:~0,4%%date:~5,2%%date:~8,2%
    echo.
)

:: 生成新配置文件
echo   📄 创建配置文件：%USERPROFILE%\.cpolar\cpolar.yml
echo.

(
echo version: "2"
echo authtoken: YOUR_TOKEN_HERE
echo.
echo tunnels:
echo   aiweb-frontend:
echo     proto: http
echo     addr: 5173
echo     region: cn_vip
echo     subdomain: %SUBDOMAIN%
echo     inspect: true
echo     bind_tls: true
echo.
echo   aiweb-backend:
echo     proto: http
echo     addr: 5000
echo     region: cn_vip
echo     subdomain: %SUBDOMAIN%-api
echo     inspect: true
echo     bind_tls: true
) > "%USERPROFILE%\.cpolar\cpolar.yml"

echo   ✅ 配置文件已创建！
echo.
echo   📋 配置内容：
echo.
echo   ┌─────────────────────────────────────────────────────┐
echo   │ 前端隧道：                                          │
echo   │   名称：aiweb-frontend                              │
echo   │   本地端口：5173                                     │
echo   │   访问地址：https://%SUBDOMAIN%.cpolar.cn           │
echo   │                                                     │
echo   │ 后端隧道：                                          │
echo   │   名称：aiweb-backend                               │
echo   │   本地端口：5000                                     │
echo   │   访问地址：https://%SUBDOMAIN%-api.cpolar.cn       │
echo   └─────────────────────────────────────────────────────┘
echo.
echo.
echo   ⚠️  重要：需要设置您的authtoken
echo.
echo   1️⃣  打开cpolar控制台（5秒后自动打开）：
echo      https://dashboard.cpolar.com/get-started
echo.
echo   2️⃣  复制「Your Authtoken」
echo.
echo   3️⃣  运行命令：
echo      cpolar authtoken YOUR_COPIED_TOKEN
echo.
pause

:: 打开authtoken页面
start https://dashboard.cpolar.com/get-started

echo.
echo   ✅ authtoken页面已打开
echo.
echo   完成authtoken设置后，按任意键继续...
pause >nul
cls

:: 步骤3：启动服务
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║         步骤3：启动AIWEB服务和固定隧道                   ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo.
echo   正在启动服务，请稍候...
echo.

:: 清理旧进程
echo   [1/4] 🧹 清理旧进程...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cpolar.exe >nul 2>&1
timeout /t 3 >nul
echo   ✅ 清理完成
echo.

:: 启动后端
echo   [2/4] 🔧 启动后端服务（端口5000）...
cd /d "%~dp0server"
start /min "AIWEB-后端" cmd /k "title AIWEB后端服务(5000) && color 0B && echo [后端VIP] 端口：5000 && echo 固定地址：https://%SUBDOMAIN%-api.cpolar.cn && echo. && node index.js"
timeout /t 5 >nul
echo   ✅ 后端已启动
echo.

:: 启动前端
echo   [3/4] 🎨 启动前端服务（端口5173）...
cd /d "%~dp0"
start /min "AIWEB-前端" cmd /k "title AIWEB前端服务(5173) && color 0A && echo [前端VIP] 端口：5173 && echo 固定地址：https://%SUBDOMAIN%.cpolar.cn && echo. && npm run dev"
timeout /t 15 >nul

:: 验证前端端口
netstat -ano | findstr ":5173.*LISTENING" >nul
if %errorlevel% neq 0 (
    echo   ❌ 前端服务启动失败！
    echo.
    echo   💡 请检查：
    echo      1. 端口5173是否被占用
    echo      2. npm依赖是否完整
    echo.
    pause
    exit /b 1
)
echo   ✅ 前端已启动
echo.

:: 启动cpolar固定隧道
echo   [4/4] 💎 启动VIP固定隧道...
echo.
start "cpolar-VIP固定隧道" cmd /k "title cpolar VIP固定隧道 && color 0D && echo. && echo ═════════════════════════════════════════════════════ && echo              💎 cpolar VIP 固定隧道已启动 && echo ═════════════════════════════════════════════════════ && echo. && echo ✅ 您的永久访问地址： && echo. && echo    🌐 前端：https://%SUBDOMAIN%.cpolar.cn && echo    🌐 后端：https://%SUBDOMAIN%-api.cpolar.cn && echo. && echo 📋 此地址永久固定，可放心分享！ && echo. && echo ⚠️  请不要关闭此窗口！ && echo. && echo ═════════════════════════════════════════════════════ && echo. && cpolar start-all"

timeout /t 8 >nul
echo   ✅ VIP隧道已启动
echo.
echo.
cls

:: 步骤4：完成
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              🎉 配置完成！VIP服务已启动                 ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              🌐 您的永久访问地址                         ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   前端（AIWEB主页）：
echo   🌐 https://%SUBDOMAIN%.cpolar.cn
echo.
echo   后端（API接口）：
echo   🌐 https://%SUBDOMAIN%-api.cpolar.cn
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              ✨ VIP版本优势                              ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   ✅ 域名永久固定 - 一次分享，终身有效
echo   ✅ 无时间限制 - 7×24小时稳定运行
echo   ✅ 自定义品牌 - 专属子域名展示
echo   ✅ 高速专线 - VIP节点访问更快
echo   ✅ 多条隧道 - 前后端同时穿透
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              📱 分享给他人的信息模板                     ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   AIWEB 企业内测访问地址（永久固定）
echo.
echo   🌐 访问地址：
echo   https://%SUBDOMAIN%.cpolar.cn
echo.
echo   📱 适用设备：手机、电脑、平板
echo   🌍 适用网络：4G/5G/WiFi（任意网络）
echo   ⏰ 有效期限：永久有效
echo.
echo   📖 操作步骤：
echo   1. 打开浏览器（推荐Chrome或Safari）
echo   2. 输入上述地址
echo   3. 开始测试AIWEB平台
echo.
echo   💡 提示：
echo   • 此地址永久固定，可添加到收藏夹
echo   • 支持7×24小时访问
echo   • 访问速度更快更稳定
echo   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              ⚙️  管理操作                                ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   📊 查看隧道状态：
echo      • Web控制台：http://localhost:9200
echo      • 在线控制台：https://dashboard.cpolar.com/status
echo.
echo   🛑 停止服务：
echo      • 关闭所有命令行窗口
echo.
echo   🔄 重启服务：
echo      • 重新运行本脚本
echo      • 或运行：💎_VIP版本快速启动_2025-12-21.bat
echo.
echo   🔧 修改配置：
echo      • 编辑：%USERPROFILE%\.cpolar\cpolar.yml
echo.
echo.
echo ═══════════════════════════════════════════════════════════
echo   正在打开浏览器...
echo ═══════════════════════════════════════════════════════════
echo.

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
echo ║              ✅ 全部完成！VIP服务运行中                  ║
echo ║                                                           ║
echo ║     您的永久地址：https://%SUBDOMAIN%.cpolar.cn          ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo.
echo 💡 下次启动：
echo    运行「💎_VIP版本快速启动_2025-12-21.bat」即可
echo.
echo.
pause
