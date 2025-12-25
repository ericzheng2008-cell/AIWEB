@echo off
chcp 65001 >nul
title ⚡ 一键修复Vercel手机端卡片问题

echo.
echo ================================================
echo    ⚡ Vercel手机端卡片问题一键修复工具
echo ================================================
echo.
echo 📱 问题网址: https://aiweb-1.vercel.app
echo 🔧 修复内容: 卡片触摸事件 + CSS样式优化
echo.
echo 开始执行修复流程...
echo.

:: 1. 检查当前状态
echo [1/6] 检查Git状态...
git status
echo.

:: 2. 拉取最新代码
echo [2/6] 拉取最新代码...
git pull origin main
echo.

:: 3. 添加所有修改
echo [3/6] 添加修改文件...
git add .
echo.

:: 4. 提交修改
echo [4/6] 提交修改...
git commit -m "fix: 修复Vercel手机端卡片触摸事件和样式 - 2025-12-25"
if errorlevel 1 (
    echo ⚠️  没有需要提交的修改
    echo.
)

:: 5. 推送到GitHub
echo [5/6] 推送到GitHub (触发Vercel自动部署)...
git push origin main
if errorlevel 1 (
    echo ❌ 推送失败，请检查网络连接
    pause
    exit /b 1
)
echo.

:: 6. 等待Vercel部署
echo [6/6] 等待Vercel自动部署...
echo.
echo ⏱️  预计等待时间: 2-3分钟
echo 🌐 部署进度: https://vercel.com/dashboard
echo.
echo 倒计时: 120秒
timeout /t 120 /nobreak
echo.

:: 完成
echo.
echo ================================================
echo    ✅ 修复流程完成!
echo ================================================
echo.
echo 📝 接下来请执行:
echo.
echo 1️⃣  访问Vercel查看部署状态
echo     https://vercel.com/dashboard
echo.
echo 2️⃣  清除手机浏览器缓存
echo     - Safari: 设置 → Safari → 清除历史记录
echo     - Chrome: 设置 → 隐私 → 清除浏览数据
echo.
echo 3️⃣  访问网站测试卡片功能
echo     https://aiweb-1.vercel.app
echo.
echo 4️⃣  测试以下功能:
echo     ✓ 智能体卡片点击
echo     ✓ 营销中台卡片点击
echo     ✓ 工作平台卡片点击
echo     ✓ 产品系列卡片点击
echo.
echo ================================================
echo.

:: 选择下一步操作
echo 请选择下一步操作:
echo [1] 打开Vercel控制台
echo [2] 访问测试网站
echo [3] 打开诊断页面
echo [4] 退出
echo.
set /p choice="请输入选项 (1-4): "

if "%choice%"=="1" (
    start https://vercel.com/dashboard
) else if "%choice%"=="2" (
    start https://aiweb-1.vercel.app
) else if "%choice%"=="3" (
    start 🔍_诊断Vercel手机端卡片问题_2025-12-25.html
) else if "%choice%"=="4" (
    exit /b 0
)

pause
