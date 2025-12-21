@echo off
chcp 65001 > nul
echo ========================================
echo    AIWEB Markdown 转 PDF 工具
echo ========================================
echo.

:: 检查是否安装了pandoc
where pandoc >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未检测到 Pandoc
    echo.
    echo 📥 请先安装 Pandoc（5分钟）：
    echo.
    echo 方法1：直接下载（推荐）
    echo    🔗 https://github.com/jgm/pandoc/releases/latest/download/pandoc-3.1.11.1-windows-x86_64.msi
    echo.
    echo 方法2：访问官网
    echo    🔗 https://pandoc.org/installing.html
    echo.
    echo 📝 安装步骤：
    echo    1. 点击上面的链接下载 .msi 文件
    echo    2. 双击安装包，一路"下一步"
    echo    3. 安装完成后，重新运行本脚本
    echo.
    echo 按任意键打开下载页面...
    pause > nul
    start https://github.com/jgm/pandoc/releases/latest/download/pandoc-3.1.11.1-windows-x86_64.msi
    exit /b 1
)

echo ✅ Pandoc 已安装
echo.
echo 开始转换 Markdown 文件...
echo.

:: 创建PDF输出目录
if not exist "PDF文档" mkdir "PDF文档"

:: 统计转换数量
set count=0

:: 转换所有📘开头的Markdown文件
for %%f in (📘_*.md) do (
    echo 📄 正在转换: %%f
    set /a count+=1
    
    :: 使用pandoc转换，支持中文
    pandoc "%%f" -o "PDF文档\%%~nf.pdf" ^
        --pdf-engine=xelatex ^
        -V CJKmainfont="Microsoft YaHei" ^
        -V geometry:margin=1in ^
        --toc ^
        --toc-depth=3 ^
        -V colorlinks=true ^
        -V linkcolor=blue ^
        -V urlcolor=blue
    
    if %errorlevel% equ 0 (
        echo    ✅ 成功
    ) else (
        echo    ❌ 失败
    )
    echo.
)

:: 转换其他重要文档
for %%f in (🎊_*.md 📖_*.md 📊_*.md) do (
    if exist "%%f" (
        echo 📄 正在转换: %%f
        set /a count+=1
        
        pandoc "%%f" -o "PDF文档\%%~nf.pdf" ^
            --pdf-engine=xelatex ^
            -V CJKmainfont="Microsoft YaHei" ^
            -V geometry:margin=1in ^
            --toc ^
            -V colorlinks=true
        
        if %errorlevel% equ 0 (
            echo    ✅ 成功
        ) else (
            echo    ❌ 失败
        )
        echo.
    )
)

echo ========================================
echo 转换完成！共处理 %count% 个文件
echo PDF文件已保存到 "PDF文档" 目录
echo ========================================
echo.

:: 打开输出目录
explorer "PDF文档"

pause
