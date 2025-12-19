@echo off
chcp 65001 >nul
color 0A
cls

echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║      🎯 明星产品管理系统 - 快速测试                        ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo 📋 测试清单:
echo.
echo ┌─────────────────────────────────────────────────────────┐
echo │  1. 后台管理测试                                          │
echo │     http://localhost:5173/#/admin/content-manage        │
echo │     切换到"明星产品"标签                                  │
echo │                                                         │
echo │  2. 添加测试产品                                          │
echo │     - 点击"添加明星产品"                                  │
echo │     - 填写测试数据                                        │
echo │     - 尝试不同媒体类型                                    │
echo │                                                         │
echo │  3. 前台展示测试                                          │
echo │     http://localhost:5173/                              │
echo │     查看"明星产品"区域                                    │
echo └─────────────────────────────────────────────────────────┘
echo.
echo 💡 测试建议:
echo.
echo   📌 测试1: 图片链接
echo      类型: 图片链接
echo      URL: https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200
echo      缩略图: https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800
echo.
echo   📌 测试2: YouTube视频
echo      类型: 视频链接
echo      URL: https://www.youtube.com/embed/dQw4w9WgXcQ
echo      缩略图: https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg
echo.
echo   📌 测试3: GIF动画链接
echo      类型: 动态图片链接
echo      URL: https://media.giphy.com/media/3o7TKSjRrfIPjeiVyU/giphy.gif
echo      缩略图: (使用静态图片)
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 🚀 准备启动浏览器...
timeout /t 3 >nul

echo.
echo ✅ 正在打开管理后台...
start http://localhost:5173/#/admin/content-manage

timeout /t 2 >nul

echo ✅ 正在打开首页...
start http://localhost:5173/

echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 📖 操作步骤:
echo.
echo    1️⃣  在管理后台点击"明星产品"标签
echo    2️⃣  点击"添加明星产品"按钮
echo    3️⃣  按照上方测试建议填写数据
echo    4️⃣  保存后到首页查看效果
echo    5️⃣  测试编辑和删除功能
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 📚 完整文档:
echo    ✅_首页Banner与明星产品管理完成_2025-12-16.md
echo    📘_明星产品管理使用手册_2025-12-16.md
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 💡 提示: 如果服务器未启动，请先运行 start-dev-server.bat
echo.
pause
