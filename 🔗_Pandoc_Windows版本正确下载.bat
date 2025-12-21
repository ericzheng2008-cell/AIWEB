@echo off
chcp 65001 > nul
cls
echo ╔════════════════════════════════════════════════════╗
echo ║     Pandoc Windows 版本下载指南                   ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo ⚠️  注意：请下载 .msi 或 .zip 格式（Windows版本）
echo ❌  不要下载 .deb 格式（这是Linux版本）
echo.
echo ════════════════════════════════════════════════════
echo    请选择下载方式：
echo ════════════════════════════════════════════════════
echo.
echo [1] 打开官方发布页（手动选择 Windows 版本）⭐推荐
echo [2] 直接下载 Windows 64位 MSI 安装包
echo [3] 直接下载 Windows 便携版 ZIP（免安装）
echo [4] 查看如何识别正确的文件
echo [5] 退出
echo.
set /p choice="请输入选项 (1-5): "

if "%choice%"=="1" goto official_page
if "%choice%"=="2" goto download_msi
if "%choice%"=="3" goto download_zip
if "%choice%"=="4" goto show_guide
if "%choice%"=="5" goto end

:official_page
cls
echo ╔════════════════════════════════════════════════════╗
echo ║         打开官方发布页                            ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo 🌐 正在打开 GitHub 发布页...
echo.
echo 📝 下载步骤：
echo.
echo 1. 页面打开后，向下滚动到 "Assets" 部分
echo.
echo 2. 找到并点击以下文件之一：
echo    ✅ pandoc-3.1.11.1-windows-x86_64.msi     （64位安装版）
echo    ✅ pandoc-3.1.11.1-windows-i386.msi       （32位安装版）
echo    ✅ pandoc-3.1.11.1-windows-x86_64.zip     （64位便携版）
echo.
echo 3. ❌ 不要点击这些文件（Linux版本）：
echo    ❌ pandoc-3.1.11.1-amd64.deb              （Debian/Ubuntu）
echo    ❌ pandoc-3.1.11.1-arm64.deb              （ARM Linux）
echo    ❌ pandoc-3.1.11.1-linux-amd64.tar.gz     （Linux）
echo.
echo 按任意键打开页面...
pause > nul
start https://github.com/jgm/pandoc/releases/latest
goto end

:download_msi
cls
echo ╔════════════════════════════════════════════════════╗
echo ║    下载 Windows 64位 MSI 安装包                   ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo 📥 文件信息：
echo    名称：pandoc-3.1.11.1-windows-x86_64.msi
echo    大小：约 30MB
echo    格式：MSI（Windows 安装程序）
echo    适用：Windows 64位系统
echo.
echo 🔗 下载链接：
echo    https://github.com/jgm/pandoc/releases/download/3.1.11.1/pandoc-3.1.11.1-windows-x86_64.msi
echo.
echo 📝 下载后：
echo    1. 找到下载的 .msi 文件
echo    2. 双击运行安装程序
echo    3. 一路点击"下一步"
echo    4. 安装完成！
echo.
echo 按任意键开始下载...
pause > nul
start https://github.com/jgm/pandoc/releases/download/3.1.11.1/pandoc-3.1.11.1-windows-x86_64.msi
goto end

:download_zip
cls
echo ╔════════════════════════════════════════════════════╗
echo ║    下载 Windows 便携版 ZIP（免安装）              ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo 📥 文件信息：
echo    名称：pandoc-3.1.11.1-windows-x86_64.zip
echo    大小：约 35MB
echo    格式：ZIP（压缩包，免安装）
echo    适用：Windows 64位系统
echo.
echo 🔗 下载链接：
echo    https://github.com/jgm/pandoc/releases/download/3.1.11.1/pandoc-3.1.11.1-windows-x86_64.zip
echo.
echo 📝 使用方法：
echo    1. 下载 .zip 文件
echo    2. 解压到任意文件夹（如：C:\Pandoc）
echo    3. 将 pandoc.exe 所在文件夹添加到系统环境变量
echo    4. 重启命令行即可使用
echo.
echo 按任意键开始下载...
pause > nul
start https://github.com/jgm/pandoc/releases/download/3.1.11.1/pandoc-3.1.11.1-windows-x86_64.zip
goto end

:show_guide
cls
echo ╔════════════════════════════════════════════════════╗
echo ║      如何识别正确的 Windows 版本文件              ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo ✅ Windows 版本文件名特征：
echo ════════════════════════════════════════════════════
echo.
echo 📦 安装版（推荐新手）：
echo    ✅ pandoc-X.X.X-windows-x86_64.msi
echo    ✅ pandoc-X.X.X-windows-i386.msi
echo       └─ 关键词：windows + .msi
echo.
echo 📦 便携版（免安装）：
echo    ✅ pandoc-X.X.X-windows-x86_64.zip
echo       └─ 关键词：windows + .zip
echo.
echo ════════════════════════════════════════════════════
echo.
echo ❌ Linux 版本文件名（不要下载）：
echo ════════════════════════════════════════════════════
echo.
echo    ❌ pandoc-X.X.X-amd64.deb           ← Debian/Ubuntu
echo    ❌ pandoc-X.X.X-arm64.deb           ← ARM Linux
echo    ❌ pandoc-X.X.X-linux-amd64.tar.gz  ← Linux 通用
echo    ❌ pandoc-X.X.X-1.fc38.x86_64.rpm   ← Fedora/RedHat
echo       └─ 关键词：.deb / linux / .rpm
echo.
echo ════════════════════════════════════════════════════
echo.
echo ❌ macOS 版本文件名（不要下载）：
echo ════════════════════════════════════════════════════
echo.
echo    ❌ pandoc-X.X.X-x86_64-macOS.pkg    ← macOS Intel
echo    ❌ pandoc-X.X.X-arm64-macOS.pkg     ← macOS M1/M2
echo       └─ 关键词：macOS / .pkg
echo.
echo ════════════════════════════════════════════════════
echo.
echo 💡 记忆技巧：
echo    ✓ 看到 "windows" + ".msi" → 正确！✅
echo    ✓ 看到 "windows" + ".zip" → 也可以！✅
echo    ✗ 看到 ".deb" → 错误！❌
echo    ✗ 看到 "linux" → 错误！❌
echo    ✗ 看到 ".pkg" → 错误！❌
echo.
echo ════════════════════════════════════════════════════
echo.
pause
goto :eof

:end
echo.
echo ════════════════════════════════════════════════════
echo 💡 提示：
echo    下载完成后，运行：
echo    🔧_快速安装Pandoc并转换PDF.bat
echo ════════════════════════════════════════════════════
echo.
pause
