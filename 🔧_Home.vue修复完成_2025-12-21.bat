@echo off
chcp 65001 >nul
cls

echo ============================================
echo 🎉 Home.vue 500错误修复完成!
echo ============================================
echo.
echo ✅ 问题: Home.vue重复定义workflowPlatforms导致500错误
echo ✅ 解决: 删除865-1150行旧的内联数据,只保留外部导入
echo.
echo 📋 修复详情:
echo   - 删除了旧的30个AI工作平台内联数据
echo   - 保留了从manufacturingTools.js导入的数据
echo   - 消除了变量重复定义冲突
echo.
echo ⏱️ 正在启动开发服务器...
echo.

cd /d "%~dp0"
npm run dev

pause
