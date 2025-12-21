@echo off
chcp 65001 > nul
color 0A
echo.
echo ========================================
echo    🎊 工作流节点放大效果测试
echo ========================================
echo.
echo 【放大效果】
echo   节点宽度: 240px → 720px (3倍)
echo   图标大小: 36px → 108px (3倍)
echo   标题字体: 14px → 42px (3倍)
echo   网格间距: 20px → 60px (3倍)
echo.
echo ========================================
echo.
echo 🚀 正在启动浏览器...
echo.
timeout /t 2 /nobreak > nul

start http://localhost:5173/workflow-editor-v5-n8n

echo.
echo ✅ 已打开工作流编辑器V5
echo.
echo 【测试步骤】
echo   1. 从左侧拖拽节点到画布
echo   2. 观察节点大小和清晰度
echo   3. 连接节点查看连接线粗细
echo   4. 测试缩放功能
echo.
echo 【适用场景】
echo   ✅ 大屏演示 (投影/电视)
echo   ✅ 培训教学 (讲解流程)
echo   ✅ 触摸设备 (平板/触摸屏)
echo   ✅ 视力辅助 (易于阅读)
echo.
echo ========================================
echo.
pause
