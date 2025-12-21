@echo off
chcp 65001 >nul
echo.
echo ========================================
echo     工作流编辑器 v6.0 Enterprise
echo ========================================
echo.
echo 正在启动开发服务器...
echo.

cd /d "%~dp0"

echo 🚀 启动中... 请稍候
echo.
start http://localhost:5173/workflow-editor-v5-n8n

echo ✅ 浏览器已打开
echo.
echo 📝 测试清单:
echo.
echo 1. ✅ 查看左侧【企业级 🔥】分类 (5个新节点)
echo 2. ✅ 拖拽【审批节点】到画布 (带SLA标签)
echo 3. ✅ 双击节点打开属性面板
echo 4. ✅ 查看9个标签页:
echo    - Tab 1: 参数配置
echo    - Tab 2: 执行测试
echo    - Tab 3: 节点设置
echo    - Tab 4: 执行责任 🆕
echo    - Tab 5: SLA管理 🆕
echo    - Tab 6: 权限设置 🆕
echo    - Tab 7: 数据追踪 🆕
echo    - Tab 8: 调试模式 🆕
echo    - Tab 9: AI智能 🆕
echo.
echo 5. ✅ 测试 SLA 管理:
echo    - 启用 SLA 开关
echo    - 设置目标时间 4 小时
echo    - 选择优先级 "🟠 高"
echo    - 调整预警阈值 80%%
echo.
echo 6. ✅ 测试 AI 智能:
echo    - 点击 "AI 自动配置此节点"
echo    - 查看 AI 建议列表
echo    - 点击 "应用" 按钮
echo.
echo 7. ✅ 体验 5 倍超大节点:
echo    - 节点宽度: 1200px
echo    - 图标: 180px × 180px
echo    - 字体: 70px 超大字体
echo.
echo ========================================
echo.
echo 💡 提示: 如服务器未启动，请先运行:
echo    npm run dev
echo.
echo 📖 查看完整文档:
echo    ✅_工作流企业级优化完成_2025-12-20_v3.0.md
echo.
echo ========================================
pause
