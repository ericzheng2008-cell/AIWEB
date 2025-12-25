@echo off
chcp 65001 >nul
title 桌面图标和cpolar问题修复
color 0E

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║         🔧 桌面图标 + cpolar 问题诊断修复             ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:: 切换到项目目录
cd /d "%~dp0"

echo [1/5] 🔍 诊断桌面快捷方式...
echo.

:: 检查桌面快捷方式
set "DESKTOP=%USERPROFILE%\Desktop"
if exist "%DESKTOP%\🚀 明升AIWEB.lnk" (
    echo ✅ 桌面快捷方式存在
) else (
    echo ❌ 桌面快捷方式不存在 - 将创建
    goto :CREATE_SHORTCUT
)

:: 检查目标文件是否存在
if exist "🚀_明升AIWEB_智能启动.bat" (
    echo ✅ 目标启动文件存在
) else (
    echo ❌ 目标启动文件不存在！
    echo 💡 可能原因：项目文件已移动或删除
    goto :FIX_TARGET
)

echo.
echo [2/5] 🔍 诊断cpolar安装...
echo.

:: 检查cpolar是否安装
where cpolar >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ cpolar未安装！
    echo.
    echo 💡 需要安装cpolar才能使用外网访问功能
    echo.
    choice /C YN /M "是否要打开cpolar官网下载页面"
    if errorlevel 2 goto :SKIP_CPOLAR_INSTALL
    if errorlevel 1 (
        echo 🌐 打开cpolar下载页...
        start https://www.cpolar.com/download
        echo.
        echo 📌 安装完成后请重新运行本脚本
        pause
        exit /b 1
    )
) else (
    echo ✅ cpolar已安装
    
    :: 显示cpolar版本
    for /f "tokens=*" %%a in ('cpolar version 2^>nul') do (
        echo    版本: %%a
    )
)

echo.
echo [3/5] 🔍 检查cpolar配置...
echo.

:: 检查是否登录
if exist "%USERPROFILE%\.cpolar\cpolar.yml" (
    echo ✅ cpolar配置文件存在
    
    :: 读取配置看是否有authtoken
    findstr /C:"authtoken" "%USERPROFILE%\.cpolar\cpolar.yml" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ cpolar已登录（找到authtoken）
    ) else (
        echo ⚠️  未找到authtoken - 可能需要重新登录
        goto :CPOLAR_LOGIN
    )
) else (
    echo ❌ cpolar未登录！
    goto :CPOLAR_LOGIN
)

echo.
echo [4/5] 🔍 检查服务运行状态...
echo.

:: 检查前端服务
netstat -ano | findstr ":3002.*LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 前端服务运行中（端口3002）
    set "FRONTEND_OK=1"
) else (
    netstat -ano | findstr ":5173.*LISTENING" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ 前端服务运行中（端口5173）
        set "FRONTEND_OK=1"
    ) else (
        echo ❌ 前端服务未运行
        set "FRONTEND_OK=0"
    )
)

:: 检查后端服务
netstat -ano | findstr ":3000.*LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 后端服务运行中（端口3000）
    set "BACKEND_OK=1"
) else (
    netstat -ano | findstr ":5000.*LISTENING" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ 后端服务运行中（端口5000）
        set "BACKEND_OK=1"
    ) else (
        echo ❌ 后端服务未运行
        set "BACKEND_OK=0"
    )
)

echo.
echo [5/5] 📋 诊断总结
echo.
echo ═══════════════════════════════════════════════════════════
echo.

if "%FRONTEND_OK%"=="0" (
    echo ⚠️  前端服务未运行 - cpolar无法正常工作
    echo.
    echo 💡 解决方案：
    echo    1. 先启动AIWEB服务
    echo    2. 再启动cpolar
    echo.
    choice /C YN /M "是否现在启动AIWEB服务"
    if errorlevel 2 goto :END
    if errorlevel 1 goto :START_SERVICES
) else (
    echo ✅ 所有检查通过！
    echo.
    echo 🎯 下一步操作建议：
    echo.
    echo    [1] 使用桌面快捷方式启动
    echo    [2] 测试cpolar外网访问
    echo.
    choice /C 12 /M "请选择"
    if errorlevel 2 goto :TEST_CPOLAR
    if errorlevel 1 goto :TEST_SHORTCUT
)

goto :END

:CREATE_SHORTCUT
echo.
echo 🔨 创建桌面快捷方式...
echo.

:: 使用PowerShell创建快捷方式
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\🚀 明升AIWEB.lnk'); $Shortcut.TargetPath = '%~dp0🚀_明升AIWEB_智能启动.bat'; $Shortcut.WorkingDirectory = '%~dp0'; $Shortcut.Description = '明升AIWEB智能启动中心'; $Shortcut.Save()"

if exist "%DESKTOP%\🚀 明升AIWEB.lnk" (
    echo ✅ 桌面快捷方式创建成功！
) else (
    echo ❌ 创建失败
)
echo.
goto :CONTINUE_CHECK

