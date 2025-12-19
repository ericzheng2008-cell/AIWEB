@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   调试 ECharts-GL 警告
echo ========================================
echo.
echo 📋 操作步骤：
echo.
echo 1. 确保开发服务器正在运行
echo 2. 打开浏览器控制台（F12）
echo 3. 刷新页面
echo 4. 查看控制台日志：
echo.
echo    应该看到以下日志（表示修复生效）：
echo    ⏳ 3D沙盘: 容器被隐藏，等待显示 (重试 1/10)
echo    ⏳ 3D沙盘: 容器被隐藏，等待显示 (重试 2/10)
echo    ...
echo.
echo    如果仍然看到 [ECharts] Can't get DOM width，说明：
echo    - 浏览器缓存未清除
echo    - 或有其他组件也在调用 ECharts
echo.
echo 5. 切换到"客户沙盘分析"模块
echo 6. 应该看到：
echo    ✅ 3D沙盘: 容器尺寸 XXX×500
echo    ✅ 3D沙盘: 开始初始化
echo    ✅ 3D沙盘: 图表实例已创建
echo    ✅ 3D沙盘: 开始设置option
echo    ✅ 3D沙盘: 渲染完成
echo.
echo ========================================
echo   调试命令
echo ========================================
echo.
echo 清除浏览器缓存：Ctrl + Shift + Delete
echo 硬刷新：Ctrl + Shift + R
echo 查看容器状态：在控制台输入
echo   document.querySelector('[ref="sandbox3DRef"]')
echo.
pause
