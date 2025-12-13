@echo off
chcp 65001 >nul
cls
echo ========================================
echo   部署到 Netlify
echo ========================================
echo.

cd /d "%~dp0"

echo [步骤 1/5] 检查 Netlify CLI...
netlify --version >nul 2>&1
if errorlevel 1 (
    echo Netlify CLI 未安装，正在安装...
    call npm install -g netlify-cli
    if errorlevel 1 (
        echo.
        echo ✗ 安装失败！
        echo 请手动安装：npm install -g netlify-cli
        pause
        exit /b 1
    )
)
echo ✓ Netlify CLI 已安装

echo.
echo [步骤 2/5] 清理旧构建...
if exist dist (
    rmdir /s /q dist
)
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
)
echo ✓ 清理完成

echo.
echo [步骤 3/5] 构建项目...
echo 这可能需要 1-2 分钟...
echo.
call npm run build

if errorlevel 1 (
    echo.
    echo ✗ 构建失败！
    pause
    exit /b 1
)
echo ✓ 构建完成

echo.
echo [步骤 4/5] 登录 Netlify...
echo 浏览器将自动打开，请完成授权
echo.
netlify login

echo.
echo [步骤 5/5] 部署到 Netlify...
echo.
netlify deploy --prod --dir=dist

echo.
echo ========================================
echo   🎉 部署完成！
echo ========================================
echo.
echo 您的网站地址将显示在上方
echo 格式类似：https://xxx.netlify.app
echo.
echo 复制该地址即可访问！
echo.
pause
