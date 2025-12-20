@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🚀 测试询盘按钮拖拽功能
echo ========================================
echo.
echo 📋 功能说明：
echo   询盘提交按钮现在支持自由拖拽移动
echo   可以将按钮拖到屏幕任意位置
echo.
echo ----------------------------------------
echo.
echo 🎯 测试步骤：
echo.
echo 【基本拖拽】
echo   1. 找到右下角粉色渐变询盘按钮
echo   2. 鼠标长按按钮并移动
echo   3. 拖拽到其他位置
echo   4. 释放鼠标查看效果
echo.
echo 【交互测试】
echo   5. 快速点击按钮
echo   6. 验证询盘表单正常打开
echo   7. 关闭表单
echo   8. 再次拖拽按钮测试
echo.
echo 【视觉反馈】
echo   9. 观察拖拽时鼠标样式变化
echo   10. 观察阴影增强效果
echo   11. 观察轻微缩放效果
echo.
echo ----------------------------------------
echo.
echo 💡 拖拽技巧：
echo   - 长按拖拽：鼠标按住0.2秒后移动
echo   - 快速点击：仍可正常打开表单
echo   - 边界保护：不会拖出屏幕范围
echo   - 触摸设备：同样支持拖拽
echo.
echo ----------------------------------------
echo.
echo 🌐 正在打开测试页面...
timeout /t 2 >nul
start http://localhost:3002
echo.
echo ✅ 浏览器已打开！
echo.
echo 🔍 测试重点：
echo   ✓ 拖拽流畅度
echo   ✓ 边界限制
echo   ✓ 不误触发点击
echo   ✓ 视觉反馈效果
echo.
pause
