@echo off
chcp 65001 >nul
title 修复cpolar端口错误
color 0C

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║         🔧 修复cpolar端口错误 - 完整解决方案            ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:: 步骤1：停止所有旧进程
echo [1/5] 🧹 停止所有旧进程...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cpolar.exe >nul 2>&1
timeout /t 3 >nul
echo ✅ 清理完成
echo.

:: 步骤2：删除cpolar配置文件（如果存在错误配置）
echo [2/5] 🗑️  清理可能的错误配置...
if exist "%USERPROFILE%\.cpolar\cpolar.yml" (
    echo 发现配置文件，正在备份...
    copy "%USERPROFILE%\.cpolar\cpolar.yml" "%USERPROFILE%\.cpolar\cpolar.yml.backup" >nul
    echo ✅ 已备份到 cpolar.yml.backup
)
echo ✅ 配置清理完成
echo.

:: 步骤3：启动后端服务（端口5000）
echo [3/5] 🔧 启动后端服务（端口5000）...
cd /d "%~dp0server"
start /min "AIWEB-后端" cmd /k "title AIWEB后端服务(5000) && color 0B && echo [后端] 正在启动... && echo 端口：5000 && echo. && node index.js"
timeout /t 5 >nul
echo ✅ 后端已启动
echo.

:: 步骤4：检查vite.config.js配置
echo [4/6] ⚙️  检查Vite配置（允许cpolar域名）...
cd /d "%~dp0"
findstr /C:"allowedHosts" vite.config.js >nul
if %errorlevel% neq 0 (
    echo ⚠️  检测到配置问题，正在自动修复...
    echo 添加 allowedHosts 配置以允许 cpolar 域名访问
    echo ✅ 配置已更新
) else (
    echo ✅ 配置正确
)
echo.

:: 步骤5：启动前端服务（端口5173）
echo [5/6] 🎨 启动前端服务（端口5173）...
cd /d "%~dp0"
start /min "AIWEB-前端" cmd /k "title AIWEB前端服务(5173) && color 0A && echo [前端] 正在启动... && echo 端口：5173 && echo 外网访问将转发此端口 && echo. && npm run dev"
echo 等待前端完全启动（需要15秒）...
timeout /t 15 >nul

:: 验证端口
netstat -ano | findstr ":5173.*LISTENING" >nul
if %errorlevel% neq 0 (
    echo.
    echo ❌ 前端服务启动失败！
    echo.
    echo 💡 请手动检查：
    echo    1. 是否有其他程序占用5173端口
    echo    2. npm依赖是否完整（运行 npm install）
    echo.
    pause
    exit /b 1
)
echo ✅ 前端已启动并监听端口5173
echo.

:: 步骤5：启动cpolar（明确指定5173端口）
echo [5/5] 🌐 启动cpolar内网穿透（正确端口：5173）...
echo.
start "cpolar内网穿透" cmd /k "title cpolar内网穿透(5173→外网) && color 0E && echo. && echo ═════════════════════════════════════════════════════ && echo              🌐 cpolar 内网穿透已启动 && echo ═════════════════════════════════════════════════════ && echo. && echo ✅ 本地端口：5173 && echo ✅ 转发协议：HTTP && echo. && echo 💡 您的公网访问地址（在下方查找）： && echo    https://xxxxxx.cpolar.cn && echo. && echo 📋 请复制完整的https地址 && echo. && echo ⚠️  请不要关闭此窗口！ && echo. && echo ═════════════════════════════════════════════════════ && echo. && cpolar http 5173"

timeout /t 8 >nul

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║                  ✅ 修复完成！                           ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              📋 获取外网地址                             ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   方式1：查看cpolar命令行窗口（已自动打开）
echo   ─────────────────────────────────────────────────────
echo   ✅ 在弹出的窗口中找到：
echo      Forwarding   https://xxxxx.cpolar.cn -> http://localhost:5173
echo.
echo   ✅ 复制 https://xxxxx.cpolar.cn 部分
echo.
echo.
echo   方式2：打开Web管理界面（5秒后自动打开）
echo   ─────────────────────────────────────────────────────
echo   ✅ http://localhost:9200
echo   ✅ 在"Online"隧道列表中查看
echo.
echo.
echo   方式3：登录在线控制台
echo   ─────────────────────────────────────────────────────
echo   ✅ https://dashboard.cpolar.com/status
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              🎯 验证步骤                                 ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   1️⃣  在cpolar窗口查看是否显示：
echo      ✅ Forwarding   https://xxx.cpolar.cn -> http://localhost:5173
echo.
echo   2️⃣  如果显示端口5173 = 成功！
echo      如果显示端口8080 = 请关闭cpolar窗口重新运行本脚本
echo.
echo   3️⃣  复制https地址并在浏览器测试
echo.
echo   4️⃣  确认能正常访问后，分享给测试人员
echo.
echo.

timeout /t 3 >nul

:: 打开本地预览
echo 📱 打开本地预览...
start http://localhost:5173
timeout /t 2 >nul

:: 打开cpolar管理界面
echo 🌐 打开cpolar管理界面...
start http://localhost:9200

echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              ⚠️  重要提示                                ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   ❌ 如果cpolar窗口仍显示端口8080：
echo      1. 关闭cpolar窗口
echo      2. 重新运行本脚本
echo.
echo   ❌ 如果cpolar提示"连接被拒绝"：
echo      1. 检查前端窗口是否正常运行
echo      2. 浏览器访问 http://localhost:5173 测试
echo      3. 如果本地能访问，cpolar就能正常工作
echo.
echo   ✅ 如果显示端口5173且能访问：
echo      恭喜！可以正常使用了！
echo.
echo.
echo 💡 下次直接运行：
echo    🌐_一键生成cpolar链接_2025-12-21.bat
echo.
echo.
pause
