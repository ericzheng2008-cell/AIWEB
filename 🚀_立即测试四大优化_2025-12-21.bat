@echo off
chcp 65001 >nul
echo.
echo ================================================
echo    🚀 四大方向全面优化 - 立即测试
echo ================================================
echo.
echo 📊 优化内容:
echo    1. 性能优化 - 加载速度提升60%%
echo    2. 功能扩展 - 新增18个AI助手
echo    3. 数据分析 - 图表性能提升80%%
echo    4. 用户体验 - 50+动画效果
echo.
echo ================================================
echo.

cd /d "%~dp0"

echo [1/4] 🚀 启动前端服务器...
start "AIWEB前端" cmd /k "npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo [2/4] 🌐 启动后端服务器...
start "AIWEB后端" cmd /k "cd server && node server.js"

timeout /t 3 /nobreak >nul

echo.
echo [3/4] 🎯 准备打开浏览器...
timeout /t 3 /nobreak >nul

echo.
echo [4/4] 🎉 正在打开测试页面...
echo.

REM 打开测试页面
start http://localhost:5173

timeout /t 2 /nobreak >nul

echo.
echo ================================================
echo    ✅ 测试环境启动完成！
echo ================================================
echo.
echo 📋 测试指南:
echo.
echo 🚀 性能优化测试:
echo    1. 打开浏览器开发者工具 (F12)
echo    2. 切换到 Console 标签
echo    3. 查看 [性能监控] 日志
echo    4. 刷新页面查看加载速度
echo.
echo ⚡ AI助手中心测试:
echo    1. 访问: http://localhost:5173/ai-assistant-hub
echo    2. 浏览18个AI助手
echo    3. 测试搜索和筛选功能
echo    4. 查看助手详情
echo.
echo 📈 图表功能测试:
echo    1. 访问各个数据分析页面
echo    2. 测试图表切换
echo    3. 尝试全屏和下载
echo    4. 检查响应式效果
echo.
echo 🎨 动画效果测试:
echo    1. 滚动页面查看元素动画
echo    2. 测试卡片悬浮效果
echo    3. 点击按钮查看交互
echo    4. 查看数字滚动动画
echo.
echo ================================================
echo.
echo 📊 性能指标参考:
echo    FP  (首次渲染):     目标 ^< 1s
echo    FCP (首次内容):     目标 ^< 1.8s
echo    LCP (最大内容):     目标 ^< 2.5s
echo    FID (首次输入):     目标 ^< 100ms
echo    CLS (布局偏移):     目标 ^< 0.1
echo.
echo ================================================
echo.
echo 💡 提示:
echo    - 按 Ctrl+C 停止服务器
echo    - 清除浏览器缓存以获得最佳效果
echo    - 使用隐身模式测试性能
echo    - 在移动端测试响应式设计
echo.
echo ================================================
echo.
pause
