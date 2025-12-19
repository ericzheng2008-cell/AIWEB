@echo off
chcp 65001 >nul
color 0B
title 📚 设备全生命周期管理智能体 - 完整汇报文档

echo.
echo ═══════════════════════════════════════════════════════
echo    📚 设备全生命周期管理智能体汇报文档
echo ═══════════════════════════════════════════════════════
echo.
echo    📊 核心文档：
echo       • PPT汇报展示（41页完整版）
echo       • PPT制作指南（设计规范）
echo       • 功能实现对照表（技术细节）
echo.
echo    🎯 文档特点：
echo       ✓ 可直接打印成PPT
echo       ✓ 包含完整演示脚本
echo       ✓ 配色方案专业
echo       ✓ 41页完整汇报
echo.
echo ═══════════════════════════════════════════════════════
echo.

:menu
echo 请选择要查看的文档：
echo.
echo [1] 📊 PPT汇报展示（41页Markdown版）
echo [2] 📖 PPT制作指南（设计规范）
echo [3] 📋 PPT大纲功能实现对照表
echo [4] 🎉 智能算账系统完整交付文档
echo [5] 🎊 设备智能体深度优化总结
echo [6] 📘 设备智能体深度优化方案
echo [7] 📊 设备资产运营方案汇报（PPT文案版）
echo [8] 🚀 立即体验完整智能系统
echo [9] 📂 打开文档所在文件夹
echo [0] 退出
echo.
set /p choice=请输入选项 [0-9]: 

if "%choice%"=="1" goto ppt
if "%choice%"=="2" goto guide
if "%choice%"=="3" goto compare
if "%choice%"=="4" goto delivery
if "%choice%"=="5" goto summary
if "%choice%"=="6" goto plan
if "%choice%"=="7" goto report
if "%choice%"=="8" goto demo
if "%choice%"=="9" goto folder
if "%choice%"=="0" goto end
goto menu

:ppt
echo.
echo 正在打开 PPT汇报展示文档...
start "" "📊_设备全生命周期管理智能体汇报展示_2025-12-17_PPT版.md"
timeout /t 2 >nul
goto menu

:guide
echo.
echo 正在打开 PPT制作指南...
start "" "📖_PPT制作指南_2025-12-17.md"
timeout /t 2 >nul
goto menu

:compare
echo.
echo 正在打开 功能实现对照表...
start "" "📋_PPT大纲功能实现对照表_2025-12-17.md"
timeout /t 2 >nul
goto menu

:delivery
echo.
echo 正在打开 智能算账系统完整交付文档...
start "" "🎉_智能算账系统完整交付_2025-12-17.md"
timeout /t 2 >nul
goto menu

:summary
echo.
echo 正在打开 设备智能体深度优化总结...
start "" "🎊_设备智能体深度优化总结_2025-12-17_FINAL.md"
timeout /t 2 >nul
goto menu

:plan
echo.
echo 正在打开 设备智能体深度优化方案...
start "" "📘_设备智能体深度优化方案_基于PPT大纲_2025-12-17_v3.0.md"
timeout /t 2 >nul
goto menu

:report
echo.
echo 正在打开 设备资产运营方案汇报...
start "" "📊_设备资产全生命周期运营方案汇报_2025-12-17_v2.0.md"
timeout /t 2 >nul
goto menu

:demo
echo.
echo 正在启动完整智能系统演示...
start "" "🚀_立即体验完整智能系统_2025-12-17.bat"
timeout /t 2 >nul
goto menu

:folder
echo.
echo 正在打开文档所在文件夹...
explorer .
timeout /t 2 >nul
goto menu

:end
echo.
echo ═══════════════════════════════════════════════════════
echo    📋 文档使用提示
echo ═══════════════════════════════════════════════════════
echo.
echo    💡 制作PPT步骤：
echo       1. 使用Markdown编辑器打开PPT汇报展示文档
echo       2. 参考PPT制作指南进行设计
echo       3. 使用Pandoc转换为.pptx格式
echo          命令：pandoc input.md -o output.pptx
echo.
echo    💡 演示准备：
echo       1. 熟悉演示脚本（详见PPT制作指南）
echo       2. 准备系统演示环境（运行体验智能系统）
echo       3. 打印客户算账表（Excel模板）
echo       4. 准备案例素材
echo.
echo    💡 现场使用：
echo       • P1-P5：建立问题认知（5分钟）
echo       • P6-P11：展示解决方案（10分钟）
echo       • P12-P19：核心产品介绍（15分钟）
echo       • P20-P27：实施与案例（10分钟）
echo       • P28-P35：技术演示（10分钟）
echo       • P36-P41：结语与行动（5分钟）
echo.
echo       总时长：45-60分钟（含互动）
echo.
echo ═══════════════════════════════════════════════════════
echo.
echo 感谢使用！祝汇报成功！
echo.
pause
