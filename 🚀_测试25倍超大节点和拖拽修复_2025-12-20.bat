@echo off
chcp 65001 > nul
color 0A
echo.
echo ========================================
echo   测试工作流编辑器 v7.0 Ultra Edition
echo ========================================
echo.
echo 【修复内容】
echo 1. 节点抖动问题 - 已修复拖拽和点击事件冲突
echo 2. 节点放大 - 从5倍扩大到25倍
echo.
echo 【测试步骤】
echo 1. 点击左侧节点或拖拽到画布
echo 2. 拖动节点 - 应该流畅无抖动
echo 3. 单击节点 - 选中状态
echo 4. 双击节点 - 打开属性面板
echo 5. 查看节点尺寸 - 应该非常大(25倍)
echo.
echo 【访问地址】
echo http://localhost:3002/#/workflow-editor-v5-n8n
echo.
echo 正在启动浏览器...
timeout /t 2 > nul
start http://localhost:3002/#/workflow-editor-v5-n8n
echo.
echo 已启动!请在浏览器中测试
echo.
pause