:FIX_TARGET
echo.
echo 🔨 修复目标文件...
echo.

:: 检查是否存在其他启动文件
if exist "⚡_一键启动AIWEB_2025-12-22.bat" (
    echo ✅ 找到替代启动文件
    echo    将使用: ⚡_一键启动AIWEB_2025-12-22.bat
    
    :: 重新创建快捷方式指向这个文件
    powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%DESKTOP%\🚀 明升AIWEB.lnk'); $Shortcut.TargetPath = '%~dp0⚡_一键启动AIWEB_2025-12-22.bat'; $Shortcut.WorkingDirectory = '%~dp0'; $Shortcut.Description = '明升AIWEB一键启动'; $Shortcut.Save()"
    
    echo ✅ 快捷方式已更新
) else (
    echo ❌ 无法找到任何启动文件
    echo 💡 请确认项目文件完整性
    pause
    exit /b 1
)
echo.
goto :CONTINUE_CHECK

:CPOLAR_LOGIN
echo.
echo 🔑 cpolar需要登录
echo.
echo 💡 登录步骤：
echo    1. 访问 https://dashboard.cpolar.com
echo    2. 注册/登录账号
echo    3. 复制authtoken
echo    4. 运行: cpolar authtoken 你的token
echo.

choice /C YN /M "是否打开cpolar控制台获取authtoken"
if errorlevel 2 goto :SKIP_CPOLAR_LOGIN
if errorlevel 1 (
    echo 🌐 打开cpolar控制台...
    start https://dashboard.cpolar.com/get-started
    echo.
    echo 📌 复制authtoken后，请在命令行执行：
    echo    cpolar authtoken 你的token
    echo.
    echo 💡 配置完成后请重新运行本脚本
    pause
    exit /b 1
)

:SKIP_CPOLAR_LOGIN
:SKIP_CPOLAR_INSTALL
:CONTINUE_CHECK
echo.
echo 继续下一步检查...
echo.
timeout /t 2 >nul
goto :END

:START_SERVICES
echo.
echo 🚀 启动AIWEB服务...
echo.

:: 检测使用哪个端口（优先使用3002）
if exist "⚡_一键启动AIWEB_2025-12-22.bat" (
    echo 使用标准启动脚本...
    call "⚡_一键启动AIWEB_2025-12-22.bat"
) else (
    echo ❌ 找不到启动脚本
    echo 💡 请手动启动服务
)
goto :END

:TEST_CPOLAR
echo.
echo 🧪 测试cpolar...
echo.

:: 检测前端端口
set "FRONTEND_PORT=3002"
netstat -ano | findstr ":3002.*LISTENING" >nul 2>&1
if %errorlevel% neq 0 (
    netstat -ano | findstr ":5173.*LISTENING" >nul 2>&1
    if %errorlevel% equ 0 (
        set "FRONTEND_PORT=5173"
    ) else (
        echo ❌ 前端服务未运行，无法测试cpolar
        pause
        goto :END
    )
)

echo ✅ 检测到前端运行在端口: %FRONTEND_PORT%
echo.
echo 🌐 启动cpolar...
start "cpolar测试" cmd /k "title cpolar测试 && color 0A && echo 🌐 cpolar启动中... && echo. && echo 💡 请在下方找到外网地址 && echo. && cpolar http %FRONTEND_PORT%"

timeout /t 5 >nul
echo.
echo 📱 cpolar已启动！
echo.
echo 💡 查看外网地址方式：
echo    1. 查看刚才打开的cpolar窗口
echo    2. 访问 http://localhost:9200
echo    3. 访问 https://dashboard.cpolar.com/status
echo.

choice /C YN /M "是否打开cpolar Web控制台"
if errorlevel 1 start http://localhost:9200

goto :END

:TEST_SHORTCUT
echo.
echo 🧪 测试桌面快捷方式...
echo.

if exist "%DESKTOP%\🚀 明升AIWEB.lnk" (
    echo ✅ 快捷方式存在
    echo.
    choice /C YN /M "是否运行桌面快捷方式测试"
    if errorlevel 1 (
        echo 🚀 正在运行快捷方式...
        start "" "%DESKTOP%\🚀 明升AIWEB.lnk"
    )
) else (
    echo ❌ 快捷方式不存在
    echo 💡 请先运行选项[1]创建快捷方式
)
goto :END

:END
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 💡 常见问题解决方案：
echo.
echo    问题1: 桌面图标双击无反应
echo    解决: 右键图标 → 属性 → 检查"目标"路径是否正确
echo.
echo    问题2: cpolar命令不存在
echo    解决: 需要先安装cpolar（https://www.cpolar.com/download）
echo.
echo    问题3: cpolar启动后没有外网地址
echo    解决: 需要先登录cpolar（cpolar authtoken 你的token）
echo.
echo    问题4: cpolar显示连接失败
echo    解决: 确保本地服务已启动（端口3002或5173）
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause
