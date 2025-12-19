@echo off
chcp 65001 > nul
echo ========================================
echo    🚀 一键部署到 Netlify
echo ========================================
echo.

echo [1/3] 检查 Netlify CLI...
where netlify >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 未安装 Netlify CLI
    echo 📦 正在安装 Netlify CLI...
    call npm install -g netlify-cli
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ 安装失败！请手动安装：npm install -g netlify-cli
        pause
        exit /b 1
    )
    echo ✅ Netlify CLI 安装成功！
) else (
    echo ✅ Netlify CLI 已安装
)
echo.

echo [2/3] 项目已构建完成
echo 📁 输出目录：dist
echo.

echo [3/3] 开始部署...
echo.
netlify deploy --prod --dir=dist

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo    ✅ 部署成功！
    echo ========================================
    echo.
    echo 🔗 网站已发布，请查看上方输出的网址
    echo 💡 您可以将该网址分享给同事访问
    echo.
) else (
    echo.
    echo ========================================
    echo    ❌ 部署失败
    echo ========================================
    echo.
    echo 💡 替代方案：使用 Netlify Drop
    echo    1. 访问：https://app.netlify.com/drop
    echo    2. 拖拽 dist 文件夹到网页中
    echo    3. 即可获得访问链接
    echo.
)

pause
