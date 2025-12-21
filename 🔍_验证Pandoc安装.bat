@echo off
chcp 65001 > nul
cls
echo ╔════════════════════════════════════════╗
echo ║      验证 Pandoc 安装状态             ║
echo ╚════════════════════════════════════════╝
echo.

echo 正在检查 Pandoc...
echo.

where pandoc >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Pandoc 未安装或未添加到环境变量
    echo.
    echo 📝 可能的原因：
    echo    1. 尚未安装 Pandoc
    echo    2. 安装后未重启命令行
    echo    3. 环境变量未正确配置
    echo.
    echo 💡 解决方法：
    echo    1. 如果刚安装，请关闭所有命令行窗口
    echo    2. 重新打开命令行
    echo    3. 再次运行本脚本
    echo.
    echo    或者运行：
    echo    🔗_Pandoc_Windows版本正确下载.bat
    echo.
    pause
    exit /b 1
)

echo ✅ Pandoc 已安装！
echo.
echo ════════════════════════════════════════
echo    详细信息：
echo ════════════════════════════════════════
echo.

pandoc --version

echo.
echo ════════════════════════════════════════
echo.

for /f "tokens=*" %%i in ('where pandoc') do (
    echo 📁 安装路径：%%i
)

echo.
echo ════════════════════════════════════════
echo    功能测试
echo ════════════════════════════════════════
echo.

echo 测试 Markdown 转换功能...
echo.

echo # 测试文档 > test_temp.md
echo 这是一个测试 >> test_temp.md
echo. >> test_temp.md
echo - 项目1 >> test_temp.md
echo - 项目2 >> test_temp.md

pandoc test_temp.md -o test_temp.html >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 基础转换功能：正常
    del test_temp.html >nul 2>&1
) else (
    echo ❌ 基础转换功能：异常
)

del test_temp.md >nul 2>&1

echo.
echo ════════════════════════════════════════
echo    下一步
echo ════════════════════════════════════════
echo.
echo 🚀 Pandoc 已就绪！可以开始批量转换了！
echo.
echo 运行以下脚本进行批量转换：
echo    📄_批量转换MD为PDF.bat
echo.
pause
