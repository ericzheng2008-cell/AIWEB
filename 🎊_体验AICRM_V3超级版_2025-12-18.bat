@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║     🎊 明升AICRM v3.0 超级增强版 - 快速体验               ║
echo ║                                                            ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║                                                            ║
echo ║  ✨ 功能亮点:                                              ║
echo ║     • Salesforce Einstein级AI赢率预测                     ║
echo ║     • 25列Excel级报价编辑器                               ║
echo ║     • 完整商机管理(自动调用客户信息)                      ║
echo ║     • 组织影响力图谱(4种角色可视化)                       ║
echo ║     • AI智能推荐行动(高/中/低优先级)                      ║
echo ║     • 竞品动态压力分析(实时评分)                          ║
echo ║                                                            ║
echo ║  📊 访问地址:                                              ║
echo ║     http://localhost:3003/mingsheng-aicrm                 ║
echo ║                                                            ║
echo ║  🚀 准备启动浏览器...                                      ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

timeout /t 2 >nul

start http://localhost:3003/mingsheng-aicrm

echo.
echo ✅ 浏览器已启动！
echo.
echo 💡 如果浏览器未自动打开，请手动访问:
echo    http://localhost:3003/mingsheng-aicrm
echo.
echo 📚 使用指南:
echo    1. 点击"销售漏斗"查看AI驱动的6阶段漏斗
echo    2. 点击"商机管理"创建/编辑商机
echo    3. 点击"报价管理"体验25列Excel编辑器
echo    4. 点击"竞品分析"查看动态竞争压力
echo    5. 在商机详情中查看组织影响力图谱
echo.
pause
