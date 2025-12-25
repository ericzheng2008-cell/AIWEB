@echo off
chcp 65001 >nul
color 0B

:: 检查是否为自动模式（开机自启动）
if "%1"=="auto" goto :AUTO_START

:MENU
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║          🚀 明升AIWEB - 智能启动控制中心 🚀                ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │                                                            │
echo │  [1] 🚀 一键启动 AIWEB                                     │
echo │  [2] ⚙️  设置开机自启动                                     │
echo │  [3] 🔍 查看服务状态                                       │
echo │  [4] 🛑 停止所有服务                                       │
echo │  [5] 📌 创建桌面快捷方式                                   │
echo │  [0] 🚪 退出                                               │
echo │                                                            │
echo └────────────────────────────────────────────────────────────┘
echo.
set /p choice=请输入选项 (0-5): 

if "%choice%"=="1" goto :START_AIWEB
if "%choice%"=="2" goto :AUTOSTART_MENU
if "%choice%"=="3" goto :CHECK_STATUS
if "%choice%"=="4" goto :STOP_SERVICES
if "%choice%"=="5" goto :CREATE_SHORTCUT
if "%choice%"=="0" exit /b 0

echo.
echo ❌ 无效选项！请重新选择。
timeout /t 2 >nul
goto :MENU

:START_AIWEB
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              🚀 启动 AIWEB 服务                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
cd /d "%~dp0"

echo [1/4] 检查端口占用状态...
echo.

:: 检查后端服务
netstat -ano | findstr ":3000.*LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ 后端服务器已在运行（端口3000）
    set "BACKEND_RUNNING=1"
) else (
    netstat -ano | findstr ":5000.*LISTENING" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✓ 后端服务器已在运行（端口5000）
        set "BACKEND_RUNNING=1"
    ) else (
        echo ○ 后端服务器未运行，正在启动...
        cd server
        start "AIWEB-后端" cmd /k "title AIWEB后端服务 && color 0A && node index.js"
        cd ..
        set "BACKEND_RUNNING=0"
    )
)

:: 检查前端服务
netstat -ano | findstr ":3002.*LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ 前端服务器已在运行（端口3002）
    set "FRONTEND_RUNNING=1"
) else (
    netstat -ano | findstr ":5173.*LISTENING" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✓ 前端服务器已在运行（端口5173）
        set "FRONTEND_RUNNING=1"
    ) else (
        echo ○ 前端服务器未运行，正在启动...
        start "AIWEB-前端" cmd /k "title AIWEB前端服务 && color 0E && npm run dev"
        set "FRONTEND_RUNNING=0"
    )
)

echo.
echo [2/4] 等待服务器初始化...
timeout /t 8 /nobreak >nul
echo      ✅ 初始化完成

echo.
echo [3/4] 正在打开浏览器...
start http://localhost:3002
timeout /t 2 /nobreak >nul

echo.
echo [4/4] 🎉 启动完成！
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo ✅ AIWEB 已成功启动！
echo.
echo 📌 访问地址:
echo    本地访问: http://localhost:3002
echo.
echo 💡 提示:
echo    • 请保持命令窗口运行
echo    • 如需停止服务，请回到主菜单选择 [4]
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause
goto :MENU

:AUTO_START
:: 自动启动模式（开机自启）
cd /d "%~dp0"

:: 检查后端服务
netstat -ano | findstr ":3000.*LISTENING" >nul 2>&1
if %errorlevel% neq 0 (
    netstat -ano | findstr ":5000.*LISTENING" >nul 2>&1
    if %errorlevel% neq 0 (
        cd server
        start /min "" cmd /c "node index.js"
        cd ..
    )
)

:: 检查前端服务
netstat -ano | findstr ":3002.*LISTENING" >nul 2>&1
if %errorlevel% neq 0 (
    netstat -ano | findstr ":5173.*LISTENING" >nul 2>&1
    if %errorlevel% neq 0 (
        start /min "" cmd /c "npm run dev"
    )
)

exit /b 0

:AUTOSTART_MENU
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              ⚙️  开机自启动设置                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │  [1] ✅ 启用开机自启动                                     │
echo │  [2] ❌ 禁用开机自启动                                     │
echo │  [3] 🔍 查看当前状态                                       │
echo │  [0] 🔙 返回主菜单                                         │
echo └────────────────────────────────────────────────────────────┘
echo.
set /p auto_choice=请选择 (0-3): 

if "%auto_choice%"=="1" goto :ENABLE_AUTOSTART
if "%auto_choice%"=="2" goto :DISABLE_AUTOSTART
if "%auto_choice%"=="3" goto :CHECK_AUTOSTART
if "%auto_choice%"=="0" goto :MENU

echo ❌ 无效选项！
timeout /t 2 >nul
goto :AUTOSTART_MENU

:ENABLE_AUTOSTART
echo.
echo 正在启用开机自启动...
echo.

set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "STARTUP_FILE=%STARTUP_FOLDER%\AIWEB_Auto_Start.vbs"
set "TARGET_BAT=%~f0"

:: 创建VBS启动脚本
(
echo Set WshShell = CreateObject^("WScript.Shell"^)
echo WshShell.Run chr^(34^) ^& "%TARGET_BAT%" ^& chr^(34^) ^& " auto", 0
) > "%STARTUP_FILE%"

