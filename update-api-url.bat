@echo off
chcp 65001 >nul
echo ========================================
echo   更新前端 API 地址
echo ========================================
echo.

set /p API_URL="请输入后端 API 地址（例如：https://xxx.railway.app）: "

if "%API_URL%"=="" (
    echo 错误：API 地址不能为空！
    pause
    exit /b 1
)

echo.
echo 正在更新配置文件...

cd /d "%~dp0"

REM 创建环境变量文件
(
echo VITE_API_BASE_URL=%API_URL%
) > .env.production

echo.
echo ========================================
echo   配置更新完成！
echo ========================================
echo.
echo API 地址已设置为: %API_URL%
echo.
echo 下一步：
echo 1. 运行 npm run build 重新构建前端
echo 2. 运行 deploy-to-vercel.bat 重新部署到 Vercel
echo.
pause
