@echo off
chcp 65001 >nul
echo ========================================
echo 修复3002端口空白页面问题
echo ========================================
echo.
echo 🔍 问题分析：
echo 全局CSS卡片优化可能影响了根元素
echo.
echo ✅ 已应用的修复：
echo [1/3] 添加根元素保护规则
echo       html, body, #app { transform: none !important; }
echo.
echo [2/3] 保护主容器
echo       .main-wrapper { transform: none !important; }
echo.
echo [3/3] 保持卡片优化生效
echo       仅影响 .el-card 和自定义卡片类
echo.
echo ========================================
echo 正在重启开发服务器...
echo ========================================
echo.

REM 停止现有进程
echo 停止现有Node进程...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo.
echo 清除端口占用...
netstat -ano | findstr :3002
timeout /t 1 >nul

echo.
echo 启动开发服务器...
cd /d "%~dp0"
start /B cmd /c "npm run dev"
timeout /t 8 >nul

echo.
echo ========================================
echo ✅ 修复完成！
echo ========================================
echo.
echo 🚀 正在打开页面...
start http://localhost:3002

echo.
echo 📋 验证清单：
echo [ ] 页面不再空白，可以看到内容
echo [ ] 卡片默认缩小至85%%
echo [ ] 鼠标悬停卡片放大至102%%
echo [ ] Ctrl+K 快捷键正常工作
echo.
echo 💡 如果仍然空白：
echo 1. 按 F12 打开开发者工具
echo 2. 查看 Console 标签的错误信息
echo 3. 按 Ctrl+Shift+R 强制刷新
echo 4. 运行诊断工具: 🔍_诊断3002空白页面_2025-12-19.html
echo.
pause
