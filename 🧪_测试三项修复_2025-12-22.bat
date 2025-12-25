@echo off
chcp 65001 >nul
title 三项修复测试工具
color 0A

:MENU
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║          🧪 三项修复 - 完整测试工具                       ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │                                                            │
echo │  [1] 🖥️  测试桌面图标功能                                  │
echo │  [2] 🌐 测试cpolar配置                                     │
echo │  [3] 📱 测试手机访问                                       │
echo │  [4] 🔍 运行完整验证                                       │
echo │  [5] 📖 查看快速导航                                       │
echo │  [0] 🚪 退出                                               │
echo │                                                            │
echo └────────────────────────────────────────────────────────────┘
echo.
set /p choice=请选择 (0-5): 

if "%choice%"=="1" goto :TEST_DESKTOP
if "%choice%"=="2" goto :TEST_CPOLAR
if "%choice%"=="3" goto :TEST_MOBILE
if "%choice%"=="4" goto :TEST_ALL
if "%choice%"=="5" goto :VIEW_GUIDE
if "%choice%"=="0" exit /b 0

echo.
echo ❌ 无效选项！
timeout /t 2 >nul
goto :MENU

:TEST_DESKTOP
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              🖥️  测试桌面图标功能                          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 正在检查...
echo.

:: 检查核心文件
set "FILES_OK=1"

if exist "%~dp0🚀_明升AIWEB_智能启动.bat" (
    echo ✅ 主控制程序存在
) else (
    echo ❌ 缺少: 🚀_明升AIWEB_智能启动.bat
    set "FILES_OK=0"
)

if exist "%~dp0⚡_一键完成所有配置.bat" (
    echo ✅ 配置向导存在
) else (
    echo ❌ 缺少: ⚡_一键完成所有配置.bat
    set "FILES_OK=0"
)

if exist "%~dp0🔧_设置开机自启动_2025-12-22.bat" (
    echo ✅ 自启动管理工具存在
) else (
    echo ❌ 缺少: 🔧_设置开机自启动_2025-12-22.bat
    set "FILES_OK=0"
)

echo.

:: 检查桌面快捷方式
if exist "%USERPROFILE%\Desktop\🚀 明升AIWEB.lnk" (
    echo ✅ 桌面快捷方式存在
    set "SHORTCUT_OK=1"
) else (
    echo ⚠️  桌面快捷方式不存在
    set "SHORTCUT_OK=0"
)

echo.

:: 检查开机自启动
if exist "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\AIWEB_Auto_Start.vbs" (
    echo ✅ 开机自启动已配置
) else (
    echo ○ 开机自启动未配置
)

echo.
echo ═══════════════════════════════════════════════════════════
echo.

if "%FILES_OK%"=="1" (
    if "%SHORTCUT_OK%"=="1" (
        echo 🎉 桌面图标系统: 完全正常
        echo.
        echo 💡 下一步测试:
        echo    1. 双击桌面图标 🚀 明升AIWEB
        echo    2. 选择 [1] 一键启动
        echo    3. 验证是否正常打开
    ) else (
        echo ⚠️  桌面快捷方式缺失
        echo.
        echo 💡 修复方法:
        echo    双击运行: ⚡_一键完成所有配置.bat
    )
) else (
    echo ❌ 核心文件缺失
    echo.
    echo 💡 请确认项目文件完整性
)

echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause
goto :MENU

:TEST_CPOLAR
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              🌐 测试cpolar配置                             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 正在检查...
echo.

:: 检查cpolar安装
where cpolar >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ cpolar已安装
    for /f "tokens=*" %%a in ('cpolar version 2^>nul') do (
        echo    版本: %%a
    )
) else (
    echo ❌ cpolar未安装
    echo.
    echo 💡 安装方法:
    echo    访问 https://www.cpolar.com/download
    goto :CPOLAR_END
)

echo.

