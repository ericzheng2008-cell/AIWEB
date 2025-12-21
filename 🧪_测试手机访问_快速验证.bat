@echo off
chcp 65001 >nul
title AIWEB 快速验证工具

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║                                                      ║
echo ║          🧪 AIWEB 快速验证工具 v1.0                ║
echo ║                                                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.

:: 获取IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4" ^| findstr /V "127.0.0.1"') do (
    set IP=%%a
    goto :check_services
)

:check_services
set IP=%IP: =%

echo [1/6] 🔍 检查网络连接...
ping -n 1 %IP% >nul
if %errorlevel% equ 0 (
    echo ✅ 网络正常
) else (
    echo ❌ 网络异常
    goto :end
)
echo.

echo [2/6] 🔍 检查后端服务（端口5000）...
netstat -ano | findstr :5000 | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo ✅ 后端服务正常运行
) else (
    echo ❌ 后端服务未启动
    echo 💡 请先运行：🚀_启动AIWEB并生成手机访问链接.bat
    goto :end
)
echo.

echo [3/6] 🔍 检查前端服务（端口3002）...
netstat -ano | findstr :3002 | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo ✅ 前端服务正常运行
) else (
    echo ❌ 前端服务未启动
    echo 💡 请先运行：🚀_启动AIWEB并生成手机访问链接.bat
    goto :end
)
echo.

echo [4/6] 🔍 测试后端API...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ API响应正常
) else (
    echo ⚠️  API测试失败（可能是curl未安装，但服务可能正常）
)
echo.

echo [5/6] 🔍 测试前端页面...
curl -s http://localhost:3002 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 前端页面响应正常
) else (
    echo ⚠️  前端测试失败（可能是curl未安装，但服务可能正常）
)
echo.

echo [6/6] 🔍 检查防火墙规则...
netsh advfirewall firewall show rule name="AIWEB Frontend Port 3002" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 防火墙规则已配置（端口3002）
) else (
    echo ⚠️  防火墙规则未配置
    echo 💡 请运行：🔧_配置Windows防火墙_管理员运行.bat
)

netsh advfirewall firewall show rule name="AIWEB Backend Port 5000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 防火墙规则已配置（端口5000）
) else (
    echo ⚠️  防火墙规则未配置
    echo 💡 请运行：🔧_配置Windows防火墙_管理员运行.bat
)
echo.

echo ╔══════════════════════════════════════════════════════╗
echo ║                                                      ║
echo ║              📱 手机访问测试                        ║
echo ║                                                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.
echo   1️⃣  确认手机与电脑连接同一WiFi
echo.
echo   2️⃣  在手机浏览器输入以下地址：
echo.
echo      📍 http://%IP%:3002
echo.
echo   3️⃣  如果能看到AIWEB首页，说明部署成功！
echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║                                                      ║
echo ║              🔧 故障排查                            ║
echo ║                                                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.
echo   ❌ 问题1：手机无法访问
echo      解决：
echo      - 确认WiFi名称一致
echo      - 运行防火墙配置脚本
echo      - 临时关闭电脑防火墙测试
echo.
echo   ❌ 问题2：页面加载慢
echo      解决：
echo      - 使用5G WiFi
echo      - 检查电脑CPU/内存占用
echo      - 考虑使用生产构建（npm run build）
echo.
echo   ❌ 问题3：部分功能不可用
echo      解决：
echo      - 检查后端日志
echo      - 检查浏览器控制台
echo      - 清除浏览器缓存
echo.

:end
echo ═══════════════════════════════════════════════════════
echo   测试完成！
echo ═══════════════════════════════════════════════════════
echo.
pause
