@echo off
chcp 65001 >nul
echo ========================================
echo 拧紧工艺改进与验证智能体 - 快速测试
echo ========================================
echo.
echo 📋 测试检查清单：
echo.
echo ✅ 1. 文件已创建
echo    - ProcessVerification.vue (56KB)
echo    - 路由已配置: /process-verification
echo    - AiAgents.vue 已添加卡片
echo.
echo 🔧 2. 重启开发服务器
echo    请按以下步骤操作：
echo    步骤1: 停止当前开发服务器 (Ctrl+C)
echo    步骤2: 运行: npm run dev
echo    步骤3: 等待服务器启动完成
echo.
echo 🌐 3. 访问测试链接
echo.
echo    【主要测试路径】
echo    ▶ 前台智能体页面: http://localhost:5173/ai-agents
echo      （应该能看到第8个智能体卡片："拧紧工艺改进与验证"）
echo.
echo    ▶ 直接访问功能页: http://localhost:5173/process-verification
echo      （直接测试工艺验证页面）
echo.
echo 🔍 4. 功能验证点
echo    □ 在AI智能体页面能看到新增的卡片（带"新功能"标签）
echo    □ 点击卡片能跳转到工艺验证页面
echo    □ 工艺验证页面能正常显示筛选条件
echo    □ 能选择工位、工具类型、螺栓类型等
echo    □ 点击"智能分析推荐"能生成结果
echo    □ 能查看拧紧曲线预览
echo.
echo 📚 5. 相关文档
echo    - 功能文档: 功能文档_拧紧工艺改进与验证智能体_2025-12-14_v1.0.0.md
echo    - 快速入门: 快速入门_拧紧工艺改进与验证_2025-12-14.md
echo    - 完成报告: ✅_完成报告_拧紧工艺改进与验证智能体_2025-12-14.md
echo.
echo ========================================
echo 💡 常见问题排查
echo ========================================
echo.
echo ❓ 问题1: 看不到新卡片
echo    解决: 清除浏览器缓存，硬刷新 (Ctrl+Shift+R)
echo.
echo ❓ 问题2: 点击卡片无反应
echo    解决: 检查浏览器控制台错误信息
echo.
echo ❓ 问题3: 页面显示空白
echo    解决: 确认路由配置正确，重启服务器
echo.
echo ========================================
echo.

choice /C 123 /N /M "请选择操作: [1]打开AI智能体页面 [2]直接打开工艺验证页面 [3]查看文档"

if errorlevel 3 goto docs
if errorlevel 2 goto direct
if errorlevel 1 goto agents

:agents
echo.
echo 🌐 正在打开 AI智能体页面...
start http://localhost:5173/ai-agents
echo.
echo ✅ 已在浏览器中打开
echo    请查找第8个智能体卡片："拧紧工艺改进与验证"
echo    （带有"新功能"标签，蓝色高亮背景）
pause
exit

:direct
echo.
echo 🌐 正在打开 拧紧工艺改进与验证页面...
start http://localhost:5173/process-verification
echo.
echo ✅ 已在浏览器中打开
echo    如果看到空白页面，请检查：
echo    1. 开发服务器是否已重启
echo    2. 浏览器控制台是否有错误
pause
exit

:docs
echo.
echo 📚 正在打开功能文档...
start 功能文档_拧紧工艺改进与验证智能体_2025-12-14_v1.0.0.md
echo.
echo 📖 文档已打开
pause
exit
