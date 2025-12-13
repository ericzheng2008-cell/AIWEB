@echo off
chcp 65001 >nul
echo ========================================
echo   明升伟业网站 - Surge 部署
echo ========================================
echo.

cd /d "%~dp0"

echo [步骤1] 安装 Surge...
call npm install -g surge

echo.
echo [步骤2] 部署项目...
echo 首次使用需要输入邮箱和密码创建账号
echo.
cd dist
surge --domain mingsheng-website.surge.sh

echo.
echo ========================================
echo   部署完成！
echo   访问地址: https://mingsheng-website.surge.sh
echo ========================================
cd ..
pause
