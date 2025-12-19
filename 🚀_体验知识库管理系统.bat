@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    🚀 体验知识库管理系统
echo ========================================
echo.
echo 📚 企业级知识库管理系统 - Phase 2
echo.
echo 🎯 核心功能:
echo    ✅ 知识条目管理 (CRUD)
echo    ✅ 全文搜索引擎
echo    ✅ 智能推荐系统
echo    ✅ 分类与标签管理
echo    ✅ 版本控制
echo    ✅ 审计日志
echo.
echo 🌐 即将打开浏览器访问知识库管理界面...
echo.
echo 📍 访问地址:
echo    前台: http://localhost:5173/#/admin/knowledge-base
echo.
echo ⚠️  请确保开发服务器已启动!
echo    如未启动,请先运行: npm run dev
echo.
pause

REM 打开浏览器
start http://localhost:5173/#/admin/knowledge-base

echo.
echo ✅ 浏览器已打开!
echo.
echo 💡 使用提示:
echo    1. 查看统计仪表板 - 了解知识库概况
echo    2. 搜索知识 - 测试全文搜索功能
echo    3. 添加知识 - 创建新的知识条目
echo    4. 管理分类 - 切换到"分类管理"Tab
echo    5. 管理标签 - 切换到"标签管理"Tab
echo    6. 查看日志 - 切换到"审计日志"Tab
echo.
echo 📖 详细文档: ✅_知识库管理系统Phase2完成_2025-12-15.md
echo.
pause
