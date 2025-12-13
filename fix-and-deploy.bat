@echo off
chcp 65001 >nul
echo ========================================
echo   诊断并修复部署问题
echo ========================================
echo.

cd /d "%~dp0"

echo [检查1] 查看当前环境配置...
if exist .env.production (
    echo ✓ 找到生产环境配置文件
    type .env.production
) else (
    echo ✗ 未找到生产环境配置文件
)

echo.
echo [检查2] 清理旧的构建文件...
if exist dist (
    rmdir /s /q dist
    echo ✓ 已清理旧的构建文件
)

echo.
echo [检查3] 重新构建项目...
echo 这可能需要几分钟，请稍候...
call npm run build

if errorlevel 1 (
    echo.
    echo ========================================
    echo   构建失败！
    echo ========================================
    echo.
    echo 可能的原因：
    echo 1. node_modules 损坏
    echo 2. 依赖版本冲突
    echo.
    echo 建议：重新安装依赖
    echo npm install
    pause
    exit /b 1
)

echo.
echo ✓ 构建完成！
echo.

echo [检查4] 验证构建产物...
if exist dist\index.html (
    echo ✓ index.html 存在
) else (
    echo ✗ index.html 不存在！构建可能有问题
    pause
    exit /b 1
)

echo.
echo [步骤5] 部署到 Vercel...
echo.
vercel --prod --yes

if errorlevel 1 (
    echo.
    echo ========================================
    echo   部署失败！
    echo ========================================
    echo.
    echo 可能的原因：
    echo 1. Vercel CLI 未登录
    echo 2. 网络连接问题
    echo.
    echo 解决方案：
    echo 1. 运行：vercel login
    echo 2. 检查网络连接
    pause
    exit /b 1
)

echo.
echo ========================================
echo   部署完成！
echo ========================================
echo.
echo 网站地址: https://aiweb-gilt.vercel.app/
echo.
echo 现在请在浏览器中访问上述地址
echo 如果还是打不开，请截图错误信息
echo.
pause
