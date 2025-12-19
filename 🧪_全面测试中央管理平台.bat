@echo off
chcp 65001 >nul
cls

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║      🧪 中央管理平台全面功能测试                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo ══════════════════════════════════════════════════════════════
echo   📋 测试计划
echo ══════════════════════════════════════════════════════════════
echo.
echo   Phase 1: 智能体注册中心 - 界面、编辑、数据
echo   Phase 2: 知识库管理 - Markdown、分类、标签
echo   Phase 3: 主动学习引擎 - 反馈、任务、评估
echo   Phase 4: 监控与优化 - 性能、告警、优化
echo.
echo ══════════════════════════════════════════════════════════════
echo.

pause

echo.
echo 🚀 正在启动测试...
echo.

REM 检查服务器是否运行
echo [1/5] 检查开发服务器...
netstat -ano | findstr :3002 >nul
if errorlevel 1 (
    echo ❌ 服务器未运行，请先启动开发服务器！
    echo.
    echo 运行命令：npm run dev
    pause
    exit /b 1
) else (
    echo ✅ 服务器运行中 (端口 3002)
)

echo.
echo ══════════════════════════════════════════════════════════════
echo   📝 Phase 1: 智能体注册中心测试
echo ══════════════════════════════════════════════════════════════
echo.

timeout /t 2 /nobreak >nul

echo 正在打开智能体注册中心...
start http://localhost:3002/admin/agent-registry

echo.
echo 📋 测试要点：
echo   1. 页面是否正常显示（标题、统计卡片）
echo   2. 点击"注册智能体"按钮，表单是否弹出
echo   3. 填写表单后能否成功提交
echo   4. 点击表格中的"编辑"，能否修改数据
echo   5. 点击"查看详情"，详情对话框是否显示
echo   6. 启用/禁用开关是否工作
echo   7. 删除功能是否有确认提示
echo.

pause

echo.
echo ══════════════════════════════════════════════════════════════
echo   📚 Phase 2: 知识库管理测试
echo ══════════════════════════════════════════════════════════════
echo.

timeout /t 2 /nobreak >nul

echo 正在打开知识库管理...
start http://localhost:3002/admin/knowledge-base

echo.
echo 📋 测试要点：
echo   1. 统计卡片数据是否显示
echo   2. 点击"添加知识"，对话框是否弹出
echo   3. Markdown 编辑器是否可用
echo   4. 预览功能是否正常
echo   5. 提交后知识是否添加到列表
echo   6. 点击"查看"，Markdown 是否正确渲染
echo   7. 编辑知识功能是否可用
echo   8. 切换到"分类管理"标签，是否可以管理分类
echo   9. 切换到"标签管理"标签，是否可以管理标签
echo  10. 搜索和筛选是否正常工作
echo.

pause

echo.
echo ══════════════════════════════════════════════════════════════
echo   🧠 Phase 3: 主动学习引擎测试
echo ══════════════════════════════════════════════════════════════
echo.

timeout /t 2 /nobreak >nul

echo 正在打开主动学习引擎...
start http://localhost:3002/admin/learning-engine

echo.
echo 📋 测试要点：
echo   1. 统计卡片是否显示（总反馈数、平均评分等）
echo   2. 学习引擎开关是否可以切换
echo   3. 反馈数据表格是否显示
echo   4. 点击"添加反馈"，表单是否弹出
echo   5. 提交反馈后是否添加到列表
echo   6. 点击"处理反馈"，是否生成学习任务
echo   7. 切换到"学习任务"标签，任务列表是否显示
echo   8. 点击"执行任务"，是否显示执行进度
echo   9. 切换到"知识评估"标签
echo  10. 点击"评估所有知识质量"，是否显示评估结果
echo  11. 切换到"学习配置"标签，配置是否可修改
echo.

pause

echo.
echo ══════════════════════════════════════════════════════════════
echo   📊 Phase 4: 监控与优化测试
echo ══════════════════════════════════════════════════════════════
echo.

timeout /t 2 /nobreak >nul

echo 正在打开监控与优化中心...
start http://localhost:3002/admin/monitoring

echo.
echo 📋 测试要点：
echo   1. 系统健康度卡片是否显示
echo   2. 性能基准对比表格是否显示
echo   3. 点击"运行基准测试"，是否执行测试
echo   4. 测试完成后数据是否更新
echo   5. 切换到"告警管理"标签，告警列表是否显示
echo   6. 点击"添加规则"，表单是否弹出
echo   7. 活跃告警是否正确显示
echo   8. 切换到"数据分析"标签，错误日志是否显示
echo   9. 切换到"资源优化"标签，优化建议是否显示
echo  10. 点击"应用"建议，是否执行优化
echo  11. 实时监控开关是否工作
echo.

pause

echo.
echo ══════════════════════════════════════════════════════════════
echo   🔍 浏览器控制台检查
echo ══════════════════════════════════════════════════════════════
echo.
echo 请在每个页面执行以下检查：
echo.
echo 1. 按 F12 打开开发者工具
echo 2. 查看 Console 标签是否有错误（红色）
echo 3. 查看 Network 标签，资源是否都加载成功
echo 4. 查看 Application 标签 - Local Storage
echo    应该包含以下数据：
echo    • agentRegistry_agents
echo    • agentRegistry_interactions
echo    • knowledgeBase_entries
echo    • learningEngine_feedbacks
echo    • monitoringSystem_metrics
echo.

pause

echo.
echo ══════════════════════════════════════════════════════════════
echo   📊 数据持久化测试
echo ══════════════════════════════════════════════════════════════
echo.
echo 测试数据是否正确保存：
echo.
echo 1. 在智能体注册中心添加一个测试智能体
echo 2. 刷新页面（F5）
echo 3. 检查新添加的智能体是否还在
echo.
echo 4. 在知识库添加一条测试知识
echo 5. 刷新页面
echo 6. 检查知识是否还在
echo.
echo 如果数据丢失，说明 localStorage 保存有问题
echo.

pause

echo.
echo ══════════════════════════════════════════════════════════════
echo   ✅ 测试完成报告
echo ══════════════════════════════════════════════════════════════
echo.
echo 请根据测试结果填写：
echo.
echo Phase 1 - 智能体注册中心:
echo   [ ] ✅ 完全正常  [ ] ⚠️ 部分问题  [ ] ❌ 严重问题
echo.
echo Phase 2 - 知识库管理:
echo   [ ] ✅ 完全正常  [ ] ⚠️ 部分问题  [ ] ❌ 严重问题
echo.
echo Phase 3 - 主动学习引擎:
echo   [ ] ✅ 完全正常  [ ] ⚠️ 部分问题  [ ] ❌ 严重问题
echo.
echo Phase 4 - 监控与优化:
echo   [ ] ✅ 完全正常  [ ] ⚠️ 部分问题  [ ] ❌ 严重问题
echo.
echo ══════════════════════════════════════════════════════════════
echo.
echo 📝 详细检查清单请查看：
echo    🔍_全面检查中央管理平台_2025-12-15.md
echo.
echo 如果发现问题，请告诉我：
echo   1. 哪个页面/功能有问题
echo   2. 具体的错误信息（控制台截图）
echo   3. 操作步骤
echo.
echo ══════════════════════════════════════════════════════════════
echo.

pause
