@echo off
chcp 65001 >nul
title 一键修复 cpolar VIP 404问题
color 0A

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║         🔧 一键修复 cpolar VIP 404问题                   ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

echo 💡 此脚本将自动完成以下操作：
echo    1. 停止所有旧服务
echo    2. 清理端口占用
echo    3. 启动后端服务 (端口5000)
echo    4. 启动前端服务 (端口5173)
echo    5. 启动cpolar VIP隧道
echo    6. 验证服务状态
echo.
echo 按任意键开始修复...
pause >nul
echo.

:: 步骤1: 停止旧服务
echo [1/7] 🛑 停止所有旧服务...
echo ─────────────────────────────────────────────────────
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cpolar.exe >nul 2>&1
timeout /t 3 >nul
echo ✅ 旧服务已停止
echo.

:: 步骤2: 清理端口
echo [2/7] 🧹 清理端口占用...
echo ─────────────────────────────────────────────────────
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173.*LISTENING"') do (
    echo 结束进程 %%a (端口5173)
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000.*LISTENING"') do (
    echo 结束进程 %%a (端口5000)
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 >nul
echo ✅ 端口清理完成
echo.

:: 步骤3: 检查配置文件
echo [3/7] 📋 检查VIP配置文件...
echo ─────────────────────────────────────────────────────
set CONFIG_FILE=%USERPROFILE%\.cpolar\cpolar.yml
if not exist "%CONFIG_FILE%" (
    echo ❌ VIP配置文件不存在！
    echo.
    echo 💡 请先配置VIP：
    echo    运行: 💎_VIP版本固定域名配置_2025-12-21.bat
    echo.
    pause
    exit /b 1
)
echo ✅ 配置文件存在
echo.

:: 步骤4: 启动后端服务
echo [4/7] 🔧 启动后端服务 (端口5000)...
echo ─────────────────────────────────────────────────────
cd /d "%~dp0server"
start /min "AIWEB-后端-VIP" cmd /k "title AIWEB后端(5000)-VIP修复 && color 0B && echo [后端] 端口5000启动中... && node index.js"
cd /d "%~dp0"
timeout /t 5 >nul

:: 验证后端
netstat -ano | findstr ":5000.*LISTENING" >nul
if %errorlevel% neq 0 (
    echo ❌ 后端启动失败！
    echo.
    echo 💡 请检查：
    echo    1. server/index.js 文件是否存在
    echo    2. 端口5000是否被其他程序占用
    echo    3. 查看后端窗口的错误信息
    echo.
    pause
    exit /b 1
)
echo ✅ 后端已启动 (端口5000)
echo.

:: 步骤5: 启动前端服务
echo [5/7] 🎨 启动前端服务 (端口5173)...
echo ─────────────────────────────────────────────────────
start /min "AIWEB-前端-VIP" cmd /k "title AIWEB前端(5173)-VIP修复 && color 0A && echo [前端] 端口5173启动中... && echo. && echo ⏳ Vite启动需要10-15秒，请耐心等待... && echo. && npm run dev"
timeout /t 15 >nul

:: 验证前端
netstat -ano | findstr ":5173.*LISTENING" >nul
if %errorlevel% neq 0 (
    echo ⚠️  前端可能还在启动中...
    echo    继续等待5秒...
    timeout /t 5 >nul
    
    netstat -ano | findstr ":5173.*LISTENING" >nul
    if %errorlevel% neq 0 (
        echo ❌ 前端启动失败！
        echo.
        echo 💡 请检查：
        echo    1. 查看前端窗口的错误信息
        echo    2. 确认 npm install 已完成
        echo    3. 检查 vite.config.js 配置
        echo.
        pause
        exit /b 1
    )
)
echo ✅ 前端已启动 (端口5173)
echo.

:: 步骤6: 启动cpolar VIP隧道
echo [6/7] 💎 启动cpolar VIP隧道...
echo ─────────────────────────────────────────────────────
start "cpolar-VIP-修复" cmd /k "title cpolar VIP隧道(修复中) && color 0D && echo. && echo ═════════════════════════════════════════════════════ && echo              💎 cpolar VIP 隧道启动中 && echo ═════════════════════════════════════════════════════ && echo. && echo ✅ 正在连接VIP节点... && echo. && echo 💡 您的固定访问地址将在下方显示 && echo    格式: https://您的子域名.cpolar.cn && echo. && echo ⚠️  如果长时间没有显示地址，请检查： && echo    1. VIP是否已开通 && echo    2. authtoken是否正确 && echo    3. 保留域名是否已创建 && echo. && echo ⚠️  请不要关闭此窗口！ && echo. && echo ═════════════════════════════════════════════════════ && echo. && cpolar start-all"
timeout /t 8 >nul

