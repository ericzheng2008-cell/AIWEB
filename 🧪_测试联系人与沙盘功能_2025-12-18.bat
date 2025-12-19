@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   测试AICRM新增功能
echo ========================================
echo.
echo 📋 测试清单:
echo.
echo 1️⃣  客户沙盘分析
echo    - 策略参数调整
echo    - 模拟执行
echo    - 收益-风险矩阵
echo    - 敏感性分析
echo    - 历史场景对比
echo.
echo 2️⃣  联系人与关系图谱
echo    - 156人联系人管理
echo    - 关系网络可视化
echo    - 关键联系人排名
echo    - 342次互动记录
echo    - AI优先跟进推荐
echo.
echo ========================================
echo.
echo 🚀 正在启动浏览器...
echo.
start http://localhost:5173/#/mingsheng-aicrm-v3
echo.
echo ✅ 浏览器已打开
echo.
echo 📝 测试步骤:
echo.
echo 【客户沙盘测试】
echo 1. 点击顶部导航"客户沙盘"
echo 2. 调整策略参数(价格、折扣、渠道)
echo 3. 点击"运行模拟"
echo 4. 查看收益-风险矩阵图
echo 5. 查看敏感性分析图
echo 6. 查看AI策略建议
echo 7. 查看历史场景对比表
echo.
echo 【联系人关系测试】
echo 1. 点击顶部导航"联系人与关系"
echo 2. 查看关系网络图谱
echo 3. 切换视图(网络/层级/矩阵)
echo 4. 搜索联系人"张总"
echo 5. 查看关键联系人TOP 10
echo 6. 查看互动时间轴
echo 7. 查看AI优先跟进推荐
echo 8. 查看潜在关键人物
echo 9. 查看关系维护提醒
echo.
echo ⚠️  注意: 确保开发服务器已启动 (npm run dev)
echo.
pause