if exist "%STARTUP_FILE%" (
    echo ✅ 开机自启动已成功启用！
    echo.
    echo 📁 启动文件位置:
    echo    %STARTUP_FILE%
    echo.
    echo ℹ️  功能说明:
    echo    • 下次开机时，AIWEB 将自动在后台启动
    echo    • 启动过程静默执行，不显示窗口
    echo    • 前端服务: http://localhost:3002
    echo.
) else (
    echo ❌ 启用失败！
)
echo.
pause
goto :AUTOSTART_MENU

:DISABLE_AUTOSTART
echo.
echo 正在禁用开机自启动...
echo.

set "STARTUP_FILE=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\AIWEB_Auto_Start.vbs"

if exist "%STARTUP_FILE%" (
    del "%STARTUP_FILE%"
    if not exist "%STARTUP_FILE%" (
        echo ✅ 开机自启动已成功禁用！
    ) else (
        echo ❌ 禁用失败！
    )
) else (
    echo ℹ️  开机自启动未启用，无需禁用
)
echo.
pause
goto :AUTOSTART_MENU

:CHECK_AUTOSTART
echo.
echo 正在检查开机自启动状态...
echo.

set "STARTUP_FILE=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\AIWEB_Auto_Start.vbs"

if exist "%STARTUP_FILE%" (
    echo ✅ 开机自启动: 已启用
    echo.
    echo 📁 启动文件: %STARTUP_FILE%
    echo.
    echo 📄 文件内容:
    type "%STARTUP_FILE%"
) else (
    echo ❌ 开机自启动: 未启用
)
echo.
pause
goto :AUTOSTART_MENU

:CHECK_STATUS
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              🔍 服务状态检查                               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

:: 检查后端服务
netstat -ano | findstr ":3000.*LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000.*LISTENING"') do set BACKEND_PID=%%a
    echo ✅ 后端服务 (端口3000): 运行中
    echo    进程ID: !BACKEND_PID!
) else (
    netstat -ano | findstr ":5000.*LISTENING" >nul 2>&1
    if %errorlevel% equ 0 (
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000.*LISTENING"') do set BACKEND_PID=%%a
        echo ✅ 后端服务 (端口5000): 运行中
        echo    进程ID: !BACKEND_PID!
    ) else (
        echo ❌ 后端服务: 未运行
    )
)

echo.

:: 检查前端服务
netstat -ano | findstr ":3002.*LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002.*LISTENING"') do set FRONTEND_PID=%%a
    echo ✅ 前端服务 (端口3002): 运行中
    echo    进程ID: !FRONTEND_PID!
) else (
    netstat -ano | findstr ":5173.*LISTENING" >nul 2>&1
    if %errorlevel% equ 0 (
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173.*LISTENING"') do set FRONTEND_PID=%%a
        echo ✅ 前端服务 (端口5173): 运行中
        echo    进程ID: !FRONTEND_PID!
    ) else (
        echo ❌ 前端服务: 未运行
    )
)

echo.
pause
goto :MENU

:STOP_SERVICES
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              🛑 停止所有服务                               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ⚠️  确定要停止所有 AIWEB 服务吗？
echo.
set /p confirm=输入 Y 确认，其他键取消: 

if /i not "%confirm%"=="Y" (
    echo.
    echo 已取消操作
    timeout /t 2 >nul
    goto :MENU
)

echo.
echo 正在停止服务...
echo.

:: 停止端口3000的进程
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000.*LISTENING" 2^>nul') do (
    echo 停止后端服务 (PID: %%a^)
    taskkill /PID %%a /F >nul 2>&1
)

:: 停止端口5000的进程
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000.*LISTENING" 2^>nul') do (
    echo 停止后端服务 (PID: %%a^)
    taskkill /PID %%a /F >nul 2>&1
)

:: 停止端口3002的进程
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002.*LISTENING" 2^>nul') do (
    echo 停止前端服务 (PID: %%a^)
    taskkill /PID %%a /F >nul 2>&1
)

:: 停止端口5173的进程
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173.*LISTENING" 2^>nul') do (
    echo 停止前端服务 (PID: %%a^)
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo ✅ 所有服务已停止
echo.
pause
goto :MENU

:CREATE_SHORTCUT
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              📌 创建桌面快捷方式                           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 正在创建桌面快捷方式...
echo.

set "DESKTOP=%USERPROFILE%\Desktop"
set "TARGET_BAT=%~f0"
set "WORK_DIR=%~dp0"

:: 使用PowerShell创建快捷方式
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\🚀 明升AIWEB.lnk'); $Shortcut.TargetPath = '%TARGET_BAT%'; $Shortcut.WorkingDirectory = '%WORK_DIR%'; $Shortcut.Description = '明升AIWEB智能启动控制中心'; $Shortcut.Save()"

if exist "%DESKTOP%\🚀 明升AIWEB.lnk" (
    echo ✅ 桌面快捷方式创建成功！
    echo.
    echo 📁 位置: %DESKTOP%\🚀 明升AIWEB.lnk
    echo.
    echo 💡 使用方法:
    echo    双击桌面图标即可打开控制中心
) else (
    echo ❌ 创建失败
)
echo.
pause
goto :MENU
