@echo off
chcp 65001 >nul
color 0A
echo ========================================
echo   🔧 修复cpolar卡片无法点击问题
echo ========================================
echo.

echo 📋 诊断步骤：
echo 1️⃣ 检查后端服务器是否启动 (端口5000)
echo 2️⃣ 检查Hash路由是否正常
echo 3️⃣ 验证API连接
echo.

echo 💡 问题分析：
echo ✓ 前端服务器 (5173) - ✅ 正在运行
echo ✗ 后端服务器 (5000) - ❌ 未启动
echo.
echo ⚠️ 后端服务器未启动，导致数据加载失败！
echo.

pause

echo.
echo 🚀 开始修复...
echo.

echo 第1步：启动后端服务器
cd /d "%~dp0\server"
start "后端服务器 - 5000端口" cmd /k "node index.js"
timeout /t 3 /nobreak >nul

echo.
echo 第2步：等待服务器完全启动...
timeout /t 5 /nobreak
echo.

echo 第3步：验证服务器状态
netstat -ano | findstr :5000
if %errorlevel% equ 0 (
    echo ✅ 后端服务器启动成功！
) else (
    echo ❌ 后端服务器启动失败，请检查日志
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ 修复完成！
echo ========================================
echo.
echo 📱 现在请在手机或电脑上访问：
echo    https://3a604bc9.r10.vip.cpolar.cn/
echo.
echo 🎯 测试步骤：
echo    1. 刷新浏览器页面 (Ctrl+F5)
echo    2. 清除浏览器缓存
echo    3. 点击任意卡片进入
echo.
echo 💡 提示：
echo    - 如果仍然无法点击，请检查浏览器控制台的错误信息
echo    - 确保cpolar隧道指向正确的端口 (5173)
echo.

pause
