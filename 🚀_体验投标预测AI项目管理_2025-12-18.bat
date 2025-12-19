@echo off
chcp 65001 >nul
title 投标预测AI - 项目管理功能
color 0B

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║       🎯 投标预测AI - 项目与竞对管理功能                      ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo ✨ 新增功能亮点：
echo.
echo  📝 项目管理
echo     • 新增/编辑投标项目
echo     • 录入项目名称、客户、预算、成本
echo     • 填写项目描述
echo.
echo  💼 我方投标
echo     • 录入第一轮报价
echo     • 录入第二轮报价
echo     • 录入第三轮报价
echo     • 填写方案供货范围
echo.
echo  🏢 竞对管理
echo     • 添加多个竞对公司
echo     • 录入公司名称、品牌名称
echo     • 录入竞对三轮报价
echo     • 录入方案供货范围
echo     • 填写历史成交案例和金额
echo     • 删除竞对信息
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 🎨 快速操作指南：
echo.
echo  1️⃣  编辑现有项目
echo     → 点击项目右侧的 ✏️ 编辑按钮
echo.
echo  2️⃣  新增项目
echo     → 点击项目列表右上角的 ➕ 按钮
echo.
echo  3️⃣  添加竞对
echo     → 在编辑对话框中点击"添加竞对"
echo.
echo  4️⃣  查看竞对数据
echo     → 选择项目后查看"竞对报价趋势"
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
echo 🚀 正在启动...
timeout /t 2 >nul
start http://localhost:5173
echo.
echo ✅ 浏览器已打开！
echo    访问：首页 → 国际营销中控台 → 投标预测AI
echo.
echo 💡 提示：
echo    • 所有数据立即保存
echo    • 竞对数据实时显示在主界面
echo    • 支持多个竞对公司
echo.
pause
