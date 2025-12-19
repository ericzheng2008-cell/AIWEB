@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🧪 测试AICRM自然语言交互功能
echo ========================================
echo.
echo 📋 测试场景:
echo.
echo ✅ Phase 1: 快速指令测试
echo    1. 点击搜索框
echo    2. 选择"普通搜索模式"
echo    3. 点击"高价值客户"快速指令
echo    4. 验证是否跳转到客户360°视图
echo.
echo ✅ Phase 2: NLP智能解析测试
echo    1. 在搜索框输入: 查询本月高价值客户
echo    2. 按回车执行
echo    3. 验证是否正确解析并显示提示
echo.
echo ✅ Phase 3: AI对话助手测试
echo    1. 点击搜索框
echo    2. 切换到"AI模式"
echo    3. 输入: 本月有多少高流失风险客户
echo    4. 验证AI回复内容
echo    5. 点击[查看详情]按钮
echo    6. 验证是否跳转到客户360°视图
echo.
echo ✅ 历史记录测试
echo    1. 执行几次查询
echo    2. 查看"最近查询"列表
echo    3. 点击历史记录重播
echo    4. 删除单条历史记录
echo.
echo ✅ 智能推荐测试
echo    1. 切换到AI模式
echo    2. 查看智能推荐标签
echo    3. 点击推荐标签自动执行
echo.
echo ========================================
echo   🚀 正在启动开发服务器...
echo ========================================
echo.
echo 📍 访问地址: http://localhost:5173
echo 📍 AICRM入口: http://localhost:5173/#/mingsheng-aicrm-v3
echo.
echo 💡 提示: 
echo    - 搜索框默认提示: 💬 试试说: 查询本月高流失风险客户...
echo    - 点击搜索框打开智能搜索面板
echo    - 切换AI模式体验ChatGPT式对话
echo    - 快速指令网格布局,2列展示
echo    - 历史记录最多保存10条
echo.
pause
npm run dev
