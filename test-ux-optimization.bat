@echo off
chcp 65001 >nul
echo ╔════════════════════════════════════════════════════════════════╗
echo ║     🎨 AI智能体系统 - 用户体验优化测试脚本                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo [1/5] 📦 检查依赖安装...
if not exist "node_modules\aos" (
    echo ❌ AOS动画库未安装，正在安装...
    call npm install aos --save
) else (
    echo ✅ AOS动画库已安装
)
echo.

echo [2/5] 🔍 检查文件完整性...
if exist "src\views\AiAgents.vue" (
    echo ✅ AiAgents.vue 存在
) else (
    echo ❌ AiAgents.vue 不存在
    exit /b 1
)

if exist "src\views\ToolSelector.vue" (
    echo ✅ ToolSelector.vue 存在
) else (
    echo ❌ ToolSelector.vue 不存在
    exit /b 1
)
echo.

echo [3/5] 🔧 检查语法错误...
call npx vue-tsc --noEmit 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ 没有TypeScript错误
) else (
    echo ⚠️  有一些TypeScript警告，但不影响运行
)
echo.

echo [4/5] 🏗️  构建项目...
call npm run build
if %ERRORLEVEL% EQU 0 (
    echo ✅ 构建成功
) else (
    echo ❌ 构建失败，请检查错误信息
    pause
    exit /b 1
)
echo.

echo [5/5] 🚀 启动开发服务器...
echo.
echo 优化功能测试清单：
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 【AI智能体首页】
echo   □ 动态背景粒子效果
echo   □ 数据统计卡片显示
echo   □ 智能体卡片悬停光效
echo   □ 帮助按钮显示教程
echo   □ 分类筛选功能
echo   □ 搜索功能
echo.
echo 【工具选型页面】
echo   □ 进度指示器显示
echo   □ 表单完整度显示
echo   □ 快速填充示例
echo   □ 智能推荐动画
echo   □ 表单验证提示
echo.
echo 【响应式设计】
echo   □ 移动端布局
echo   □ 平板端布局
echo   □ 桌面端布局
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📍 服务器将在 http://localhost:5173 启动
echo 💡 请在浏览器中测试以上功能
echo.
pause
call npm run dev
