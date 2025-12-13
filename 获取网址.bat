@echo off
chcp 65001 >nul
cls
echo ========================================
echo   获取您的 Netlify 网站地址
echo ========================================
echo.

cd /d "%~dp0"

echo 正在查询...
echo.
echo ========================================
netlify sites:list
echo ========================================
echo.
echo 上方显示的就是您的网站地址
echo 复制 "URL" 列的地址即可访问
echo.
echo 或者运行以下命令查看详情：
echo netlify status
echo.
pause
