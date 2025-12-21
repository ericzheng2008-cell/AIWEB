@echo off
chcp 65001 >nul
title 🎯 测试手机端缓存问题 - 2025-12-21

echo.
echo ========================================
echo   📱 手机端缓存问题测试工具
echo ========================================
echo.
echo 🔍 正在检查项目状态...
echo.

:: 检查前端服务器
tasklist | find "node.exe" >nul
if %errorlevel% equ 0 (
    echo ✅ 前端服务器已启动
) else (
    echo ⚠️  前端服务器未启动，正在启动...
    start "AIWEB前端服务器" cmd /k "cd /d %~dp0 && npm run dev"
    timeout /t 5 >nul
)

:: 检查后端服务器
cd server
tasklist | find "node.exe" | find "server" >nul
if %errorlevel% equ 0 (
    echo ✅ 后端服务器已启动
) else (
    echo ⚠️  后端服务器未启动，正在启动...
    start "AIWEB后端服务器" cmd /k "cd /d %~dp0server && node server.js"
    timeout /t 3 >nul
)
cd ..

echo.
echo ========================================
echo   📋 测试步骤指南
echo ========================================
echo.
echo 【PC端操作】
echo 1. 访问后台: http://localhost:3000/admin
echo 2. 登录账号: admin / admin123
echo 3. 修改首页LOGO或公司名称
echo 4. 点击保存并查看前台效果
echo.
echo 【手机端操作】
echo 5. 手机浏览器访问(选择一个):
echo    - 局域网: http://%COMPUTERNAME%:3000
echo    - cpolar: 查看 🌐_所有测试地址_2025-12-21.md
echo.
echo 6. 查看内容是否与PC端一致
echo.
echo 【如果手机端内容未更新】
echo 7. 手机浏览器清除缓存:
echo    - iPhone Safari: 设置 → Safari → 清除历史记录
echo    - Android Chrome: 设置 → 隐私 → 清除浏览数据
echo    - 微信: 长按网址 → 在浏览器中打开
echo.
echo 8. 或访问清除缓存工具页:
echo    http://localhost:3000/clear-cache.html
echo.
echo ========================================
echo   🧪 自动化测试
echo ========================================
echo.
echo 是否打开浏览器进行测试? (Y/N)
set /p choice=请选择: 

if /i "%choice%"=="Y" (
    echo.
    echo 🌐 正在打开浏览器...
    
    :: 打开后台管理
    start "" "http://localhost:3000/admin"
    timeout /t 2 >nul
    
    :: 打开清除缓存工具
    start "" "http://localhost:3000/clear-cache.html"
    timeout /t 2 >nul
    
    :: 打开前台首页
    start "" "http://localhost:3000"
    
    echo.
    echo ✅ 浏览器已打开
    echo.
    echo 📱 请使用手机扫描以下二维码访问:
    echo    (需要在同一局域网)
    echo.
    echo 或手动输入: http://%COMPUTERNAME%:3000
)

echo.
echo ========================================
echo   📖 查看详细文档
echo ========================================
echo.
echo 1. 📖 手机端后台修改不同步解决指南
echo 2. 🔧 一键清除手机端缓存工具
echo 3. 🌐 所有测试地址汇总
echo.
set /p doc=请选择查看文档 (1-3) 或按回车跳过: 

if "%doc%"=="1" (
    start "" "📖_手机端后台修改不同步解决指南_2025-12-21.md"
) else if "%doc%"=="2" (
    start "" "http://localhost:3000/clear-cache.html"
) else if "%doc%"=="3" (
    start "" "🌐_所有测试地址_2025-12-21.md"
)

echo.
echo ========================================
echo   ✅ 测试工具已就绪
echo ========================================
echo.
echo 💡 提示:
echo - 后台修改后，PC端立即生效
echo - 手机端需要清除缓存才能看到更新
echo - 使用无痕模式可以验证是否为缓存问题
echo.
pause
