@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    🎊 明升AICRM智能助手 - 完整功能演示
echo ========================================
echo.
echo 🚀 正在启动...
echo.

timeout /t 2 /nobreak >nul

echo ✅ 打开AICRM主界面...
start http://localhost:3006/mingsheng-aicrm

timeout /t 2 /nobreak >nul

echo ✅ 打开主页 (查看AICRM卡片)...
start http://localhost:3006

timeout /t 1 /nobreak >nul

echo ✅ 打开功能总览文档...
start "" "🎊_AICRM卡片完整功能总览_2025-12-18.md"

echo.
echo ========================================
echo    📊 AICRM 9大核心模块
echo ========================================
echo.
echo  1️⃣  销售漏斗 - AI赢率驱动
echo  2️⃣  商机管理 - 智能跟进
echo  3️⃣  客户360° - 全景画像
echo  4️⃣  客户活动 - 时间线追踪
echo  5️⃣  报价管理 - 快速生成
echo  6️⃣  竞品分析 - 策略建议
echo  7️⃣  投标预测AI - 成功率预测
echo  8️⃣  产品矩阵 - 智能推荐
echo  9️⃣  销售目标 - 目标管理
echo.
echo ========================================
echo    🎯 测试建议
echo ========================================
echo.
echo  ✓ 在AICRM界面点击顶部各个菜单
echo  ✓ 测试每个模块的功能
echo  ✓ 查看AI预测和建议
echo  ✓ 测试数据录入和编辑
echo.
echo ========================================
echo    💡 注意事项
echo ========================================
echo.
echo  • 首次加载可能需要几秒钟
echo  • 建议使用Chrome或Edge浏览器
echo  • 如页面空白请按Ctrl+F5刷新
echo  • 查看Console检查是否有错误
echo.
echo ========================================
echo.
echo 🎉 准备完成！开始体验AICRM吧！
echo.
pause
