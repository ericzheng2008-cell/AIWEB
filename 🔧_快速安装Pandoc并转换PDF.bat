@echo off
chcp 65001 > nul
cls
echo ╔════════════════════════════════════════╗
echo ║   AIWEB Markdown 转 PDF 安装向导      ║
echo ╚════════════════════════════════════════╝
echo.

:: 检查Pandoc是否已安装
where pandoc >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Pandoc 已安装！
    pandoc --version | findstr /C:"pandoc"
    echo.
    echo 🚀 开始批量转换...
    timeout /t 2 /nobreak > nul
    call "📄_批量转换MD为PDF.bat"
    exit /b 0
)

:: Pandoc未安装，提供安装选项
echo ❌ 未检测到 Pandoc
echo.
echo ═══════════════════════════════════════
echo    选择安装方式：
echo ═══════════════════════════════════════
echo.
echo [1] 自动下载并打开安装包（推荐）⭐
echo [2] 手动访问官网下载
echo [3] 查看安装教程
echo [4] 取消
echo.
set /p choice="请输入选项 (1-4): "

if "%choice%"=="1" goto auto_download
if "%choice%"=="2" goto manual_download
if "%choice%"=="3" goto show_tutorial
if "%choice%"=="4" goto cancel

:auto_download
echo.
echo 🌐 正在打开下载链接...
echo 📥 文件名：pandoc-3.1.11.1-windows-x86_64.msi
echo 📦 大小：约 30MB
echo.
echo 下载完成后：
echo   1. 双击安装包
echo   2. 一路点击"下一步"
echo   3. 安装完成后，重新运行本脚本
echo.
timeout /t 3 /nobreak > nul
start https://github.com/jgm/pandoc/releases/latest/download/pandoc-3.1.11.1-windows-x86_64.msi
goto end

:manual_download
echo.
echo 🌐 打开官方下载页面...
timeout /t 2 /nobreak > nul
start https://pandoc.org/installing.html
echo.
echo 请在浏览器中下载 Windows 版本的安装包
goto end

:show_tutorial
cls
echo ╔════════════════════════════════════════╗
echo ║        Pandoc 安装教程               ║
echo ╚════════════════════════════════════════╝
echo.
echo 📋 安装步骤（5分钟）：
echo.
echo 1️⃣  下载安装包
echo    🔗 https://github.com/jgm/pandoc/releases/latest/download/pandoc-3.1.11.1-windows-x86_64.msi
echo.
echo 2️⃣  双击下载的 .msi 文件
echo.
echo 3️⃣  安装向导：
echo    ✓ 点击 "Next"
echo    ✓ 接受许可协议
echo    ✓ 选择安装位置（默认即可）
echo    ✓ 点击 "Install"
echo    ✓ 等待安装完成
echo    ✓ 点击 "Finish"
echo.
echo 4️⃣  验证安装：
echo    ✓ 打开新的命令提示符
echo    ✓ 输入：pandoc --version
echo    ✓ 看到版本号即安装成功
echo.
echo 5️⃣  重新运行本脚本
echo.
echo ═══════════════════════════════════════
echo.
set /p open="是否立即打开下载页面？(Y/N): "
if /i "%open%"=="Y" (
    start https://github.com/jgm/pandoc/releases/latest/download/pandoc-3.1.11.1-windows-x86_64.msi
)
goto end

:cancel
echo.
echo ❌ 已取消
goto end

:end
echo.
echo ═══════════════════════════════════════
echo 💡 提示：
echo    安装完成后，请重新运行本脚本
echo    或者直接运行 "📄_批量转换MD为PDF.bat"
echo ═══════════════════════════════════════
echo.
pause
