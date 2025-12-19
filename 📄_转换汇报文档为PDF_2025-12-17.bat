@echo off
chcp 65001 >nul
echo ========================================
echo   AIWEB 汇报文档 PDF 转换工具
echo ========================================
echo.

echo 请选择转换方式：
echo.
echo [1] 使用 Pandoc 转换（推荐，需先安装Pandoc）
echo [2] 打开在线转换网站
echo [3] 使用 Typora 打开文档（需先安装Typora）
echo [4] 查看转换说明
echo [0] 退出
echo.

set /p choice=请输入选项 [0-4]: 

if "%choice%"=="1" goto pandoc
if "%choice%"=="2" goto online
if "%choice%"=="3" goto typora
if "%choice%"=="4" goto help
if "%choice%"=="0" exit
goto end

:pandoc
echo.
echo 正在使用 Pandoc 转换...
echo.

where pandoc >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Pandoc，请先安装！
    echo.
    echo 安装方法：
    echo   1. 访问 https://pandoc.org/installing.html
    echo   2. 下载并安装适合您系统的版本
    echo   3. 重启命令行后再运行本脚本
    echo.
    pause
    goto end
)

echo 开始转换，请稍候...
pandoc "📊_AIWEB网站完整汇报文档_2025-12-17_v1.0.md" ^
  -o "AIWEB网站完整汇报_2025-12-17.pdf" ^
  --pdf-engine=xelatex ^
  -V CJKmainfont="SimSun" ^
  -V geometry:margin=2cm ^
  --toc ^
  --toc-depth=2 ^
  -V documentclass=report ^
  -V fontsize=11pt

if %errorlevel% equ 0 (
    echo.
    echo ✓ 转换成功！
    echo 文件已保存为: AIWEB网站完整汇报_2025-12-17.pdf
    echo.
    echo 是否立即打开PDF文件？[Y/N]
    set /p open=
    if /i "%open%"=="Y" start "" "AIWEB网站完整汇报_2025-12-17.pdf"
) else (
    echo.
    echo [错误] 转换失败，可能原因：
    echo   1. 缺少中文字体（SimSun）
    echo   2. 缺少 XeLaTeX
    echo   3. 文档格式问题
    echo.
    echo 建议尝试方法2（在线转换）
)
pause
goto end

:online
echo.
echo 正在打开在线转换网站...
echo.
echo 推荐网站：
start https://www.markdowntopdf.com/
timeout /t 2 >nul
start https://cloudconvert.com/md-to-pdf
echo.
echo 使用步骤：
echo   1. 上传文件：📊_AIWEB网站完整汇报文档_2025-12-17_v1.0.md
echo   2. 点击"转换"按钮
echo   3. 下载生成的PDF文件
echo.
pause
goto end

:typora
echo.
echo 正在尝试用 Typora 打开文档...
echo.

if exist "C:\Program Files\Typora\Typora.exe" (
    start "" "C:\Program Files\Typora\Typora.exe" "📊_AIWEB网站完整汇报文档_2025-12-17_v1.0.md"
    echo.
    echo Typora 已打开，导出步骤：
    echo   1. 菜单栏 → 文件 → 导出 → PDF
    echo   2. 选择保存位置
    echo   3. 点击"保存"
) else (
    echo [错误] 未检测到 Typora
    echo.
    echo 下载地址：https://typora.io/
    echo 或尝试其他转换方式
)
echo.
pause
goto end

:help
echo.
echo ========================================
echo   PDF 转换完整说明
echo ========================================
echo.
echo 【方法1：Pandoc 命令行（最专业）】
echo   优点：自动化、可定制、批量转换
echo   缺点：需要安装配置
echo   
echo   安装步骤：
echo     1. 下载 Pandoc: https://pandoc.org/installing.html
echo     2. 下载 MiKTeX (XeLaTeX): https://miktex.org/download
echo     3. 重启命令行
echo     4. 运行本脚本选项1
echo.
echo 【方法2：在线工具（最简单）】
echo   优点：无需安装、即开即用
echo   缺点：需要上传文件、依赖网络
echo   
echo   推荐网站：
echo     - https://www.markdowntopdf.com/ (免费)
echo     - https://cloudconvert.com/md-to-pdf (免费)
echo     - https://www.sejda.com/markdown-to-pdf (免费)
echo.
echo 【方法3：Typora（最好看）】
echo   优点：所见即所得、支持实时预览
echo   缺点：软件付费（可试用）
echo   
echo   下载：https://typora.io/
echo   导出：文件 → 导出 → PDF
echo.
echo 【方法4：VSCode（程序员首选）】
echo   优点：免费、强大、可自定义
echo   缺点：需要安装插件
echo   
echo   步骤：
echo     1. 安装 VSCode
echo     2. 安装插件：Markdown PDF
echo     3. 右键 → Markdown PDF: Export (pdf)
echo.
echo ========================================
echo.
pause
goto end

:end
echo.
echo 感谢使用！
timeout /t 2 >nul
