@echo off
chcp 65001 >nul
title 🔍 诊断cpolar手机端404问题

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         🔍 诊断cpolar手机端404问题 - 完整检查             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM 检查1: 前端服务器是否运行
echo 【检查1/5】前端服务器状态...
echo ════════════════════════════════════════════════════════════
netstat -ano | findstr ":5173" >nul 2>&1
if %errorlevel%==0 (
    echo ✅ 前端服务器正在运行 (端口5173)
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do set PID=%%a
    echo    进程ID: !PID!
) else (
    echo ❌ 前端服务器未运行！
    echo    💡 请先启动前端服务器
    goto show_solution
)
echo.

REM 检查2: cpolar是否运行
echo 【检查2/5】cpolar服务状态...
echo ════════════════════════════════════════════════════════════
tasklist | findstr "cpolar.exe" >nul 2>&1
if %errorlevel%==0 (
    echo ✅ cpolar正在运行
) else (
    echo ❌ cpolar未运行！
    echo    💡 请先启动cpolar
    goto show_solution
)
echo.

REM 检查3: 路由模式
echo 【检查3/5】路由模式检查...
echo ════════════════════════════════════════════════════════════
findstr "createWebHashHistory" "src\router\index.js" >nul 2>&1
if %errorlevel%==0 (
    echo ✅ 使用Hash模式 (正确配置)
) else (
    findstr "createWebHistory" "src\router\index.js" >nul 2>&1
    if %errorlevel%==0 (
        echo ❌ 使用History模式 (这是问题根源!)
        echo    💡 需要切换到Hash模式
        goto show_solution
    )
)
echo.

REM 检查4: 防火墙设置
echo 【检查4/5】防火墙规则检查...
echo ════════════════════════════════════════════════════════════
netsh advfirewall firewall show rule name="Node.js Server - Port 5173" >nul 2>&1
if %errorlevel%==0 (
    echo ✅ 防火墙规则已设置
) else (
    echo ⚠️  未找到防火墙规则
    echo    💡 可能需要添加防火墙规则
)
echo.

REM 检查5: 网络监听
echo 【检查5/5】网络监听地址检查...
echo ════════════════════════════════════════════════════════════
netstat -ano | findstr ":5173" | findstr "0.0.0.0" >nul 2>&1
if %errorlevel%==0 (
    echo ✅ 监听所有网络接口 (0.0.0.0:5173)
) else (
    netstat -ano | findstr ":5173" | findstr "127.0.0.1" >nul 2>&1
    if %errorlevel%==0 (
        echo ❌ 仅监听本地 (127.0.0.1:5173)
        echo    💡 这会导致cpolar无法访问
        goto show_solution
    )
)
echo.

echo ════════════════════════════════════════════════════════════
echo 🎉 基础检查完成！
echo.

REM 获取cpolar链接
echo 【获取cpolar链接】
echo ════════════════════════════════════════════════════════════
echo 正在获取cpolar公网地址...
echo.

REM 尝试从cpolar API获取
curl -s http://127.0.0.1:4040/api/tunnels > temp_cpolar.json 2>nul
if exist temp_cpolar.json (
    for /f "delims=" %%i in ('powershell -Command "(Get-Content temp_cpolar.json | ConvertFrom-Json).tunnels[0].public_url"') do set CPOLAR_URL=%%i
    if defined CPOLAR_URL (
        echo ✅ cpolar公网地址: !CPOLAR_URL!
        echo.
        echo 📱 请在手机浏览器访问:
        echo    !CPOLAR_URL!/#/
        echo.
        echo 注意: URL中必须包含 /#/ 符号
    ) else (
        echo ⚠️  无法自动获取cpolar地址
        echo    请手动访问: https://dashboard.cpolar.com/status
    )
    del temp_cpolar.json
) else (
    echo ⚠️  cpolar API不可用
    echo    请访问 https://dashboard.cpolar.com/status 查看链接
)
echo.

