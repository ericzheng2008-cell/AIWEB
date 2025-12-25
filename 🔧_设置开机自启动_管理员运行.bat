@echo off
chcp 65001 >nul
echo ========================================
echo    AIWEB 开机自启动配置工具
echo ========================================
echo.

REM 检查管理员权限
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 需要管理员权限！
    echo.
    echo 请右键点击此文件，选择"以管理员身份运行"
    echo.
    pause
    exit /b 1
)

echo ✓ 已获取管理员权限
echo.

set "SCRIPT_PATH=%~dp0⚡_一键启动AIWEB_2025-12-22.bat"
set "STARTUP_FOLDER=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

echo 选择操作:
echo [1] 设置开机自启动
echo [2] 取消开机自启动
echo [3] 查看自启动状态
echo.
set /p choice="请输入选项 (1/2/3): "

if "%choice%"=="1" goto setup
if "%choice%"=="2" goto remove
if "%choice%"=="3" goto status
echo 无效选项！
pause
exit /b

:setup
echo.
echo [设置中] 正在配置开机自启动...
echo.

REM 创建启动快捷方式
set "VBS_PATH=%TEMP%\create_shortcut.vbs"
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%VBS_PATH%"
echo sLinkFile = "%STARTUP_FOLDER%\明升AIWEB.lnk" >> "%VBS_PATH%"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%VBS_PATH%"
echo oLink.TargetPath = "%SCRIPT_PATH%" >> "%VBS_PATH%"
echo oLink.WorkingDirectory = "%~dp0" >> "%VBS_PATH%"
echo oLink.WindowStyle = 1 >> "%VBS_PATH%"
echo oLink.Description = "明升AIWEB智能平台 - 开机自启动" >> "%VBS_PATH%"
echo oLink.Save >> "%VBS_PATH%"

cscript //nologo "%VBS_PATH%"
del "%VBS_PATH%"

if exist "%STARTUP_FOLDER%\明升AIWEB.lnk" (
    echo ✅ 开机自启动设置成功！
    echo.
    echo 配置信息:
    echo    启动文件: %SCRIPT_PATH%
    echo    快捷方式: %STARTUP_FOLDER%\明升AIWEB.lnk
    echo.
    echo 💡 下次开机时，AIWEB将自动启动
) else (
    echo ❌ 设置失败，请检查权限或路径
)
goto end

:remove
echo.
echo [移除中] 正在取消开机自启动...
echo.

if exist "%STARTUP_FOLDER%\明升AIWEB.lnk" (
    del "%STARTUP_FOLDER%\明升AIWEB.lnk"
    echo ✅ 已取消开机自启动
) else (
    echo ℹ️ 未找到自启动配置
)
goto end

:status
echo.
echo [状态检查] 开机自启动配置状态:
echo.

if exist "%STARTUP_FOLDER%\明升AIWEB.lnk" (
    echo ✅ 开机自启动: 已启用
    echo    快捷方式: %STARTUP_FOLDER%\明升AIWEB.lnk
) else (
    echo ❌ 开机自启动: 未启用
)
goto end

:end
echo.
echo ========================================
pause
