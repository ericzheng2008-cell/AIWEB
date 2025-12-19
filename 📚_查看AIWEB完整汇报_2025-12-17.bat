@echo off
chcp 65001 >nul
cls
echo.
echo ========================================
echo    AIWEB 网站完整汇报文档查看器
echo ========================================
echo.
echo 请选择要查看的文档：
echo.
echo ┌─────────────────────────────────────┐
echo │  核心汇报文档                        │
echo └─────────────────────────────────────┘
echo [1] 📊 AIWEB网站完整汇报（主文档，80+页）
echo [2] 📄 转换为PDF格式
echo.
echo ┌─────────────────────────────────────┐
echo │  智能体相关文档                      │
echo └─────────────────────────────────────┘
echo [3] 📊 设备全生命周期智能体PPT（41页）
echo [4] 📘 设备智能体深度优化方案
echo [5] 📘 智能体多平台整合方案
echo [6] 🎉 智能算账系统完整交付
echo [7] 📋 PPT大纲功能实现对照表
echo.
echo ┌─────────────────────────────────────┐
echo │  系统演示与测试                      │
echo └─────────────────────────────────────┘
echo [8] 🚀 启动开发服务器（立即体验）
echo [9] 🧪 测试智能算账与推荐系统
echo.
echo ┌─────────────────────────────────────┐
echo │  其他工具                            │
echo └─────────────────────────────────────┘
echo [A] 📁 打开项目根目录
echo [B] 📝 查看所有文档列表
echo [0] ❌ 退出
echo.
echo ========================================

set /p choice=请输入选项: 

if "%choice%"=="1" goto doc1
if "%choice%"=="2" goto pdf
if "%choice%"=="3" goto doc3
if "%choice%"=="4" goto doc4
if "%choice%"=="5" goto doc5
if "%choice%"=="6" goto doc6
if "%choice%"=="7" goto doc7
if "%choice%"=="8" goto demo
if "%choice%"=="9" goto test
if /i "%choice%"=="A" goto folder
if /i "%choice%"=="B" goto list
if "%choice%"=="0" exit
goto end

:doc1
echo.
echo 正在打开: AIWEB网站完整汇报文档...
start "" "📊_AIWEB网站完整汇报文档_2025-12-17_v1.0.md"
echo.
echo ✓ 已打开主文档（Markdown格式）
echo.
echo 提示：
echo   - 推荐使用 Typora、Obsidian 或 VSCode 查看
echo   - 如需PDF格式，请选择选项[2]
echo.
pause
goto end

:pdf
echo.
call "📄_转换汇报文档为PDF_2025-12-17.bat"
goto end

:doc3
echo.
echo 正在打开: 设备全生命周期智能体PPT汇报...
start "" "📊_设备全生命周期管理智能体汇报展示_2025-12-17_PPT版.md"
echo.
echo ✓ 已打开智能体PPT文档（41页）
echo.
pause
goto end

:doc4
echo.
echo 正在打开: 设备智能体深度优化方案...
start "" "📘_设备智能体深度优化方案_基于PPT大纲_2025-12-17_v3.0.md"
echo.
echo ✓ 已打开优化方案文档
echo.
pause
goto end

:doc5
echo.
echo 正在打开: 智能体多平台整合方案...
start "" "📘_智能体多平台整合方案_2025-12-17_v1.0.0.md"
echo.
echo ✓ 已打开多平台整合方案
echo.
pause
goto end

:doc6
echo.
echo 正在打开: 智能算账系统完整交付...
start "" "🎉_智能算账系统完整交付_2025-12-17.md"
echo.
echo ✓ 已打开交付文档
echo.
pause
goto end

:doc7
echo.
echo 正在打开: PPT大纲功能实现对照表...
start "" "📋_PPT大纲功能实现对照表_2025-12-17.md"
echo.
echo ✓ 已打开功能对照表
echo.
pause
goto end

:demo
echo.
echo ========================================
echo   启动 AIWEB 开发服务器
echo ========================================
echo.
echo 正在启动前端服务器（Vite）...
echo.
echo 启动后访问：http://localhost:5173
echo.
echo 主要功能入口：
echo   - 首页：http://localhost:5173/
echo   - 智能算账：http://localhost:5173/intelligent-calculator
echo   - 设备管理：http://localhost:5173/equipment-lifecycle
echo   - 曲线分析：http://localhost:5173/curve-analysis
echo   - 后台管理：http://localhost:5173/admin
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.
npm run dev
goto end

:test
echo.
echo 正在打开测试页面...
start "" "🧪_测试智能算账与推荐系统_2025-12-17.html"
echo.
echo ✓ 已打开独立测试页面
echo.
echo 功能说明：
echo   - Tab 1: 必中算账法（现场演示工具）
echo   - Tab 2: 年包智能推荐（3个SKU）
echo   - Tab 3: 五级价值路径推荐
echo   - Tab 4: 成本冰山分析
echo.
pause
goto end

:folder
echo.
echo 正在打开项目根目录...
start "" .
echo.
echo ✓ 已打开项目文件夹
echo.
pause
goto end

:list
echo.
echo ========================================
echo   全部文档列表
echo ========================================
echo.
echo 【核心汇报文档】
echo   📊 AIWEB网站完整汇报文档_2025-12-17_v1.0.md (80+页)
echo.
echo 【智能体相关（8份）】
echo   📊 设备全生命周期管理智能体汇报展示_2025-12-17_PPT版.md (41页)
echo   📘 设备智能体深度优化方案_基于PPT大纲_2025-12-17_v3.0.md
echo   📊 设备资产全生命周期运营方案汇报_2025-12-17_v2.0.md
echo   📘 智能体多平台整合方案_2025-12-17_v1.0.0.md
echo   🎉 智能算账系统完整交付_2025-12-17.md
echo   🎊 设备智能体深度优化总结_2025-12-17_FINAL.md
echo   📋 PPT大纲功能实现对照表_2025-12-17.md
echo   📖 PPT制作指南_2025-12-17.md
echo.
echo 【响应式设计】
echo   ✅ 移动端响应式设计完成_2025-12-17.md
echo   📱 移动端响应式演示.html
echo.
echo 【测试工具】
echo   🧪 测试智能算账与推荐系统_2025-12-17.html
echo   🧪 测试移动端响应式_2025-12-17.bat
echo.
echo 【历史文档】
echo   100+ 个开发过程文档（✅、🎉、📘 等标记）
echo.
echo ========================================
echo.
pause
goto end

:end
echo.
