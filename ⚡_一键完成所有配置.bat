@echo off
chcp 65001 >nul
color 0B
cls

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║        ⚡ 明升AIWEB - 一键完成所有配置 ⚡                   ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 本工具将自动完成以下配置：
echo   [1/3] 📌 创建桌面快捷方式
echo   [2/3] ⚙️  设置开机自启动
echo   [3/3] 🚀 (可选) 立即启动AIWEB
echo.
echo 按任意键开始配置...
pause >nul

:: 切换到项目目录
cd /d "%~dp0"

:: ================================================================
:: 步骤1: 创建桌面快捷方式
:: ================================================================
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              [1/3] 📌 创建桌面快捷方式                    ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 正在创建桌面快捷方式...
echo.

set "DESKTOP=%USERPROFILE%\Desktop"
set "MAIN_BAT=%~dp0🚀_明升AIWEB_智能启动.bat"
set "ALT_BAT=%~dp0⚡_一键启动AIWEB_2025-12-22.bat"
set "WORK_DIR=%~dp0"

:: 检查目标文件
if exist "%MAIN_BAT%" (
    set "TARGET_BAT=%MAIN_BAT%"
    set "TARGET_NAME=🚀_明升AIWEB_智能启动.bat"
    echo ✓ 找到主控制程序
) else if exist "%ALT_BAT%" (
    set "TARGET_BAT=%ALT_BAT%"
    set "TARGET_NAME=⚡_一键启动AIWEB_2025-12-22.bat"
    echo ✓ 找到替代启动程序
) else (
    echo ❌ 找不到启动程序！
    echo.
    echo 💡 请确认项目文件完整
    pause
    exit /b 1
)

:: 使用PowerShell创建快捷方式
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\🚀 明升AIWEB.lnk'); $Shortcut.TargetPath = '%TARGET_BAT%'; $Shortcut.WorkingDirectory = '%WORK_DIR%'; $Shortcut.Description = '明升AIWEB智能启动控制中心'; $Shortcut.Save()" 2>nul

timeout /t 1 >nul

if exist "%DESKTOP%\🚀 明升AIWEB.lnk" (
    echo.
    echo ✅ 桌面快捷方式创建成功！
    echo.
    echo 📁 位置: %DESKTOP%\🚀 明升AIWEB.lnk
    echo 🎯 目标: %TARGET_NAME%
) else (
    echo ❌ 创建失败
)

echo.
timeout /t 2 >nul

:: ================================================================
:: 步骤2: 设置开机自启动
:: ================================================================
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              [2/3] ⚙️  设置开机自启动                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 正在配置开机自启动...
echo.

set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "STARTUP_FILE=%STARTUP_FOLDER%\AIWEB_Auto_Start.vbs"

:: 删除旧的启动项（如果存在）
if exist "%STARTUP_FILE%" (
    del "%STARTUP_FILE%" >nul 2>&1
    echo ○ 清理旧配置
)

:: 创建VBS启动脚本
(
echo Set WshShell = CreateObject^("WScript.Shell"^)
echo WshShell.Run chr^(34^) ^& "%TARGET_BAT%" ^& chr^(34^) ^& " auto", 0
) > "%STARTUP_FILE%"

timeout /t 1 >nul

if exist "%STARTUP_FILE%" (
    echo.
    echo ✅ 开机自启动设置成功！
    echo.
    echo 📁 启动文件: %STARTUP_FILE%
    echo 🔧 功能: 开机后自动在后台启动AIWEB
) else (
    echo ❌ 设置失败
)

echo.
timeout /t 2 >nul

:: ================================================================
:: 步骤3: 配置完成
:: ================================================================
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              [3/3] 🚀 配置完成！                           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo ✅ 所有配置已完成！
echo.
echo 📌 已完成的配置：
echo    • 桌面快捷方式: 🚀 明升AIWEB
echo    • 开机自启动: 已启用
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 💡 使用方式：
echo.
echo    方式1（推荐）: 双击桌面图标 🚀 明升AIWEB
echo    方式2: 重启电脑，服务将自动启动
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 🎯 下一步：
echo    • 访问地址: http://localhost:3002
echo    • 查看使用指南: 📖_桌面图标使用指南_2025-12-22.md
echo    • 验证配置: 🔍_验证桌面图标配置_2025-12-22.html
echo.
echo ═══════════════════════════════════════════════════════════
echo.

:: 询问是否立即启动
set /p start_now=是否现在启动AIWEB？(Y/N): 

if /i "%start_now%"=="Y" (
    echo.
    echo 正在启动...
    echo.
    
    if exist "%DESKTOP%\🚀 明升AIWEB.lnk" (
        start "" "%DESKTOP%\🚀 明升AIWEB.lnk"
    ) else if exist "%TARGET_BAT%" (
        start "" "%TARGET_BAT%"
    )
    
    timeout /t 2 >nul
    echo ✅ 已启动！请在弹出的窗口中选择 [1] 一键启动
) else (
    echo.
    echo 💡 需要时请双击桌面图标启动
)

echo.
echo.
pause
