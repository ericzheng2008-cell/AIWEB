@echo off
chcp 65001 >nul
echo ======================================
echo    测试设备全生命周期管理5项优化
echo ======================================
echo.
echo 正在启动前端开发服务器...
echo.
start "" "http://localhost:5173/equipment-lifecycle"
echo.
echo ✅ 浏览器已打开设备全生命周期管理页面
echo.
echo 【测试清单】
echo.
echo 1️⃣ 六层决策架构卡片尺寸
echo    - 滚动到"六层垂直决策架构"区域
echo    - 观察卡片是否明显更小（75%%尺寸）
echo    - 鼠标悬停，卡片恢复100%%
echo.
echo 2️⃣ 延寿卡片尺寸
echo    - 滚动到实战案例区域
echo    - 查看"埃安二工厂七轴机器人设备翻新"卡片
echo    - 尺寸应为80%%
echo.
echo 3️⃣ 智能决策模块矩阵
echo    - 滚动到"智能决策模块矩阵"区域
echo    - 观察卡片紧凑排列（80%%尺寸）
echo    - 鼠标悬停，卡片放大
echo.
echo 4️⃣ 进入模块功能
echo    - 在智能决策模块矩阵中
echo    - 点击任一模块的"进入模块"按钮
echo    - 观察是否显示两步反馈：
echo      Step1: "正在进入 XX 模块..."
echo      Step2: 模块专属功能信息
echo.
echo 5️⃣ 获取实时决策功能
echo    - 滚动到"客户最痛的5个问题"区域
echo    - 点击任一问题的"获取实时决策"按钮
echo    - 观察是否显示：
echo      - 问题原文
echo      - "正在调用AI决策引擎..."
echo      - "AI决策已生成！包含详细分析..."
echo.
echo 6️⃣ KPI优化详细计算过程
echo    - 滚动到"闭环数据流"区域
echo    - 鼠标悬停在第6个步骤"KPI优化"卡片上
echo    - 观察是否显示：
echo      ✓ 详细计算过程分割线
echo      ✓ 成本优化 3项数据
echo      ✓ 风险降低 3项数据
echo      ✓ ROI计算 3项数据
echo      ✓ 综合效益提升 47%%
echo.
echo ======================================
echo 按任意键关闭此窗口...
pause >nul
