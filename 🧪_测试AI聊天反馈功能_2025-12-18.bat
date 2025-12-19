@echo off
chcp 65001 >nul
color 0A
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║    🎓 AI聊天机器人自我训练功能测试                         ║
echo ║    完成时间: 2025-12-18                                    ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📋 新增功能:
echo ════════════════════════════════════════════════════════════
echo  ✅ 1. AI回答反馈系统 (👍 有帮助 / 👎 没帮助)
echo  ✅ 2. 学习数据自动收集
echo  ✅ 3. 满意度统计分析
echo  ✅ 4. 高频难题识别
echo  ✅ 5. 反馈数据导出
echo ════════════════════════════════════════════════════════════
echo.
echo 🚀 正在启动开发服务器...
timeout /t 2 >nul

start cmd /k "cd /d C:\Users\EricZ\CodeBuddy\AIWEB1 && npm run dev"

echo.
echo ⏳ 等待服务器启动 (5秒)...
timeout /t 5 >nul

echo.
echo ✅ 服务器已启动！正在打开测试页面...
echo.

start http://localhost:3002/

timeout /t 2 >nul

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║    📖 测试步骤                                             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 【步骤1: 打开AI聊天】
echo ────────────────────────────────────────────────────────────
echo  1️⃣  点击网页右下角的"AI人形助手"
echo  2️⃣  聊天窗口自动弹出
echo.
echo 【步骤2: 发送测试问题】
echo ────────────────────────────────────────────────────────────
echo  测试问题建议:
echo  • "如何选择扭矩工具？"
echo  • "我需要工具选型帮助"
echo  • "帮我分析拧紧曲线"
echo  • "查看设备运行状态"
echo.
echo 【步骤3: 验证反馈功能】
echo ────────────────────────────────────────────────────────────
echo  在AI回答下方检查:
echo  ✓ 显示 "这个回答有帮助吗？"
echo  ✓ 显示 [👍 有帮助] [👎 没帮助] 按钮
echo  ✓ 按钮样式正常（绿色success / 红色danger）
echo.
echo 【步骤4: 提交反馈】
echo ────────────────────────────────────────────────────────────
echo  1️⃣  点击任意反馈按钮
echo  2️⃣  验证提示: "感谢您的反馈！"
echo  3️⃣  按钮变为禁用状态（不可再次点击）
echo.
echo 【步骤5: 验证数据存储】
echo ────────────────────────────────────────────────────────────
echo  在浏览器中:
echo  1️⃣  按F12打开开发者工具
echo  2️⃣  切换到Console标签
echo  3️⃣  输入以下命令:
echo.
echo     JSON.parse(localStorage.getItem('ai-chat-feedbacks'))
echo.
echo  4️⃣  检查返回数据:
echo     ✓ feedbacks数组包含反馈记录
echo     ✓ stats统计数据正确
echo     ✓ totalFeedbacks大于0
echo.
echo 【步骤6: 测试多条反馈】
echo ────────────────────────────────────────────────────────────
echo  1️⃣  发送多个不同问题
echo  2️⃣  对每个回答提供反馈
echo  3️⃣  验证数据累积正确
echo.
echo 【步骤7: 测试导出功能】
echo ────────────────────────────────────────────────────────────
echo  在浏览器Console中执行:
echo.
echo     import { useLearningEngineStore } from '@/store/learningEngine'
echo     const store = useLearningEngineStore()
echo     store.exportFeedbackReport()
echo.
echo  验证:
echo  ✓ 自动下载JSON文件
echo  ✓ 文件名格式: AI聊天反馈报告_时间戳.json
echo  ✓ 文件包含完整数据
echo.
echo 【步骤8: 验证满意度统计】
echo ────────────────────────────────────────────────────────────
echo  在Console中执行:
echo.
echo     const store = useLearningEngineStore()
echo     console.log('总反馈:', store.stats.totalFeedbacks)
echo     console.log('满意度:', store.satisfactionRate + '%%')
echo     console.log('难题列表:', store.frequentProblems)
echo.
echo  验证:
echo  ✓ 满意度百分比计算正确
echo  ✓ 负面反馈≥3次的问题出现在难题列表
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║    🎯 验收标准                                             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo  ✅ 反馈按钮在每条AI消息下方显示
echo  ✅ 点击后显示感谢信息
echo  ✅ 数据正确保存到localStorage
echo  ✅ 满意度计算准确
echo  ✅ 难题识别功能正常
echo  ✅ 导出报告功能可用
echo  ✅ 响应式设计（移动端按钮竖排）
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║    🐛 常见问题                                             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo  Q: 反馈按钮不显示？
echo  A: 检查AI消息是否有question字段
echo.
echo  Q: 数据没有保存？
echo  A: 检查浏览器Console是否有错误
echo.
echo  Q: 导出功能不工作？
echo  A: 确保在浏览器环境，不是Node环境
echo.
echo  Q: 统计数据不对？
echo  A: 清空localStorage重新测试
echo     localStorage.removeItem('ai-chat-feedbacks')
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║    💡 提示                                                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo  • 每10条反馈会触发知识库更新检查（控制台有日志）
echo  • 负面反馈≥3次的问题会被标记为"难题"
echo  • 数据存储在localStorage，关闭浏览器后依然保留
echo  • 可以手动清空数据重新测试
echo.
echo ════════════════════════════════════════════════════════════
echo  🎉 开始测试AI自我训练功能吧！
echo ════════════════════════════════════════════════════════════
echo.
pause
