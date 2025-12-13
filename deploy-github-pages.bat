@echo off
chcp 65001 >nul
cls
echo ========================================
echo   部署到 GitHub Pages（免费）
echo ========================================
echo.

cd /d "%~dp0"

echo GitHub Pages 部署指南：
echo.
echo 1. 确保代码已推送到 GitHub
echo 2. 访问：https://github.com/ericzheng2008-cell/AIWEB/settings/pages
echo 3. 选择 Branch: main
echo 4. 选择 Folder: /dist
echo 5. 点击 Save
echo.
echo 部署完成后，访问地址将是：
echo https://ericzheng2008-cell.github.io/AIWEB/
echo.

echo.
echo [步骤1] 构建项目...
call npm run build

echo.
echo [步骤2] 推送到 GitHub...
git add dist -f
git commit -m "build: 添加构建产物用于 GitHub Pages"
git push origin main

echo.
echo ========================================
echo   构建完成！
echo ========================================
echo.
echo 下一步：
echo 1. 访问 GitHub 仓库设置
echo 2. 启用 GitHub Pages
echo 3. 几分钟后访问网站
echo.
pause
