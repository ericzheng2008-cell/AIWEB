@echo off
chcp 65001 >nul
cls

echo ========================================
echo   诊断空白页问题
echo ========================================
echo.
echo 正在打开三个测试页面...
echo.

:: 1. 打开测试页面
echo [1] 打开静态测试页面...
start http://localhost:3002/test.html
timeout /t 2 /nobreak >nul

:: 2. 打开主应用
echo [2] 打开主应用...
start http://localhost:3002/
timeout /t 2 /nobreak >nul

:: 3. 打开检查指南
echo [3] 打开检查指南...
start 检查浏览器错误.html

echo.
echo ========================================
echo   请按照以下步骤操作：
echo ========================================
echo.
echo ✅ 步骤1：查看第一个标签页（test.html）
echo    - 如果能看到"服务器正常"，说明服务器OK
echo    - 如果空白，说明服务器有问题
echo.
echo ✅ 步骤2：切换到第二个标签页（主应用）
echo    - 按 F12 打开开发者工具
echo    - 点击 Console（控制台）标签
echo    - 把所有红色错误信息告诉我
echo.
echo ✅ 步骤3：查看 Network 标签
echo    - 按 Ctrl+R 刷新页面
echo    - 找出哪些文件是红色的（加载失败）
echo    - 把文件名告诉我
echo.
echo ========================================
echo.

pause
