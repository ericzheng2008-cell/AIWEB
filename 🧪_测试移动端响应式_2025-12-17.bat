@echo off
chcp 65001 >nul
echo.
echo ================================================
echo   📱 移动端响应式测试指南
echo ================================================
echo.
echo 【测试方法1：浏览器开发者工具】
echo.
echo 1. 启动开发服务器（如未启动）
echo    运行: npm run dev
echo.
echo 2. 打开浏览器（Chrome/Edge）
echo.
echo 3. 按 F12 打开开发者工具
echo.
echo 4. 按 Ctrl+Shift+M 切换设备模拟模式
echo.
echo 5. 测试以下设备：
echo    • iPhone SE (375x667)
echo    • iPhone 12 Pro (390x844)
echo    • iPhone 14 Pro Max (430x932)
echo    • iPad (768x1024)
echo    • iPad Pro (1024x1366)
echo.
echo 6. 测试横竖屏切换
echo.
echo ================================================
echo.
echo 【测试方法2：实际移动设备】
echo.
echo 1. 确保电脑和手机在同一WiFi网络
echo.
echo 2. 获取电脑IP地址：
echo    • Windows: ipconfig
echo    • Mac: ifconfig
echo.
echo 3. 在手机浏览器输入：
echo    http://你的电脑IP:5173
echo    例如: http://192.168.1.100:5173
echo.
echo ================================================
echo.
echo 【现在打开默认浏览器并启用移动模拟】
echo.
pause

echo.
echo 正在打开浏览器...
start http://localhost:5173

echo.
echo ================================================
echo   ✅ 测试要点
echo ================================================
echo.
echo 1. 【导航栏】
echo    - 移动端显示汉堡菜单 ✓
echo    - 点击展开侧滑菜单 ✓
echo    - 子菜单展开/收起 ✓
echo.
echo 2. 【首页Banner】
echo    - 高度自适应 ✓
echo    - 文字居中显示 ✓
echo    - 按钮堆叠排列 ✓
echo.
echo 3. 【产品栅格】
echo    - 手机：1列布局 ✓
echo    - 手机横屏：2列布局 ✓
echo    - 平板：2-3列布局 ✓
echo.
echo 4. 【智能体卡片】
echo    - 手机：1列显示 ✓
echo    - 平板：2-3列显示 ✓
echo.
echo 5. 【图表】
echo    - 高度自适应 ✓
echo    - 横向可滚动 ✓
echo.
echo 6. 【表格】
echo    - 横向滚动 ✓
echo    - 手指滑动流畅 ✓
echo.
echo 7. 【对话框】
echo    - 移动端宽度95%% ✓
echo    - 平板宽度80%% ✓
echo.
echo 8. 【AI聊天框】
echo    - 移动端全屏显示 ✓
echo    - 触发按钮固定右下角 ✓
echo.
echo 9. 【触摸优化】
echo    - 按钮最小44x44px ✓
echo    - 点击反馈明显 ✓
echo    - 无hover残留 ✓
echo.
echo 10. 【横竖屏切换】
echo     - 布局自动调整 ✓
echo     - 无内容溢出 ✓
echo.
echo ================================================
echo.
echo 按F12打开开发者工具后，按Ctrl+Shift+M进入移动模拟
echo.
pause
