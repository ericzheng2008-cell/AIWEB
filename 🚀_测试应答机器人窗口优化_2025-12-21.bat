@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🚀 测试应答机器人窗口高度优化
echo ========================================
echo.
echo ✅ 优化内容：
echo    - 聊天窗口高度：650px → 720px
echo    - 输入框完全可见，不再被遮挡
echo.
echo 📋 测试步骤：
echo    1. 点击右下角 AI 人形助手按钮
echo    2. 检查输入框是否完全可见
echo    3. 尝试输入文字并发送消息
echo    4. 测试语音输入功能
echo    5. 拖动窗口测试边界
echo.
echo ⏳ 正在启动开发服务器...
echo.

cd /d "%~dp0"

REM 强制清除缓存并重启
echo 🧹 清理缓存...
if exist "node_modules\.vite" rd /s /q "node_modules\.vite"
if exist "dist" rd /s /q "dist"

REM 检查端口占用
echo 🔍 检查端口占用...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173"') do (
    echo ❌ 发现端口5173被占用，尝试关闭...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo 🚀 启动开发服务器...
echo.
start "AIWEB Dev Server" cmd /k "npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   ✅ 服务器已启动
echo ========================================
echo.
echo 🌐 访问地址：http://localhost:5173
echo.
echo 📝 测试重点：
echo    ✅ 输入框完全可见
echo    ✅ 语音按钮正常显示
echo    ✅ 发送按钮正常显示
echo    ✅ 可以正常输入和发送消息
echo    ✅ 窗口拖动功能正常
echo.
echo 💡 提示：请在浏览器中按 Ctrl+Shift+R 强制刷新
echo.

REM 等待5秒后自动打开浏览器
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo.
echo 🎉 浏览器已打开，请开始测试！
echo.
echo ⚠️  测试完成后，关闭此窗口即可停止服务器
echo.
pause