echo ════════════════════════════════════════════════════════════
echo 🧪 建议的测试步骤:
echo ════════════════════════════════════════════════════════════
echo.
echo 1. 在电脑浏览器测试:
echo    - 访问: http://localhost:5173/#/
echo    - 应该看到首页
echo.
echo 2. 测试Hash模式:
echo    - 访问: http://localhost:5173/#/products
echo    - 刷新页面,应该正常显示
echo.
echo 3. 在手机浏览器测试cpolar:
echo    - 获取cpolar链接 (如: https://xxx.cpolar.cn)
echo    - 访问: https://xxx.cpolar.cn/#/
echo    - 注意URL中必须有 /#/ 符号
echo.
echo 4. 测试手机端Hash路由:
echo    - 访问: https://xxx.cpolar.cn/#/products
echo    - 刷新页面,应该正常显示
echo.
echo ════════════════════════════════════════════════════════════
echo.

:check_issues
echo 请选择操作:
echo.
echo   [1] 清除缓存并重启服务器
echo   [2] 重新生成cpolar链接
echo   [3] 配置防火墙规则
echo   [4] 手动测试连接
echo   [5] 查看详细解决方案
echo   [0] 退出
echo.
set /p choice=请输入选项 (0-5): 

if "%choice%"=="1" goto restart_server
if "%choice%"=="2" goto regenerate_cpolar
if "%choice%"=="3" goto setup_firewall
if "%choice%"=="4" goto manual_test
if "%choice%"=="5" goto show_solution
if "%choice%"=="0" goto end

goto check_issues

:restart_server
echo.
echo ⏳ 正在清除缓存并重启服务器...
echo.

REM 停止所有相关进程
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cpolar.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM 清除Node缓存
if exist "node_modules\.vite" (
    rd /s /q "node_modules\.vite"
    echo ✅ 已清除Vite缓存
)

REM 启动前端
start "AIWEB前端" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 3 /nobreak >nul

REM 启动cpolar
start "cpolar" cmd /k "cpolar http 5173"

echo.
echo ✅ 服务器重启完成！
echo.
echo 📝 请等待10秒后测试:
echo    1. 访问 https://dashboard.cpolar.com/status 获取新链接
echo    2. 在手机浏览器打开 https://xxx.cpolar.cn/#/
echo.
pause
goto end

:regenerate_cpolar
echo.
echo ⏳ 正在重新生成cpolar链接...
echo.

REM 停止cpolar
taskkill /F /IM cpolar.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM 启动cpolar
start "cpolar" cmd /k "cpolar http 5173"

echo.
echo ✅ cpolar已重新启动！
echo.
echo 📝 获取新链接:
echo    访问: https://dashboard.cpolar.com/status
echo.
timeout /t 3 /nobreak >nul
start https://dashboard.cpolar.com/status
pause
goto end

:setup_firewall
echo.
echo ⏳ 正在配置防火墙规则...
echo ════════════════════════════════════════════════════════════
echo.
echo 🔐 需要管理员权限
echo.

REM 检查管理员权限
net session >nul 2>&1
if %errorlevel%==0 (
    echo ✅ 已获得管理员权限
    echo.
    
    REM 添加入站规则
    netsh advfirewall firewall add rule name="Node.js Server - Port 5173" dir=in action=allow protocol=TCP localport=5173
    
    REM 添加出站规则
    netsh advfirewall firewall add rule name="Node.js Server - Port 5173" dir=out action=allow protocol=TCP localport=5173
    
    echo ✅ 防火墙规则已添加
) else (
    echo ❌ 需要管理员权限！
    echo.
    echo 💡 请右键点击此文件，选择"以管理员身份运行"
)
echo.
pause
goto end

:manual_test
echo.
echo 🧪 手动测试连接
echo ════════════════════════════════════════════════════════════
echo.
echo 1. 打开电脑浏览器
start http://localhost:5173/#/
echo    ✅ 已打开: http://localhost:5173/#/
echo.

timeout /t 2 /nobreak >nul

echo 2. 打开cpolar控制面板
start https://dashboard.cpolar.com/status
echo    ✅ 已打开: https://dashboard.cpolar.com/status
echo.

echo 3. 手机测试步骤:
echo    - 在cpolar控制面板复制链接
echo    - 在手机浏览器打开 https://xxx.cpolar.cn/#/
echo    - 注意: URL中必须包含 /#/ 符号
echo.
pause
goto end

:show_solution
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              📖 cpolar手机端404 - 解决方案                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🔍 常见问题与解决方案:
echo ════════════════════════════════════════════════════════════
echo.

echo 【问题1】访问 https://xxx.cpolar.cn/products 显示404
echo ════════════════════════════════════════════════════════════
echo ❌ 错误URL: https://xxx.cpolar.cn/products
echo ✅ 正确URL: https://xxx.cpolar.cn/#/products
echo.
echo 💡 解决方案: 手动在URL中添加 /#/
echo.

echo 【问题2】cpolar页面一直转圈，无法加载
echo ════════════════════════════════════════════════════════════
echo 可能原因:
echo   1. 前端服务器未启动
echo   2. cpolar端口配置错误
echo   3. 防火墙阻止
echo.
echo 💡 解决方案:
echo   - 运行选项[1]: 清除缓存并重启
echo.

echo 【问题3】电脑能访问，手机不能访问
echo ════════════════════════════════════════════════════════════
echo 可能原因:
echo   1. cpolar未启动或配置错误
echo   2. 手机浏览器缓存
echo   3. URL格式错误
echo.
echo 💡 解决方案:
echo   - 确保cpolar正在运行
echo   - 清除手机浏览器缓存
echo   - 使用Hash模式URL: https://xxx.cpolar.cn/#/
echo.

echo 【问题4】刷新页面后显示404
echo ════════════════════════════════════════════════════════════
echo 💡 已使用Hash模式,不应该出现此问题
echo.
echo 检查URL格式:
echo   ❌ 错误: https://xxx.cpolar.cn/products (刷新404)
echo   ✅ 正确: https://xxx.cpolar.cn/#/products (刷新正常)
echo.

echo ════════════════════════════════════════════════════════════
echo 🎯 完整测试流程:
echo ════════════════════════════════════════════════════════════
echo.
echo 1. 启动服务
echo    - 运行: 🚀_一键启动AIWEB_2025-12-22.bat
echo    - 运行: cpolar http 5173
echo.
echo 2. 电脑测试
echo    - 访问: http://localhost:5173/#/
echo    - 访问: http://localhost:5173/#/products
echo    - 刷新页面 → 应该正常
echo.
echo 3. 获取cpolar链接
echo    - 访问: https://dashboard.cpolar.com/status
echo    - 复制公网地址 (如: https://abc123.cpolar.cn)
echo.
echo 4. 手机测试
echo    - 访问: https://abc123.cpolar.cn/#/
echo    - 访问: https://abc123.cpolar.cn/#/products
echo    - 刷新页面 → 应该正常
echo.

echo ════════════════════════════════════════════════════════════
echo 📚 相关文档:
echo ════════════════════════════════════════════════════════════
echo   📖 详细指南: 📖_手机端404问题完整解决方案_2025-12-25.md
echo   🔧 快速修复: 🔧_修复cpolar手机端404_2025-12-25.bat
echo   📱 手机访问: 📖_手机访问AIWEB完整指南_2025-12-21.md
echo.

pause
goto end

:end
echo.
echo 👋 感谢使用诊断工具！
timeout /t 2 /nobreak >nul
exit
