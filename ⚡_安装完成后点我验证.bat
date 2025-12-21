@echo off
chcp 65001 > nul
cls
echo ╔════════════════════════════════════════════════════╗
echo ║   验证 Pandoc 安装 并 自动开始批量转换            ║
echo ╚════════════════════════════════════════════════════╝
echo.

echo 🔍 正在检查 Pandoc 安装状态...
echo.

:: 检查Pandoc是否可用
where pandoc >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Pandoc
    echo.
    echo ⚠️  请检查：
    echo    1. 是否已完成安装？
    echo    2. 安装完成后需要关闭并重新打开命令行
    echo.
    echo 💡 解决方法：
    echo    1. 确认安装已完成
    echo    2. 关闭本窗口
    echo    3. 重新双击运行本脚本
    echo.
    pause
    exit /b 1
)

:: 显示版本信息
echo ✅ Pandoc 安装成功！
echo.
echo ════════════════════════════════════════════════════
pandoc --version
echo ════════════════════════════════════════════════════
echo.

:: 等待2秒
echo 🚀 准备开始批量转换...
timeout /t 2 /nobreak > nul

:: 自动调用批量转换脚本
echo.
echo ════════════════════════════════════════════════════
echo    开始批量转换 Markdown 为 PDF
echo ════════════════════════════════════════════════════
echo.

call "📄_批量转换MD为PDF.bat"
