@echo off
chcp 65001 >nul
echo ====================================
echo 🚀 测试设备全生命周期卡片优化
echo ====================================
echo.
echo 📋 验证项目:
echo   ✅ 1. 网页正常运行
echo   ✅ 2. 设备页面所有卡片缩小15%%
echo.
echo ====================================
echo.

echo 🌐 正在打开设备全生命周期管理页面...
echo.
echo 访问地址: http://localhost:5173/equipment-lifecycle
echo.
echo ====================================
echo.
echo 🔍 测试清单:
echo.
echo 【默认状态】
echo   □ 所有卡片显示为原尺寸的85%% (缩小15%%)
echo   □ 单屏可见卡片数量增加
echo   □ 页面布局整齐，无重叠
echo.
echo 【Hover交互】
echo   □ 鼠标悬停时，卡片恢复至100%%
echo   □ 卡片有浮起效果 (z-index提升)
echo   □ 动画流畅，无卡顿
echo   □ 移开鼠标后，卡片恢复85%%
echo.
echo 【重点测试区域】
echo   □ 六层垂直决策架构 - 架构层级卡片
echo   □ 5大确定性抓手 - 大卡片展示
echo   □ 增强版客户痛点 - 问答卡片
echo   □ 设备资产管理 - 设备列表卡片
echo   □ 成本案例 - 案例展示卡片
echo.
echo ====================================
echo.

start http://localhost:5173/equipment-lifecycle

timeout /t 3 /nobreak >nul

echo.
echo ✅ 页面已打开，请在浏览器中验证以上功能
echo.
echo 💡 提示:
echo   - 所有卡片默认应该比之前小15%%
echo   - 鼠标移到卡片上时会恢复原尺寸
echo   - 动画过渡时间0.3秒，应该感觉流畅
echo   - 如果看不到效果，按 Ctrl+Shift+R 强制刷新
echo.
pause
