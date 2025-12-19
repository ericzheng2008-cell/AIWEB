@echo off
chcp 65001 >nul
echo.
echo ================================================
echo   🔍 诊断沙盘导航问题
echo ================================================
echo.
echo 📋 诊断步骤：
echo.
echo 1. 启动开发服务器（如果未启动）
echo 2. 访问明升AICRM
echo 3. 打开浏览器控制台（F12）
echo 4. 点击菜单栏的"客户沙盘"按钮
echo 5. 观察控制台日志
echo.
echo ✅ 预期日志：
echo    🔄 切换模块: funnel → sandbox
echo    ✅ 当前模块: sandbox
echo    🔍 检测到父元素变化，检查可见性
echo    🎉 组件已显示，开始初始化！
echo    👤 选择客户: 华为技术有限公司
echo.
echo ❌ 如果没有任何日志输出：
echo    - 菜单点击事件未触发
echo    - 检查 Element Plus 版本兼容性
echo.
echo ❌ 如果只有"切换模块"日志：
echo    - v-show 未正确切换
echo    - 检查 activeModule 绑定
echo.
echo ================================================
echo.
echo 正在启动开发服务器...
npm run dev
