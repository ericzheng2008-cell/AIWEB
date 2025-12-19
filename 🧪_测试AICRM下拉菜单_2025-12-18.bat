@echo off
chcp 65001 >nul
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║       🧪 AICRM下拉菜单优化测试                              ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo.
echo 📋 测试清单:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo   第一步: 观察用户信息区域
echo   ┌────────────────────────────────────────┐
echo   │ ✓ 右上角"销售经理"是否有圆角背景        │
echo   │ ✓ 是否有下拉箭头图标                    │
echo   │ ✓ 鼠标悬停背景是否加深                  │
echo   │ ✓ 箭头是否旋转180度                     │
echo   └────────────────────────────────────────┘
echo.
echo   第二步: 点击打开下拉菜单
echo   ┌────────────────────────────────────────┐
echo   │ ✓ 菜单是否圆角卡片样式                  │
echo   │ ✓ 字体是否为 15px 粗体                  │
echo   │ ✓ 每项是否有彩色图标                    │
echo   │ ✓ 菜单阴影是否明显                      │
echo   └────────────────────────────────────────┘
echo.
echo   第三步: 测试菜单项交互
echo   ┌────────────────────────────────────────┐
echo   │ ✓ 悬停是否变紫色渐变背景                │
echo   │ ✓ 文字和图标是否变白色                  │
echo   │ ✓ 动画过渡是否平滑                      │
echo   └────────────────────────────────────────┘
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 🎯 准备操作:
echo.
choice /C 123 /N /M "  [1] 打开AICRM页面测试  [2] 查看对比演示  [3] 退出: "

if errorlevel 3 goto :end
if errorlevel 2 goto :demo
if errorlevel 1 goto :test

:test
echo.
echo ⚡ 正在打开 AICRM 页面...
start http://localhost:5173/#/aicrm
timeout /t 2 /nobreak >nul
echo.
echo ✅ 已打开! 请按照上述测试清单逐项检查
echo.
goto :menu

:demo
echo.
echo ⚡ 正在打开对比演示...
start "" "%~dp0📊_AICRM下拉菜单优化对比_2025-12-18.html"
timeout /t 2 /nobreak >nul
echo.
echo ✅ 已打开对比演示页面
echo.
goto :menu

:menu
echo.
choice /C YN /N /M "是否继续其他测试? (Y/N): "
if errorlevel 2 goto :end
goto :eof

:end
echo.
echo ═══════════════════════════════════════════════════════════
echo   感谢测试! 如有问题请及时反馈 😊
echo ═══════════════════════════════════════════════════════════
echo.
pause
