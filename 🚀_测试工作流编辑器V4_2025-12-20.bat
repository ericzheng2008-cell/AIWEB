@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 启动工作流节点编辑器V4测试
echo ========================================
echo.
echo 📋 测试项目:
echo   1. 六大节点分类拖拽
echo   2. 完整属性编辑(5个标签)
echo   3. AI智能推荐(双击画布)
echo   4. AI自动生成流程
echo   5. 连接线创建
echo   6. 撤销/重做
echo   7. 框选多选
echo   8. 右键菜单
echo.
echo 🌐 正在打开浏览器...
echo.

start http://localhost:5173/workflow-editor-v4

echo ✅ 浏览器已打开
echo.
echo 💡 测试步骤:
echo   【基础测试】
echo   1. 从左侧拖拽"AI判断"节点到画布
echo   2. 拖拽"审批节点"
echo   3. 连接两个节点(拖拽连接点)
echo   4. 点击节点查看右侧属性面板
echo   5. 切换5个标签页测试
echo.
echo   【AI功能测试】
echo   1. 点击顶部"AI 构建流程"
echo   2. 输入:"设备故障处理流程"
echo   3. 查看AI生成结果
echo   4. 双击画布空白处
echo   5. 查看AI推荐浮层
echo.
echo   【高级功能】
echo   1. Ctrl+Z 撤销
echo   2. Ctrl+Y 重做
echo   3. 框选多个节点
echo   4. 右键节点菜单
echo   5. 点击"保存"按钮
echo.
echo ⌨️  快捷键说明:
echo   Ctrl+Z: 撤销
echo   Ctrl+Y: 重做  
echo   Ctrl+A: 全选
echo   Ctrl+C: 复制
echo   Ctrl+V: 粘贴
echo   Delete: 删除
echo   双击画布: AI推荐
echo   双击节点: 编辑属性
echo.
echo 📊 功能亮点:
echo   ✅ 26个企业级节点
echo   ✅ 六大分类体系
echo   ✅ 完整属性编辑
echo   ✅ AI智能助手
echo   ✅ 流畅交互体验
echo.
pause
