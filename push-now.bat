@echo off
chcp 65001 >nul
echo ========================================
echo   推送到 GitHub
echo   仓库: https://github.com/ericzheng2008-cell/AIWEB
echo ========================================
echo.

cd /d "%~dp0"

echo [正在推送代码...]
git push -u origin main

if errorlevel 1 (
    echo.
    echo ========================================
    echo   推送失败！
    echo ========================================
    echo.
    echo 可能的原因：
    echo 1. 需要登录 GitHub
    echo 2. 权限不足
    echo.
    echo 解决方案：
    echo 1. 使用 GitHub Desktop 推送
    echo 2. 配置 Personal Access Token
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   推送成功！
echo ========================================
echo.
echo 代码已上传到：
echo https://github.com/ericzheng2008-cell/AIWEB
echo.
echo 下一步：在 Netlify 或 Vercel 导入此仓库
echo.
pause
