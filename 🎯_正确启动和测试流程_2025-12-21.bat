@echo off
chcp 65001 >nul
title ✅ AIWEB 正确启动流程

echo.
echo ==========================================
echo     🚀 AIWEB 正确启动和测试流程
echo ==========================================
echo.
echo 📋 第一步: 启动开发服务器
echo ----------------------------------------
echo 请在新的终端窗口执行:
echo     npm run dev
echo.
echo ⏱️  等待服务器启动成功(看到 Local: http://localhost:5173/)
echo.
pause

echo.
echo ==========================================
echo 📋 第二步: 访问开发服务器
echo ==========================================
echo.
echo ✅ 正确的访问地址:
echo     http://localhost:5173/
echo.
echo ❌ 错误的访问方式:
echo     × 直接打开 HTML 文件
echo     × 使用 file:/// 协议
echo.
echo 🌐 即将在浏览器中打开...
timeout /t 3 >nul

start http://localhost:5173/

echo.
echo ==========================================
echo 📋 第三步: 诊断问题(如果页面有问题)
echo ==========================================
echo.
echo 1. 按 F12 打开开发者工具
echo 2. 切换到 Console 标签
echo 3. 查看是否有红色错误
echo 4. 在控制台粘贴以下命令:
echo.
echo    window.__VUE_DEVTOOLS_GLOBAL_HOOK__
echo.
echo ✅ 如果返回对象 = Vue 运行正常
echo ❌ 如果返回 undefined = Vue 未加载
echo.
echo ==========================================
echo 🔍 常见问题排查
echo ==========================================
echo.
echo ❓ 如果看到 "无法访问此网站"
echo    → 检查开发服务器是否启动
echo    → 在终端查找 "Local: http://localhost:5173/"
echo.
echo ❓ 如果看到空白页面
echo    → 按 F12 查看 Console 错误
echo    → 检查是否有编译错误
echo.
echo ❓ 如果看到 404 错误
echo    → 检查路由配置
echo    → 确认访问的是根路径 /
echo.
pause
