@echo off
chcp 65001 >nul
color 0A
title 🚀 手机端缓存解决方案 - 立即测试

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║         📱 手机端缓存问题 - 完整解决方案                  ║
echo ║                                                            ║
echo ║         问题: 后台修改的内容,手机端没有改变               ║
echo ║         原因: 浏览器缓存                                   ║
echo ║         解决: 清除缓存 + 工具页面                         ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

:: 检查服务器状态
echo [1/4] 🔍 检查服务器状态...
timeout /t 1 >nul

tasklist | find "node.exe" >nul
if %errorlevel% equ 0 (
    echo       ✅ 服务器已启动
) else (
    echo       ⚠️  服务器未启动,正在启动...
    start "AIWEB前端" cmd /k "cd /d %~dp0 && npm run dev"
    start "AIWEB后端" cmd /k "cd /d %~dp0server && node server.js"
    echo       ⏳ 等待服务器启动...
    timeout /t 8 >nul
    echo       ✅ 服务器启动完成
)

echo.
echo [2/4] 🌐 打开测试工具...
timeout /t 1 >nul

:: 打开清除缓存工具页面
start "" "http://localhost:3000/clear-cache.html"
echo       ✅ 清除缓存工具已打开

timeout /t 2 >nul

:: 打开前台首页
start "" "http://localhost:3000"
echo       ✅ 前台首页已打开

timeout /t 2 >nul

:: 打开后台管理
start "" "http://localhost:3000/admin"
echo       ✅ 后台管理已打开

echo.
echo [3/4] 📱 手机访问地址:
echo.
echo       局域网访问:
echo       ┌──────────────────────────────────────┐
echo       │  http://%COMPUTERNAME%:3000          │
echo       │  http://192.168.x.x:3000             │
echo       └──────────────────────────────────────┘
echo.
echo       清除缓存工具:
echo       ┌──────────────────────────────────────┐
echo       │  /clear-cache.html                   │
echo       └──────────────────────────────────────┘
echo.
echo       cpolar公网访问:
echo       查看 🌐_所有测试地址_2025-12-21.md

echo.
echo [4/4] 📋 测试步骤:
echo.
echo       【PC端操作】
echo       1. 访问后台: http://localhost:3000/admin
echo       2. 登录: admin / admin123
echo       3. 修改首页LOGO或公司名称
echo       4. 保存并查看前台效果
echo.
echo       【手机端操作 - 清除缓存前】
echo       5. 手机浏览器访问首页
echo       6. 看到旧内容 (未更新)
echo.
echo       【手机端操作 - 清除缓存】
echo       7. 方法A: 浏览器设置 → 清除缓存
echo       8. 方法B: 访问 /clear-cache.html 工具页
echo          → 点击"清除缓存并刷新"按钮
echo.
echo       【手机端操作 - 清除缓存后】
echo       9. 重新访问首页
echo       10. 看到最新内容 (已更新) ✅

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  💡 提示:                                                  ║
echo ║                                                            ║
echo ║  • 后台修改后,PC端立即生效                                ║
echo ║  • 手机端需要清除缓存才能看到更新                         ║
echo ║  • 使用 /clear-cache.html 最简单                          ║
echo ║  • 无痕模式可以验证是否为缓存问题                         ║
echo ╚════════════════════════════════════════════════════════════╝

echo.
echo ════════════════════════════════════════════════════════════
echo   是否查看详细文档? (Y/N)
echo ════════════════════════════════════════════════════════════
echo.
set /p choice=请选择: 

if /i "%choice%"=="Y" (
    echo.
    echo 正在打开文档...
    start "" "📖_手机端后台修改不同步解决指南_2025-12-21.md"
    start "" "✅_手机端缓存问题完整解决方案_2025-12-21.md"
    echo ✅ 文档已打开
)

echo.
echo ════════════════════════════════════════════════════════════
echo   ✅ 所有工具已就绪!
echo ════════════════════════════════════════════════════════════
echo.
echo   📦 已交付工具:
echo   1. 清除缓存工具页: http://localhost:3000/clear-cache.html
echo   2. 详细解决指南: 📖_手机端后台修改不同步解决指南_2025-12-21.md
echo   3. 完整解决方案: ✅_手机端缓存问题完整解决方案_2025-12-21.md
echo   4. 测试工具脚本: 🎯_测试手机端缓存问题_2025-12-21.bat
echo.
echo   🎯 下一步:
echo   1. 用PC浏览器测试后台修改
echo   2. 用手机访问查看效果
echo   3. 如果未更新,使用清除缓存工具
echo.
pause
