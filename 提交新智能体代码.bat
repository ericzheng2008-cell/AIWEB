@echo off
chcp 65001 >nul
echo ========================================
echo 提交"拧紧工艺改进与验证智能体"代码
echo ========================================
echo.

echo 📋 检查当前状态...
git status --short
echo.

echo 📝 添加文件到暂存区...
git add src/views/ProcessVerification.vue
git add src/views/AiAgents.vue
git add src/router/index.js
echo ✅ 核心文件已添加
echo.

echo 📚 添加相关文档...
git add "功能文档_拧紧工艺改进与验证智能体_2025-12-14_v1.0.0.md"
git add "快速入门_拧紧工艺改进与验证_2025-12-14.md"
git add "✅_完成报告_拧紧工艺改进与验证智能体_2025-12-14.md"
git add "智能体完整列表_2025-12-14.md"
git add "验证新智能体.md"
git add "测试拧紧工艺智能体.bat"
echo ✅ 文档已添加
echo.

echo 💾 提交更改...
git commit -m "feat: 新增拧紧工艺改进与验证智能体

- 新增ProcessVerification.vue页面 (56KB)
- 支持PSE拧紧程序参数智能推荐
- 三种控制策略分析 (扭矩/角度/DS控制)
- 拧紧曲线可视化预览
- 工艺改进建议生成
- 拧紧测量数据库管理
- 更新AiAgents.vue添加第8个智能体卡片
- 更新路由配置添加/process-verification
- 完整功能文档和快速入门指南"

if %errorlevel% equ 0 (
    echo.
    echo ✅ 提交成功！
    echo.
    echo 📊 查看提交信息...
    git log -1 --stat
    echo.
    echo ========================================
    echo 🎉 代码已提交到本地仓库
    echo ========================================
    echo.
    echo 💡 下一步操作:
    echo    1. 重启开发服务器: npm run dev
    echo    2. 刷新浏览器: http://localhost:3002/ai-agents
    echo    3. 如需推送到远程: git push
    echo.
) else (
    echo.
    echo ❌ 提交失败！
    echo    请检查错误信息
    echo.
)

pause
