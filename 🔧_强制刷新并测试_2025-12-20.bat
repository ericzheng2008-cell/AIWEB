@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🔧 强制刷新浏览器缓存并测试
echo ========================================
echo.
echo 📌 第1步：关闭所有Chrome窗口
echo.
taskkill /F /IM chrome.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo ✅ Chrome已关闭
echo.
echo 📌 第2步：清理临时缓存
echo.
del /F /Q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache\*.*" >nul 2>&1
rd /S /Q "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache" >nul 2>&1
echo ✅ 缓存已清理
echo.
echo 📌 第3步：重新打开浏览器
echo.
timeout /t 1 /nobreak >nul
start chrome --disable-cache --incognito http://localhost:3000/#/workflow-editor-v5
echo ✅ 浏览器已打开（无痕模式）
echo.
echo ========================================
echo   🎯 测试清单
echo ========================================
echo.
echo ✅ 1. 点击节点 → 应立即选中，无抖动
echo ✅ 2. 拖动节点 → 应流畅移动，60fps
echo ✅ 3. 连续拖动 → CPU < 20%%
echo ✅ 4. F12 → Performance → 无Layout Thrashing
echo.
echo 按任意键查看技术文档...
pause >nul
notepad "✅_pointer-events完全重构_2025-12-20.md"