:: 验证cpolar
tasklist | findstr /i "cpolar.exe" >nul
if %errorlevel% neq 0 (
    echo ❌ cpolar启动失败！
    echo.
    echo 💡 请检查：
    echo    1. cpolar是否已安装
    echo    2. authtoken是否已配置
    echo    3. 查看cpolar窗口的错误信息
    echo.
    pause
    exit /b 1
)
echo ✅ cpolar VIP隧道已启动
echo.

:: 步骤7: 验证服务状态
echo [7/7] 🔍 验证所有服务状态...
echo ─────────────────────────────────────────────────────
echo.

echo 📊 端口监听状态:
netstat -ano | findstr ":5000.*LISTENING" && echo    ✅ 后端 5000
netstat -ano | findstr ":5173.*LISTENING" && echo    ✅ 前端 5173
netstat -ano | findstr ":9200.*LISTENING" && echo    ✅ cpolar管理界面 9200
echo.

echo 📊 进程运行状态:
tasklist | findstr /i "node.exe" >nul && echo    ✅ Node.js进程
tasklist | findstr /i "cpolar.exe" >nul && echo    ✅ cpolar进程
echo.

:: 测试本地访问
echo 📊 本地访问测试:
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:5173' -TimeoutSec 5 -UseBasicParsing; Write-Host '   ✅ 本地5173可访问 (HTTP ' $r.StatusCode ')' } catch { Write-Host '   ❌ 本地5173不可访问' -ForegroundColor Red }"
echo.

echo.
echo ═════════════════════════════════════════════════════
echo              ✅ 修复完成！
echo ═════════════════════════════════════════════════════
echo.

echo 🎯 下一步操作：
echo ─────────────────────────────────────────────────────
echo.
echo 1️⃣  查看cpolar窗口
echo    → 在"cpolar-VIP-修复"窗口中找到您的固定地址
echo    → 格式: https://您的子域名.cpolar.cn
echo.
echo 2️⃣  或打开cpolar管理界面
echo    → 访问: http://localhost:9200
echo    → 在"Online"列表中查看Forwarding地址
echo.
echo 3️⃣  测试访问
echo    → 用浏览器打开上述地址
echo    → 应该能看到AIWEB首页
echo.
echo 4️⃣  如果仍然404
echo    → 检查cpolar窗口是否显示"online"
echo    → 确认转发端口是5173不是3002
echo    → 运行诊断工具: 🔧_诊断cpolar_VIP_404问题_2025-12-23.bat
echo.

echo ═════════════════════════════════════════════════════
echo              💡 常见404原因
echo ═════════════════════════════════════════════════════
echo.
echo ❌ 原因1: 端口不匹配
echo    → cpolar转发3002但前端在5173
echo    → 解决: 确保配置文件中addr: 5173
echo.
echo ❌ 原因2: 前端未完全启动
echo    → Vite需要10-20秒启动
echo    → 解决: 多等待一会儿再访问
echo.
echo ❌ 原因3: VIP域名未配置
echo    → 未创建保留域名
echo    → 解决: 访问 https://dashboard.cpolar.com/reserved 创建
echo.
echo ❌ 原因4: authtoken错误
echo    → VIP token与免费token不同
echo    → 解决: 重新获取并配置VIP token
echo.

echo.
echo 正在打开cpolar管理界面和本地预览...
timeout /t 2 >nul

start http://localhost:9200
timeout /t 1 >nul
start http://localhost:5173

echo.
echo.
echo 💎 VIP版本优势提醒：
echo    ✅ 固定域名永不改变
echo    ✅ 7×24小时稳定运行  
echo    ✅ 更快的访问速度
echo.
echo 📱 分享地址模板：
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo AIWEB访问地址（永久固定）
echo https://您的子域名.cpolar.cn
echo 
echo 适用设备：手机/电脑/平板
echo 适用网络：4G/5G/WiFi
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo.
pause
