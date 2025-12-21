@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🚀 测试工作流拖拽终极修复
echo ========================================
echo.
echo 📋 本次修复内容：
echo   ✅ 1. 固定布局（防止resize循环）
echo   ✅ 2. requestAnimationFrame节流拖拽
echo   ✅ 3. 禁止selectNode触发fitView
echo   ✅ 4. event.preventDefault防止干扰
echo   ✅ 5. contain:layout隔离渲染
echo.
echo 🔍 测试步骤：
echo   1. 强制刷新浏览器 (Ctrl+Shift+R)
echo   2. 打开诊断工具HTML
echo   3. 按F12打开Performance录制
echo   4. 点击并拖动节点
echo   5. 检查是否出现Layout Thrashing
echo.
echo ⏳ 正在启动浏览器...
echo.

REM 启动前端服务器（如果未运行）
start /b cmd /c "cd /d %~dp0 && npm run dev"

REM 等待2秒
timeout /t 2 /nobreak >nul

REM 打开工作流页面
start http://localhost:3000/#/workflow-editor-v5

REM 打开诊断工具
start %~dp0🔍_工作流节点事件诊断_2025-12-20.html

echo.
echo ========================================
echo   ✅ 浏览器已启动
echo ========================================
echo.
echo 📌 请按以下顺序测试：
echo.
echo   【测试1：节点选中】
echo   → 点击任意节点
echo   → 观察是否立即选中（无抖动）
echo.
echo   【测试2：节点拖动】
echo   → 拖动节点移动位置
echo   → 观察是否流畅（60fps）
echo.
echo   【测试3：右侧面板】
echo   → 关闭右侧编辑面板
echo   → 观察画布宽度是否保持不变
echo.
echo   【测试4：Performance录制】
echo   → 按F12 → Performance → 录制
echo   → 拖动节点3秒
echo   → 停止录制，检查是否有Layout Thrashing
echo.
echo 🎯 预期结果：
echo   ✅ 无抖动（0秒抖动）
echo   ✅ 流畅拖动（60fps）
echo   ✅ 无Layout Thrashing
echo   ✅ CPU占用 < 30%%
echo.
pause
