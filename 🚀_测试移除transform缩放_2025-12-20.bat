@echo off
chcp 65001 >nul
echo.
echo ========================================
echo 🚀 测试移除 transform 缩放修复
echo ========================================
echo.
echo 📋 关键修复：
echo    ✅ 移除 transform: scale() - 这是抖动的根源！
echo    ✅ 移除缩放因子计算 - 直接使用像素偏移
echo    ✅ 移除 .stop 修饰符 - 让事件正常传递
echo    ✅ 保留5px移动阈值 - 防止误触
echo.
echo ========================================
echo 🧪 测试步骤：
echo ========================================
echo.
echo 【步骤1: 强制刷新】
echo ⚠️  必须执行：Ctrl + Shift + R
echo    这是最重要的一步！
echo.
echo 【步骤2: 拖拽节点到画布】
echo    从左侧拖一个节点
echo.
echo 【步骤3: 点击节点】
echo    ✅ 应该：立即选中，边框变蓝
echo    ❌ 不应该：抖动、跳动
echo.
echo 【步骤4: 拖动节点】
echo    ✅ 应该：流畅跟随鼠标
echo    ❌ 不应该：抖动、偏移
echo.
echo 【步骤5: 双击节点】
echo    ✅ 应该：打开编辑面板
echo.
echo ========================================
echo 🔍 诊断工具：
echo ========================================
echo.
echo 如果仍然有问题，请：
echo 1. 运行诊断页面
echo 2. 在控制台运行诊断脚本
echo 3. 将结果截图或复制给我
echo.
echo ========================================
echo 正在打开页面...
echo ========================================
echo.
start "" "http://localhost:5173/#/workflow-editor-v5-n8n"
timeout /t 2 /nobreak >nul
start "" "%~dp0🔍_工作流节点事件诊断_2025-12-20.html"
echo.
echo ✅ 已打开：
echo    - 工作流编辑器
echo    - 诊断工具页面
echo.
echo 💡 温馨提示：
echo    如果服务器未启动，请先运行: npm run dev
echo.
pause
