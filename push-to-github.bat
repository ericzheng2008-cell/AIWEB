@echo off
chcp 65001 >nul
echo ========================================
echo   推送到 GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo 请先在 GitHub 创建仓库：https://github.com/new
echo.
echo 仓库创建后，请输入仓库地址
echo 例如：https://github.com/username/mingsheng-website.git
echo.
set /p REPO_URL="请输入你的 GitHub 仓库地址: "

if "%REPO_URL%"=="" (
    echo 错误：仓库地址不能为空！
    pause
    exit /b 1
)

echo.
echo [步骤1] 添加远程仓库...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo.
echo [步骤2] 推送代码到 GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo 推送失败！可能需要先登录 GitHub。
    echo 请尝试使用 GitHub Desktop 或配置 SSH 密钥。
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   推送成功！
echo   仓库地址: %REPO_URL%
echo.
echo   下一步：在 Netlify 或 Vercel 导入此仓库
echo ========================================
pause
