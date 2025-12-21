@echo off
chcp 65001 > nul

:: 检查是否以管理员身份运行
net session >nul 2>&1
if %errorlevel% neq 0 (
    cls
    echo ╔════════════════════════════════════════════════════╗
    echo ║   需要管理员权限 - 正在重启为管理员模式          ║
    echo ╚════════════════════════════════════════════════════╝
    echo.
    echo 请在弹出的窗口中点击"是"...
    echo.
    
    :: 请求管理员权限并重新运行
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cls
echo ╔════════════════════════════════════════════════════╗
echo ║      Pandoc 管理员模式安装指南                    ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo ✅ 正在以管理员身份运行
echo.
echo ════════════════════════════════════════════════════
echo    安装步骤：
echo ════════════════════════════════════════════════════
echo.
echo 📂 第1步：打开下载文件夹
echo.

explorer "%USERPROFILE%\Downloads"

echo    ✓ 已打开下载文件夹
echo.
echo ════════════════════════════════════════════════════
echo.
echo 📝 第2步：找到 Pandoc 安装文件
echo.
echo    请在下载文件夹中找到：
echo    ✅ pandoc-3.1.11.1-windows-x86_64.msi
echo    （或类似名称的 .msi 文件）
echo.
echo    ❌ 如果只看到 .deb 文件，说明下载错了
echo       需要重新下载 Windows 版本
echo.
set /p found="找到 .msi 文件了吗？(Y/N): "
if /i not "%found%"=="Y" (
    echo.
    echo 📥 正在打开下载页面...
    start https://github.com/jgm/pandoc/releases/download/3.1.11.1/pandoc-3.1.11.1-windows-x86_64.msi
    echo.
    echo 请下载后重新运行本脚本
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════
echo.
echo 🚀 第3步：安装 Pandoc
echo.
echo    请按照以下步骤操作：
echo.
echo    1. 在下载文件夹中，找到 .msi 文件
echo.
echo    2. 双击运行（因为本窗口已是管理员模式，
echo       从这里打开的都会自动以管理员运行）
echo.
echo    3. 在安装向导中：
echo       ✓ 点击 "Next"（下一步）
echo       ✓ 勾选 "I accept the agreement"
echo       ✓ 点击 "Next"
echo       ✓ 使用默认安装路径（不要改）
echo       ✓ 点击 "Install"
echo       ✓ 等待安装完成（约1分钟）
echo       ✓ 看到 "Finish"，点击完成
echo.
echo    4. 注意：如果看到任何错误提示，请记下来
echo.
pause

echo.
echo ════════════════════════════════════════════════════
echo.
echo ✅ 第4步：验证安装
echo.
echo    请确认安装已完成（点击了 Finish）
echo.
set /p installed="安装完成了吗？(Y/N): "
if /i not "%installed%"=="Y" (
    echo.
    echo 请完成安装后重新运行本脚本
    pause
    exit /b 1
)

echo.
echo 🔍 正在验证安装...
echo.

:: 刷新环境变量
call :RefreshEnv

:: 检查是否可以运行 pandoc
where pandoc >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 安装成功！Pandoc 已就绪！
    echo.
    echo ════════════════════════════════════════════════════
    pandoc --version
    echo ════════════════════════════════════════════════════
    echo.
    echo 🚀 准备开始批量转换...
    timeout /t 2 /nobreak > nul
    
    :: 调用批量转换脚本
    cd /d "c:\Users\EricZ\CodeBuddy\AIWEB1"
    call "📄_批量转换MD为PDF.bat"
    
) else (
    echo ⚠️  命令行暂时还无法识别 pandoc
    echo.
    echo 这是正常的，通常需要：
    echo   1. 关闭本窗口
    echo   2. 重新打开新的命令行窗口
    echo   3. 运行: pandoc --version
    echo.
    echo 或者，我可以立即使用完整路径进行转换...
    echo.
    
    set /p convert="是否立即转换（无需重启）？(Y/N): "
    if /i "%convert%"=="Y" (
        call :ConvertWithFullPath
    ) else (
        echo.
        echo 请关闭本窗口，重新打开命令行后运行：
        echo 📄_批量转换MD为PDF.bat
        pause
    )
)

exit /b 0

:: 刷新环境变量函数
:RefreshEnv
for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "SysPath=%%b"
for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "UserPath=%%b"
set "PATH=%SysPath%;%UserPath%"
goto :eof

:: 使用完整路径转换函数
:ConvertWithFullPath
cls
echo ╔════════════════════════════════════════════════════╗
echo ║      开始批量转换（使用完整路径）                 ║
echo ╚════════════════════════════════════════════════════╝
echo.

cd /d "c:\Users\EricZ\CodeBuddy\AIWEB1"

:: 尝试常见路径
set PANDOC_EXE=
if exist "C:\Program Files\Pandoc\pandoc.exe" set PANDOC_EXE=C:\Program Files\Pandoc\pandoc.exe
if exist "C:\Program Files (x86)\Pandoc\pandoc.exe" set PANDOC_EXE=C:\Program Files (x86)\Pandoc\pandoc.exe
if exist "%LOCALAPPDATA%\Pandoc\pandoc.exe" set PANDOC_EXE=%LOCALAPPDATA%\Pandoc\pandoc.exe

if not defined PANDOC_EXE (
    echo ❌ 未找到 pandoc.exe
    echo 请重新运行安装
    pause
    goto :eof
)

echo 📍 找到 Pandoc: %PANDOC_EXE%
echo.

if not exist "PDF文档" mkdir "PDF文档"

set count=0
for %%f in (📘_*.md 🎊_*.md 📖_*.md 📊_*.md) do (
    if exist "%%f" (
        echo 📄 正在转换: %%f
        set /a count+=1
        
        "%PANDOC_EXE%" "%%f" -o "PDF文档\%%~nf.pdf" --pdf-engine=xelatex -V CJKmainfont="Microsoft YaHei" -V geometry:margin=1in --toc -V colorlinks=true 2>nul
        
        if !errorlevel! equ 0 (
            echo    ✅ 成功
        ) else (
            echo    ❌ 失败
        )
        echo.
    )
)

echo ════════════════════════════════════════════════════
echo 转换完成！共处理 %count% 个文件
echo PDF文件已保存到 "PDF文档" 目录
echo ════════════════════════════════════════════════════

explorer "PDF文档"
pause
goto :eof
