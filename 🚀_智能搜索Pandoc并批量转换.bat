@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
cls
echo ╔════════════════════════════════════════════════════╗
echo ║    智能搜索 Pandoc 并批量转换 PDF                 ║
echo ╚════════════════════════════════════════════════════╝
echo.

echo 🔍 正在搜索 Pandoc 安装位置...
echo.

set PANDOC_EXE=

:: 方法1: 尝试命令行
where pandoc >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('where pandoc') do (
        set PANDOC_EXE=%%i
        echo ✅ 方法1成功: 在环境变量中找到
        echo    路径: !PANDOC_EXE!
        goto :found
    )
)

:: 方法2: 检查标准安装位置
echo ⏳ 方法1失败，尝试方法2: 检查标准路径...
if exist "C:\Program Files\Pandoc\pandoc.exe" (
    set PANDOC_EXE=C:\Program Files\Pandoc\pandoc.exe
    echo ✅ 方法2成功: Program Files
    goto :found
)

if exist "C:\Program Files (x86)\Pandoc\pandoc.exe" (
    set PANDOC_EXE=C:\Program Files (x86)\Pandoc\pandoc.exe
    echo ✅ 方法2成功: Program Files (x86)
    goto :found
)

:: 方法3: 检查用户目录
echo ⏳ 方法2失败，尝试方法3: 检查用户目录...
if exist "%LOCALAPPDATA%\Pandoc\pandoc.exe" (
    set PANDOC_EXE=%LOCALAPPDATA%\Pandoc\pandoc.exe
    echo ✅ 方法3成功: LocalAppData
    goto :found
)

if exist "%APPDATA%\Pandoc\pandoc.exe" (
    set PANDOC_EXE=%APPDATA%\Pandoc\pandoc.exe
    echo ✅ 方法3成功: AppData
    goto :found
)

if exist "%USERPROFILE%\Pandoc\pandoc.exe" (
    set PANDOC_EXE=%USERPROFILE%\Pandoc\pandoc.exe
    echo ✅ 方法3成功: UserProfile
    goto :found
)

:: 方法4: 使用PowerShell快速搜索常见目录
echo ⏳ 方法3失败，尝试方法4: PowerShell搜索...
for /f "delims=" %%i in ('powershell -Command "Get-ChildItem -Path 'C:\Program Files','C:\Program Files (x86)','%LOCALAPPDATA%','%APPDATA%' -Filter pandoc.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName" 2^>nul') do (
    set PANDOC_EXE=%%i
    if not "!PANDOC_EXE!"=="" (
        echo ✅ 方法4成功: PowerShell搜索
        goto :found
    )
)

:: 方法5: 检查下载文件夹中的便携版
echo ⏳ 方法4失败，尝试方法5: 检查下载文件夹...
if exist "%USERPROFILE%\Downloads\pandoc-*\pandoc.exe" (
    for /f "delims=" %%i in ('dir /s /b "%USERPROFILE%\Downloads\pandoc.exe" 2^>nul') do (
        set PANDOC_EXE=%%i
        echo ✅ 方法5成功: 下载文件夹中的便携版
        goto :found
    )
)

:: 未找到
echo.
echo ════════════════════════════════════════════════════
echo ❌ 未找到 Pandoc
echo ════════════════════════════════════════════════════
echo.
echo 可能的原因：
echo   1. 安装未成功完成
echo   2. 安装到了非标准位置
echo   3. 安装文件已被删除
echo.
echo 建议：
echo   1. 重新下载并安装 Pandoc
echo   2. 使用便携版 ZIP 文件
echo.
set /p download="是否打开下载页面？(Y/N): "
if /i "%download%"=="Y" (
    start https://github.com/jgm/pandoc/releases/latest
)
pause
exit /b 1

:found
echo.
echo ════════════════════════════════════════════════════
echo ✅ 找到 Pandoc！
echo ════════════════════════════════════════════════════
echo.
echo 📍 路径: !PANDOC_EXE!
echo.

:: 测试Pandoc是否可用
"!PANDOC_EXE!" --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Pandoc 文件存在但无法运行
    echo.
    pause
    exit /b 1
)

echo ✅ Pandoc 可以正常运行
echo.
echo 版本信息:
"!PANDOC_EXE!" --version | findstr /C:"pandoc"
echo.

:: 开始批量转换
echo ════════════════════════════════════════════════════
echo 🚀 开始批量转换 Markdown → PDF
echo ════════════════════════════════════════════════════
echo.

cd /d "c:\Users\EricZ\CodeBuddy\AIWEB1"

if not exist "PDF文档" mkdir "PDF文档"

set count=0
set success=0
set failed=0

for %%f in (📘_*.md 🎊_*.md 📖_*.md 📊_*.md) do (
    if exist "%%f" (
        set /a count+=1
        echo [!count!] 📄 转换: %%f
        
        "!PANDOC_EXE!" "%%f" -o "PDF文档\%%~nf.pdf" --pdf-engine=xelatex -V CJKmainfont="Microsoft YaHei" -V geometry:margin=1in --toc -V colorlinks=true 2>nul
        
        if !errorlevel! equ 0 (
            echo      ✅ 成功
            set /a success+=1
        ) else (
            echo      ❌ 失败
            set /a failed+=1
        )
        echo.
    )
)

echo ════════════════════════════════════════════════════
echo 📊 转换统计
echo ════════════════════════════════════════════════════
echo.
echo   总文件数: !count!
echo   成功转换: !success!
echo   转换失败: !failed!
echo.
echo PDF文件已保存到: PDF文档
echo ════════════════════════════════════════════════════
echo.

if !success! gtr 0 (
    echo 🎉 转换完成！正在打开PDF文件夹...
    timeout /t 2 /nobreak > nul
    explorer "PDF文档"
) else (
    echo ⚠️  没有文件转换成功
    echo.
    echo 可能的原因:
    echo   1. 缺少 XeLaTeX（PDF引擎）
    echo   2. 缺少中文字体支持
    echo.
    echo 解决方法:
    echo   安装 MiKTeX: https://miktex.org/download
)

echo.
pause
