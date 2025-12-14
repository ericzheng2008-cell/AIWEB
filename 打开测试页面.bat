@echo off
chcp 65001 >nul

echo ========================================
echo   打开Vue应用测试页面
echo ========================================
echo.

start http://localhost:3002/index-test.html

timeout /t 2 /nobreak >nul

echo ✅ 已打开测试页面
echo.
echo 请查看测试页面显示：
echo.
echo 情况1: 显示"Vue应用运行正常" ✅
echo        说明Vue本身没问题，是主应用代码问题
echo        请按F12查看Console的错误
echo.
echo 情况2: 显示"Vue应用启动失败" ❌
echo        说明Vue导入有问题
echo        请截图错误信息
echo.
echo 情况3: 空白或其他错误 ❌
echo        说明服务器或浏览器有问题
echo.

pause
