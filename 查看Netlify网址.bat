@echo off
chcp 65001 >nul
cls
echo ========================================
echo   查看 Netlify 网站地址
echo ========================================
echo.

cd /d "%~dp0"

echo 正在查询您的 Netlify 站点信息...
echo.
netlify status

echo.
echo ========================================
echo   或者访问 Netlify 控制台查看：
echo   https://app.netlify.com
echo ========================================
echo.
pause
