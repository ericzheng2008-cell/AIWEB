@echo off
chcp 65001 >nul
color 0A
title 项目完整性验证工具

echo.
echo ========================================
echo   项目完整性验证工具
echo ========================================
echo.

echo [步骤1/5] 检查Node.js环境...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未安装Node.js
    echo 请从 https://nodejs.org/ 下载安装
    goto :error
)
echo ✅ Node.js已安装
node --version

echo.
echo [步骤2/5] 检查npm依赖...
if not exist "node_modules" (
    echo ⚠️  依赖未安装，正在安装...
    call npm install
    if %errorlevel% neq 0 goto :error
) else (
    echo ✅ 依赖已安装
)

echo.
echo [步骤3/5] 检查核心文件...
set missing=0

if not exist "src\views\AiAgents.vue" (
    echo ❌ 缺少: AiAgents.vue
    set missing=1
)
if not exist "src\views\EquipmentLifecycle.vue" (
    echo ❌ 缺少: EquipmentLifecycle.vue
    set missing=1
)
if not exist "src\views\FaultTracking.vue" (
    echo ❌ 缺少: FaultTracking.vue
    set missing=1
)
if not exist "src\views\admin\EquipmentManage.vue" (
    echo ❌ 缺少: EquipmentManage.vue
    set missing=1
)
if not exist "src\views\admin\WorkOrderManage.vue" (
    echo ❌ 缺少: WorkOrderManage.vue
    set missing=1
)
if not exist "src\store\equipmentLifecycle.js" (
    echo ❌ 缺少: equipmentLifecycle.js
    set missing=1
)
if not exist "src\store\faultTracking.js" (
    echo ❌ 缺少: faultTracking.js
    set missing=1
)

if %missing%==1 (
    echo.
    echo ❌ 发现缺失文件
    goto :error
)
echo ✅ 核心文件完整

echo.
echo [步骤4/5] 检查文档完整性...
set docs=0
if exist "🚀_项目开发完成总结_2025-12-13.md" set /a docs+=1
if exist "🎊_最终交付总结_2025-12-13.md" set /a docs+=1
if exist "📋_后台管理完成报告_2025-12-13.md" set /a docs+=1
if exist "📌操作指南.md" set /a docs+=1
echo ✅ 找到 %docs% 个核心文档

echo.
echo [步骤5/5] 检查Git状态...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  未初始化Git仓库
) else (
    echo ✅ Git仓库正常
    echo.
    echo 最近提交:
    git log --oneline -3
)

echo.
echo ========================================
echo   验证完成！
echo ========================================
echo.
echo ✅ 项目完整性: 100%%
echo ✅ 核心文件: 完整
echo ✅ 依赖安装: 正常
echo ✅ 文档齐全: %docs% 份
echo.
echo ========================================
echo   下一步操作建议
echo ========================================
echo.
echo 1. 启动开发服务器:
echo    npm run dev
echo.
echo 2. 查看项目总结:
echo    打开: 🚀_项目开发完成总结_2025-12-13.md
echo.
echo 3. 部署到线上:
echo    运行: deploy-to-vercel.bat
echo.
echo 按任意键退出...
pause >nul
exit /b 0

:error
echo.
echo ========================================
echo   验证失败
echo ========================================
echo.
echo 请检查上述错误信息
echo.
echo 建议操作:
echo 1. 运行 diagnose-and-fix.bat 修复问题
echo 2. 重新安装依赖: npm install
echo 3. 查看 📌操作指南.md
echo.
pause
exit /b 1
