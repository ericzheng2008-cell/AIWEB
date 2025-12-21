@echo off
chcp 65001 > nul
cls
echo ╔════════════════════════════════════════════════════╗
echo ║         Pandoc 安装诊断工具                       ║
echo ╚════════════════════════════════════════════════════╝
echo.

echo 🔍 正在检查 Pandoc 安装...
echo.
echo ════════════════════════════════════════════════════

echo.
echo [1/5] 检查命令行是否识别 pandoc...
where pandoc >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 命令行可以识别 pandoc
    for /f "tokens=*" %%i in ('where pandoc') do echo     路径: %%i
    goto :success
) else (
    echo ❌ 命令行无法识别 pandoc 命令
)

echo.
echo [2/5] 检查常见安装位置...
set FOUND=0

if exist "C:\Program Files\Pandoc\pandoc.exe" (
    echo ✅ 找到: C:\Program Files\Pandoc\pandoc.exe
    set FOUND=1
    set PANDOC_PATH=C:\Program Files\Pandoc
)

if exist "C:\Program Files (x86)\Pandoc\pandoc.exe" (
    echo ✅ 找到: C:\Program Files (x86)\Pandoc\pandoc.exe
    set FOUND=1
    set PANDOC_PATH=C:\Program Files (x86)\Pandoc
)

if exist "%LOCALAPPDATA%\Pandoc\pandoc.exe" (
    echo ✅ 找到: %LOCALAPPDATA%\Pandoc\pandoc.exe
    set FOUND=1
    set PANDOC_PATH=%LOCALAPPDATA%\Pandoc
)

if exist "%APPDATA%\Pandoc\pandoc.exe" (
    echo ✅ 找到: %APPDATA%\Pandoc\pandoc.exe
    set FOUND=1
    set PANDOC_PATH=%APPDATA%\Pandoc
)

if %FOUND%==0 (
    echo ❌ 未在常见位置找到 pandoc.exe
    goto :search_all
)

echo.
echo [3/5] 测试 Pandoc 是否可执行...
"%PANDOC_PATH%\pandoc.exe" --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Pandoc 可以正常运行
    goto :fix_path
) else (
    echo ❌ Pandoc 无法运行
    goto :reinstall_needed
)

:search_all
echo.
echo [3/5] 在整个 C 盘搜索 pandoc.exe...
echo     （这可能需要1-2分钟，请耐心等待）
echo.
for /f "delims=" %%i in ('dir /s /b "C:\pandoc.exe" 2^>nul') do (
    echo ✅ 找到: %%i
    set FOUND=1
    set PANDOC_PATH=%%~dpi
    goto :found_by_search
)

:found_by_search
if %FOUND%==1 goto :fix_path
goto :reinstall_needed

:fix_path
echo.
echo [4/5] 检查环境变量...
echo     Pandoc 位置: %PANDOC_PATH%
echo.
echo %PATH% | find /i "%PANDOC_PATH%" >nul
if %errorlevel% equ 0 (
    echo ✅ 环境变量中已包含 Pandoc 路径
    echo ⚠️  但命令行可能需要重启才能识别
    goto :restart_needed
) else (
    echo ❌ 环境变量中未包含 Pandoc 路径
    goto :add_to_path
)

:add_to_path
echo.
echo [5/5] 修复环境变量...
echo.
echo ════════════════════════════════════════════════════
echo    需要将 Pandoc 添加到环境变量
echo ════════════════════════════════════════════════════
echo.
echo 📝 方法1：自动添加（推荐）⭐
echo.
echo    我可以帮您自动添加，但需要管理员权限
echo.
set /p auto="是否自动添加到环境变量？(Y/N): "
if /i "%auto%"=="Y" (
    setx PATH "%PATH%;%PANDOC_PATH%" /M >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ 成功添加到系统环境变量！
        goto :restart_needed
    ) else (
        echo ❌ 需要管理员权限，请选择手动添加
        goto :manual_path
    )
)

:manual_path
echo.
echo 📝 方法2：手动添加
echo.
echo    请按照以下步骤操作：
echo.
echo    1. 复制这个路径：
echo       %PANDOC_PATH%
echo.
echo    2. 右键"此电脑" → 属性
echo    3. 高级系统设置 → 环境变量
echo    4. 在"系统变量"中找到 Path
echo    5. 点击"编辑" → "新建"
echo    6. 粘贴上面复制的路径
echo    7. 确定保存
echo    8. 重启命令行
echo.
set /p open="是否打开环境变量设置？(Y/N): "
if /i "%open%"=="Y" (
    rundll32 sysdm.cpl,EditEnvironmentVariables
)
goto :end_manual

:restart_needed
echo.
echo ════════════════════════════════════════════════════
echo    ✅ Pandoc 已正确安装！
echo ════════════════════════════════════════════════════
echo.
echo ⚠️  但需要重启命令行窗口才能使用
echo.
echo 📝 请按照以下步骤：
echo.
echo    1. 关闭本窗口
echo    2. 关闭所有其他命令行窗口
echo    3. 重新打开命令行
echo    4. 运行: 📄_批量转换MD为PDF.bat
echo.
echo 或者
echo.
echo    直接运行下面的临时转换命令...
echo.
set /p temp="是否使用临时路径立即开始转换？(Y/N): "
if /i "%temp%"=="Y" (
    goto :temp_convert
)
goto :end_success

:temp_convert
cls
echo ╔════════════════════════════════════════════════════╗
echo ║      使用临时路径开始批量转换                     ║
echo ╚════════════════════════════════════════════════════╝
echo.
cd /d "c:\Users\EricZ\CodeBuddy\AIWEB1"

if not exist "PDF文档" mkdir "PDF文档"

set count=0
for %%f in (📘_*.md 🎊_*.md 📖_*.md 📊_*.md) do (
    if exist "%%f" (
        echo 📄 正在转换: %%f
        set /a count+=1
        
        "%PANDOC_PATH%\pandoc.exe" "%%f" -o "PDF文档\%%~nf.pdf" --pdf-engine=xelatex -V CJKmainfont="Microsoft YaHei" -V geometry:margin=1in --toc -V colorlinks=true 2>nul
        
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
goto :end_success

:success
echo.
echo ════════════════════════════════════════════════════
echo    ✅ Pandoc 完美运行！
echo ════════════════════════════════════════════════════
echo.
pandoc --version
echo.
echo 🚀 可以立即开始批量转换了！
echo.
set /p convert="是否立即开始批量转换？(Y/N): "
if /i "%convert%"=="Y" (
    call "📄_批量转换MD为PDF.bat"
)
goto :end_success

:reinstall_needed
echo.
echo ════════════════════════════════════════════════════
echo    ❌ Pandoc 安装可能失败或不完整
echo ════════════════════════════════════════════════════
echo.
echo 📝 建议：重新安装
echo.
echo    1. 确认下载的是 .msi 文件（不是 .deb）
echo    2. 右键 .msi 文件 → "以管理员身份运行"
echo    3. 完成安装后重新运行本诊断脚本
echo.
set /p reopen="是否打开下载页面？(Y/N): "
if /i "%reopen%"=="Y" (
    start https://github.com/jgm/pandoc/releases/latest
)
goto :end_fail

:end_manual
echo.
pause
exit /b 1

:end_success
echo.
pause
exit /b 0

:end_fail
echo.
pause
exit /b 1
