@echo off
chcp 65001 >nul
cls
echo ========================================
echo   部署到 Cloudflare Pages
echo   （Netlify 的最佳替代方案）
echo ========================================
echo.

cd /d "%~dp0"

echo Cloudflare Pages 特点：
echo ✓ 国内访问速度快
echo ✓ 完全免费
echo ✓ 自动 HTTPS
echo ✓ 全球 CDN
echo.

echo [步骤1] 构建项目...
call npm run build

echo.
echo [步骤2] 推送到 GitHub...
git add .
git commit -m "准备部署到 Cloudflare Pages"
git push origin main

echo.
echo ========================================
echo   代码已推送！
echo ========================================
echo.
echo 下一步（需要手动操作）：
echo.
echo 1. 访问：https://dash.cloudflare.com
echo 2. 注册/登录（免费）
echo 3. 点击 "Workers & Pages"
echo 4. 点击 "Create application"
echo 5. 选择 "Pages" → "Connect to Git"
echo 6. 选择您的 GitHub 仓库：AIWEB
echo 7. 设置：
echo    - Build command: npm run build
echo    - Build output: dist
echo 8. 点击 "Save and Deploy"
echo.
echo 5分钟后，您会获得类似这样的网址：
echo https://aiweb.pages.dev
echo.
pause
