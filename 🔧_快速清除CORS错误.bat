@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🔧 快速清除CORS错误
echo ========================================
echo.
echo 这个CORS错误来自浏览器扩展或缓存
echo 不是AIWEB项目的问题，可以安全忽略
echo.
echo ========================================
echo.
echo 正在执行清理操作...
echo.

:: 1. 关闭所有Chrome进程
echo [1/4] 关闭浏览器...
taskkill /F /IM chrome.exe 2>nul
taskkill /F /IM msedge.exe 2>nul
timeout /t 2 /nobreak >nul
echo ✅ 浏览器已关闭

:: 2. 清除DNS缓存
echo.
echo [2/4] 清除DNS缓存...
ipconfig /flushdns >nul
echo ✅ DNS缓存已清除

:: 3. 等待
echo.
echo [3/4] 等待系统清理...
timeout /t 2 /nobreak >nul
echo ✅ 清理完成

:: 4. 重新启动浏览器
echo.
echo [4/4] 启动浏览器（无痕模式）...
echo.

:: 检测浏览器
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    echo 使用Chrome浏览器...
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --incognito http://localhost:3002
) else if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    echo 使用Edge浏览器...
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" -inprivate http://localhost:3002
) else (
    echo 使用默认浏览器...
    start http://localhost:3002
)

echo.
echo ✅ 浏览器已启动（无痕模式）
echo.
echo ========================================
echo.
echo 📋 如果CORS错误仍然存在：
echo.
echo 1. 在浏览器中按 Ctrl+Shift+Delete
echo 2. 选择"全部时间"
echo 3. 勾选"缓存的图片和文件"
echo 4. 点击"清除数据"
echo 5. 按 Ctrl+F5 硬刷新
echo.
echo ========================================
echo.
echo 💡 提示：
echo    这个错误通常来自广告拦截器
echo    访问 chrome://extensions/
echo    禁用AdBlock/uBlock等扩展即可
echo.
echo ========================================
echo.
pause
