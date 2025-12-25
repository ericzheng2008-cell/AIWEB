@echo off
chcp 65001 >nul
color 0B

:MENU
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║        ⚙️  明升AIWEB - 开机自启动设置工具                  ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │                                                            │
echo │  [1] ✅ 启用开机自启动                                     │
echo │  [2] ❌ 禁用开机自启动                                     │
echo │  [3] 🔍 查看当前状态                                       │
echo │  [0] 🚪 退出                                               │
echo │                                                            │
echo └────────────────────────────────────────────────────────────┘
echo.
set /p choice=请选择 (0-3): 

if "%choice%"=="1" goto :ENABLE_AUTOSTART
if "%choice%"=="2" goto :DISABLE_AUTOSTART
if "%choice%"=="3" goto :CHECK_AUTOSTART
if "%choice%"=="0" exit /b 0

echo.
echo ❌ 无效选项！请重新选择。
timeout /t 2 >nul
goto :MENU

:ENABLE_AUTOSTART
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              ✅ 启用开机自启动                             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 正在配置开机自启动...
echo.

:: 获取路径
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "STARTUP_FILE=%STARTUP_FOLDER%\AIWEB_Auto_Start.vbs"
set "MAIN_BAT=%~dp0🚀_明升AIWEB_智能启动.bat"
set "ALT_BAT=%~dp0⚡_一键启动AIWEB_2025-12-22.bat"

:: 检查主启动文件是否存在
if exist "%MAIN_BAT%" (
    set "TARGET_BAT=%MAIN_BAT%"
    echo ✓ 找到主控制程序
) else if exist "%ALT_BAT%" (
    set "TARGET_BAT=%ALT_BAT%"
    echo ✓ 找到替代启动程序
) else (
    echo ❌ 找不到启动程序！
    echo.
    echo 💡 请确认以下文件存在：
    echo    • 🚀_明升AIWEB_智能启动.bat
    echo    • ⚡_一键启动AIWEB_2025-12-22.bat
    echo.
    pause
    goto :MENU
)

:: 删除旧的启动项（如果存在）
if exist "%STARTUP_FILE%" (
    del "%STARTUP_FILE%" >nul 2>&1
)

:: 创建VBS启动脚本
(
echo Set WshShell = CreateObject^("WScript.Shell"^)
echo WshShell.Run chr^(34^) ^& "%TARGET_BAT%" ^& chr^(34^) ^& " auto", 0
) > "%STARTUP_FILE%"

if exist "%STARTUP_FILE%" (
    echo.
    echo ✅ 开机自启动已成功启用！
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo.
    echo 📁 启动文件位置:
    echo    %STARTUP_FILE%
    echo.
    echo 📋 启动脚本内容:
    type "%STARTUP_FILE%"
    echo.
    echo ═══════════════════════════════════════════════════════════
    echo.
    echo ℹ️  功能说明:
    echo    • 下次开机时，AIWEB 将自动在后台启动
    echo    • 启动过程静默执行，不显示窗口
    echo    • 后端服务: http://localhost:3000
    echo    • 前端服务: http://localhost:3002
    echo.
    echo ⚠️  注意事项:
    echo    • 确保项目文件不要移动位置
    echo    • 如需禁用，请运行本工具选择禁用选项
    echo.
) else (
    echo ❌ 启用失败！
    echo.
    echo 💡 可能原因:
    echo    • 没有写入权限
    echo    • 启动文件夹不存在
    echo.
)
echo.
pause
goto :MENU

:DISABLE_AUTOSTART
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              ❌ 禁用开机自启动                             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 正在禁用开机自启动...
echo.

set "STARTUP_FILE=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\AIWEB_Auto_Start.vbs"

if exist "%STARTUP_FILE%" (
    del "%STARTUP_FILE%"
    if not exist "%STARTUP_FILE%" (
        echo ✅ 开机自启动已成功禁用！
        echo.
        echo 💡 下次开机时不会自动启动 AIWEB
    ) else (
        echo ❌ 禁用失败！
        echo.
        echo 💡 可能原因:
        echo    • 文件被占用
        echo    • 没有删除权限
    )
) else (
    echo ℹ️  开机自启动未启用，无需禁用
)
echo.
pause
goto :MENU

:CHECK_AUTOSTART
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              🔍 查看开机自启动状态                         ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "STARTUP_FILE=%STARTUP_FOLDER%\AIWEB_Auto_Start.vbs"

echo 检查中...
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 📁 启动文件夹:
echo    %STARTUP_FOLDER%
echo.

if exist "%STARTUP_FILE%" (
    echo ✅ 开机自启动: 已启用
    echo.
    echo 📄 启动文件: %STARTUP_FILE%
    echo.
    
    :: 显示文件信息
    for %%F in ("%STARTUP_FILE%") do (
        echo 文件大小: %%~zF 字节
        echo 修改时间: %%~tF
    )
    
    echo.
    echo 📋 文件内容:
    echo ───────────────────────────────────────────────────────────
    type "%STARTUP_FILE%"
    echo.
    echo ───────────────────────────────────────────────────────────
    echo.
    
    :: 检查目标文件是否存在
    set "MAIN_BAT=%~dp0🚀_明升AIWEB_智能启动.bat"
    set "ALT_BAT=%~dp0⚡_一键启动AIWEB_2025-12-22.bat"
    
    if exist "%MAIN_BAT%" (
        echo ✅ 主启动程序存在: 🚀_明升AIWEB_智能启动.bat
    ) else if exist "%ALT_BAT%" (
        echo ✅ 替代启动程序存在: ⚡_一键启动AIWEB_2025-12-22.bat
    ) else (
        echo ⚠️  警告: 找不到启动程序！
        echo    开机自启动可能无法正常工作
    )
) else (
    echo ❌ 开机自启动: 未启用
    echo.
    echo 💡 如需启用，请选择菜单选项 [1]
)
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause
goto :MENU
