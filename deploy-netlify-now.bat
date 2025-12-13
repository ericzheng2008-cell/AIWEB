@echo off
chcp 65001 >nul
cls
echo ========================================
echo   部署到 Netlify（Vercel 的替代方案）
echo ========================================
echo.

cd /d "%~dp0"

echo Netlify 是另一个优秀的免费部署平台
echo 特点：
echo ✓ 完全免费
echo ✓ 国内访问速度更快
echo ✓ 部署简单
echo.

echo [检查] 是否已安装 Netlify CLI...
netlify --version >nul 2>&1
if errorlevel 1 (
    echo 未安装，正在安装 Netlify CLI...
    npm install -g netlify-cli
)

echo.
echo [步骤1] 构建项目...
if not exist dist (
    echo 正在构建...
    call npm run build
)

echo.
echo [步骤2] 登录 Netlify...
echo 浏览器将自动打开，请完成授权
netlify login

echo.
echo [步骤3] 部署到 Netlify...
netlify deploy --prod --dir=dist

echo.
echo ========================================
echo   部署完成！
echo   Netlify 域名将显示在上方
echo ========================================
echo.
echo 复制上面显示的 Website URL 即可访问
echo 例如：https://xxx.netlify.app
echo.
pause
