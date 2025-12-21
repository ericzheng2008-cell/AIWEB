@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🔧 强制刷新浏览器缓存
echo ========================================
echo.
echo ⚠️  重要提示：
echo     浏览器可能缓存了旧版本的CSS/JS
echo     需要强制刷新才能看到最新修复
echo.
echo ========================================
echo.

echo 📝 强制刷新方法：
echo.
echo 🌐 Chrome/Edge:
echo     Ctrl + Shift + R
echo     或 Ctrl + F5
echo.
echo 🦊 Firefox:
echo     Ctrl + Shift + R
echo     或 Ctrl + F5
echo.
echo 🍎 Safari:
echo     Cmd + Option + R
echo.
echo ========================================
echo.
echo 🚀 正在打开工作流编辑器...
start "" "http://localhost:5173/#/workflow-editor-v5-n8n"

echo.
echo ========================================
echo   ⚡ 请立即执行以下操作
echo ========================================
echo.
echo 1️⃣  页面加载后，立即按：
echo     Ctrl + Shift + R
echo.
echo 2️⃣  等待页面完全重新加载
echo.
echo 3️⃣  测试节点交互：
echo     • 从左侧拖拽节点到画布
echo     • 点击节点（不应该抖动）
echo     • 拖动节点（应该流畅移动）
echo     • 双击节点（应该打开编辑）
echo.
echo ========================================
echo.
echo 💡 如果仍然有问题，请提供：
echo     1. 浏览器控制台截图 (F12)
echo     2. 具体操作步骤
echo     3. 错误信息
echo.
pause
