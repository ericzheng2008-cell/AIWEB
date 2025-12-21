@echo off
:: 检查管理员权限
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ========================================
    echo   ⚠️  需要管理员权限
    echo ========================================
    echo.
    echo 请右键点击此文件，选择"以管理员身份运行"
    echo.
    pause
    exit /b 1
)

chcp 65001 >nul
title Windows防火墙配置工具

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║                                                      ║
echo ║          🔧 Windows防火墙配置工具                   ║
echo ║                                                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.

echo [1/4] 🔍 检查现有规则...
netsh advfirewall firewall show rule name=all | findstr "AIWEB" >nul
if %errorlevel% equ 0 (
    echo ⚠️  检测到已存在的AIWEB规则，正在删除...
    netsh advfirewall firewall delete rule name="AIWEB Frontend Port 3002" >nul 2>&1
    netsh advfirewall firewall delete rule name="AIWEB Backend Port 5000" >nul 2>&1
    echo ✅ 旧规则已删除
) else (
    echo ✅ 未发现冲突规则
)
echo.

echo [2/4] ➕ 添加前端端口规则（3002）...
netsh advfirewall firewall add rule name="AIWEB Frontend Port 3002" dir=in action=allow protocol=TCP localport=3002
if %errorlevel% equ 0 (
    echo ✅ 前端端口规则添加成功
) else (
    echo ❌ 前端端口规则添加失败
)
echo.

echo [3/4] ➕ 添加后端端口规则（5000）...
netsh advfirewall firewall add rule name="AIWEB Backend Port 5000" dir=in action=allow protocol=TCP localport=5000
if %errorlevel% equ 0 (
    echo ✅ 后端端口规则添加成功
) else (
    echo ❌ 后端端口规则添加失败
)
echo.

echo [4/4] 🔍 验证规则...
echo.
echo ════════════════════════════════════════════════════════
netsh advfirewall firewall show rule name="AIWEB Frontend Port 3002"
echo ════════════════════════════════════════════════════════
echo.
netsh advfirewall firewall show rule name="AIWEB Backend Port 5000"
echo ════════════════════════════════════════════════════════
echo.

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║                                                      ║
echo ║              ✅ 配置完成                            ║
echo ║                                                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.
echo   📌 已添加的防火墙规则：
echo      - AIWEB Frontend Port 3002 （允许入站TCP/3002）
echo      - AIWEB Backend Port 5000 （允许入站TCP/5000）
echo.
echo   💡 现在可以正常使用手机访问了！
echo.
echo   🌐 访问地址：
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4" ^| findstr /V "127.0.0.1"') do (
    set IP=%%a
    goto :show_ip
)
:show_ip
set IP=%IP: =%
echo      http://%IP%:3002
echo.

pause
