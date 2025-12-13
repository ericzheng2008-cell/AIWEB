@echo off
chcp 65001 >nul
cls
echo ========================================
echo   使用 GitHub Pages 部署
echo   （如果 Netlify 访问有问题）
echo ========================================
echo.

cd /d "%~dp0"

echo 由于 Netlify 可能在您的网络环境下无法访问
echo 我们改用 GitHub Pages（更稳定）
echo.

echo [步骤1] 构建项目...
call npm run build

echo.
echo [步骤2] 创建部署分支...
git checkout -b gh-pages 2>nul || git checkout gh-pages

echo.
echo [步骤3] 复制构建文件...
xcopy /E /Y dist\* .

echo.
echo [步骤4] 提交更改...
git add .
git commit -m "部署到 GitHub Pages"

echo.
echo [步骤5] 推送到 GitHub...
git push origin gh-pages -f

echo.
echo ========================================
echo   部署完成！
echo ========================================
echo.
echo 下一步：
echo 1. 访问 https://github.com/ericzheng2008-cell/AIWEB/settings/pages
echo 2. 在 "Source" 下选择 "gh-pages" 分支
echo 3. 点击 Save
echo 4. 等待几分钟后访问：
echo    https://ericzheng2008-cell.github.io/AIWEB/
echo.
pause

git checkout main
