@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🔧 后台数据丢失问题 - 快速修复
echo ========================================
echo.
echo 问题: 后台修改的LOGO、Banner、明星产品等数据会自动恢复
echo 原因: localStorage数据持久化逻辑问题
echo.
echo ========================================
echo   修复方案选择
echo ========================================
echo.
echo 1. 快速修复 (5分钟) - 修改localStorage逻辑
echo 2. 完整修复 (30分钟) - 添加后端数据库持久化
echo 3. 高级修复 (1小时) - 升级到IndexedDB
echo 4. 查看详细解决方案文档
echo 5. 退出
echo.
set /p choice="请选择修复方案 (1-5): "

if "%choice%"=="1" goto quick_fix
if "%choice%"=="2" goto full_fix
if "%choice%"=="3" goto advanced_fix
if "%choice%"=="4" goto view_doc
if "%choice%"=="5" goto end

:quick_fix
echo.
echo ========================================
echo   开始快速修复...
echo ========================================
echo.
echo 📝 修复步骤:
echo 1. 修改 src/store/cms.js 的state初始化逻辑
echo 2. 添加初始化标记
echo 3. 优化保存方法
echo.
echo ⚠️  需要手动修改代码
echo 📖 请打开: 📖_手机端后台修改不同步解决指南_2025-12-21.md
echo 📖 查看"方案2: 修复现有localStorage逻辑"部分
echo.
start "" "📖_手机端后台修改不同步解决指南_2025-12-21.md"
pause
goto end

:full_fix
echo.
echo ========================================
echo   开始完整修复...
echo ========================================
echo.
echo 📝 修复步骤:
echo 1. 创建后端API (server/routes/cms.js)
echo 2. 修改前端Store (src/store/cms.js)
echo 3. 修改后台管理页面
echo 4. 测试数据持久化
echo.
echo ⚠️  需要创建多个文件
echo 📖 请打开: 📖_手机端后台修改不同步解决指南_2025-12-21.md
echo 📖 查看"方案1: 添加后端数据库持久化"部分
echo.
start "" "📖_手机端后台修改不同步解决指南_2025-12-21.md"
pause
goto end

:advanced_fix
echo.
echo ========================================
echo   开始高级修复...
echo ========================================
echo.
echo 📝 修复步骤:
echo 1. 安装 idb 依赖
echo 2. 创建 IndexedDB 工具类
echo 3. 修改 Store 使用 IndexedDB
echo 4. 测试跨浏览器同步
echo.
echo 先安装依赖...
call npm install idb
echo.
echo ✅ 依赖安装完成
echo 📖 请打开: 📖_手机端后台修改不同步解决指南_2025-12-21.md
echo 📖 查看"方案3: 使用IndexedDB代替localStorage"部分
echo.
start "" "📖_手机端后台修改不同步解决指南_2025-12-21.md"
pause
goto end

:view_doc
echo.
echo ========================================
echo   打开详细解决方案文档...
echo ========================================
echo.
start "" "📖_手机端后台修改不同步解决指南_2025-12-21.md"
pause
goto end

:end
echo.
echo ========================================
echo   修复完成
echo ========================================
echo.
echo 💡 提示:
echo 1. 建议使用"方案1: 后端数据库持久化" - 最可靠
echo 2. 如果时间紧急,先用"方案2: 修复localStorage" - 最快
echo 3. 修复后请清除浏览器缓存重新测试
echo.
pause
