@echo off
chcp 65001 >nul
echo ========================================
echo   部署后端到 Railway
echo ========================================
echo.

cd /d "%~dp0"

echo [步骤1] 检查 Railway CLI...
railway --version >nul 2>&1
if errorlevel 1 (
    echo Railway CLI 未安装，正在安装...
    npm install -g @railway/cli
    if errorlevel 1 (
        echo.
        echo 安装失败！请手动安装：
        echo npm install -g @railway/cli
        pause
        exit /b 1
    )
)

echo.
echo [步骤2] 登录 Railway...
echo 浏览器将自动打开，请完成授权
railway login

echo.
echo [步骤3] 进入 server 目录...
cd server

echo.
echo [步骤4] 初始化 Railway 项目...
echo 如果已初始化，可以跳过此步骤
railway init

echo.
echo [步骤5] 部署后端...
railway up

echo.
echo [步骤6] 生成域名...
railway domain

echo.
echo ========================================
echo   后端部署完成！
echo ========================================
echo.
echo 请复制上面显示的域名（类似 xxx.railway.app）
echo 这个域名将作为您的 API 地址
echo.
echo 下一步：
echo 1. 记录这个域名
echo 2. 运行 update-api-url.bat 更新前端配置
echo.
pause