:: 检查cpolar配置
if exist "%USERPROFILE%\.cpolar\cpolar.yml" (
    echo ✅ cpolar配置文件存在
    
    findstr /C:"authtoken" "%USERPROFILE%\.cpolar\cpolar.yml" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ cpolar已登录
    ) else (
        echo ❌ cpolar未登录
        echo.
        echo 💡 登录方法:
        echo    1. 访问 https://dashboard.cpolar.com
        echo    2. 复制authtoken
        echo    3. 运行: cpolar authtoken 你的token
        goto :CPOLAR_END
    )
) else (
    echo ❌ cpolar未配置
    echo.
    echo 💡 配置方法:
    echo    1. 访问 https://dashboard.cpolar.com
    echo    2. 注册/登录账号
    echo    3. 复制authtoken
    echo    4. 运行: cpolar authtoken 你的token
    goto :CPOLAR_END
)

echo.

:: 检查本地服务
netstat -ano | findstr ":3002.*LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 前端服务运行中（端口3002）
) else (
    netstat -ano | findstr ":5173.*LISTENING" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ 前端服务运行中（端口5173）
    ) else (
        echo ⚠️  前端服务未运行
        echo.
        echo 💡 请先启动AIWEB服务
    )
)

echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 🎉 cpolar配置完整
echo.
echo 💡 测试方法:
echo    1. 运行: 🔧_快速修复桌面图标和cpolar_2025-12-22.bat
echo    2. 选择测试cpolar选项
echo    3. 查看生成的外网地址
echo.
echo ═══════════════════════════════════════════════════════════

:CPOLAR_END
echo.
pause
goto :MENU

:TEST_MOBILE
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              📱 测试手机访问                               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 正在检查...
echo.

:: 检查前端服务
netstat -ano | findstr ":3002.*LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 前端服务运行中（端口3002）
    set "FRONTEND_PORT=3002"
    set "SERVICE_OK=1"
) else (
    netstat -ano | findstr ":5173.*LISTENING" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ 前端服务运行中（端口5173）
        set "FRONTEND_PORT=5173"
        set "SERVICE_OK=1"
    ) else (
        echo ❌ 前端服务未运行
        set "SERVICE_OK=0"
    )
)

:: 检查后端服务
netstat -ano | findstr ":3000.*LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 后端服务运行中（端口3000）
) else (
    netstat -ano | findstr ":5000.*LISTENING" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ 后端服务运行中（端口5000）
    ) else (
        echo ❌ 后端服务未运行
        set "SERVICE_OK=0"
    )
)

echo.

if "%SERVICE_OK%"=="0" (
    echo ⚠️  服务未启动，无法测试手机访问
    echo.
    echo 💡 请先启动服务:
    echo    双击: ⚡_一键启动AIWEB_2025-12-22.bat
    echo.
    pause
    goto :MENU
)

:: 获取IP地址
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set IP=%%a
)
set IP=%IP: =%

echo 📌 本机IP地址: %IP%
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 📱 手机访问地址:
echo.
echo    http://%IP%:%FRONTEND_PORT%
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo ✅ 检查清单:
echo.
echo    [ ] 手机和电脑连接同一WiFi
echo    [ ] WiFi名称完全一致（包括2.4G/5G）
echo    [ ] 防火墙允许端口%FRONTEND_PORT%
echo    [ ] 手机输入的地址完全正确
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 💡 如果手机无法访问:
echo    双击运行: 🔧_手机404问题快速修复_2025-12-22.bat
echo.
pause
goto :MENU

:TEST_ALL
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              🔍 运行完整验证                               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 正在打开验证工具...
echo.

if exist "%~dp0🔍_验证桌面图标配置_2025-12-22.html" (
    start "" "%~dp0🔍_验证桌面图标配置_2025-12-22.html"
    echo ✅ 已打开验证工具
    echo.
    echo 💡 请在浏览器中完成验证测试
) else (
    echo ❌ 验证工具文件不存在
    echo.
    echo 💡 请确认文件: 🔍_验证桌面图标配置_2025-12-22.html
)
echo.
pause
goto :MENU

:VIEW_GUIDE
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              📖 查看快速导航                               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

if exist "%~dp0🎯_三项修复快速导航_2025-12-22.md" (
    echo 正在打开快速导航...
    start "" "%~dp0🎯_三项修复快速导航_2025-12-22.md"
    echo.
    echo ✅ 已打开快速导航文档
) else (
    echo ❌ 快速导航文件不存在
)
echo.
pause
goto :MENU
