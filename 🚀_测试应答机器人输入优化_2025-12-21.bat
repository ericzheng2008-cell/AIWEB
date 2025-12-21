@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🎉 应答机器人输入区优化测试
echo ========================================
echo.
echo 📋 测试内容:
echo   ✅ 1. 文字输入区(支持多行)
echo   ✅ 2. 语音输入功能
echo   ✅ 3. 发送按钮(圆形大按钮)
echo   ✅ 4. 移动端适配
echo.
echo 🎯 测试步骤:
echo.
echo   【PC端测试】
echo   1. 点击右下角AI人形助手
echo   2. 查看底部输入区域
echo      • 左侧: 蓝色语音按钮🎤
echo      • 中间: 多行输入框
echo      • 右侧: 紫色发送按钮→
echo   3. 测试文字输入:
echo      • 输入文字
echo      • 按Enter发送
echo   4. 测试语音输入:
echo      • 点击麦克风🎤
echo      • 允许麦克风权限
echo      • 说话测试
echo.
echo   【移动端测试】
echo   1. 手机访问: http://localhost:3000
echo   2. 打开应答机器人
echo   3. 检查输入区域是否清晰可见
echo   4. 测试键盘弹出是否正常
echo   5. 测试语音功能(仅Chrome/Safari)
echo.
echo 💡 浏览器支持:
echo   ✅ Chrome - 完美支持(推荐)
echo   ✅ Edge - 完美支持
echo   ✅ Safari - 完美支持
echo   ⚠️ Firefox - 仅支持文字输入
echo.
echo 🎤 语音识别测试:
echo   • 点击麦克风按钮
echo   • 看到红色脉冲动画
echo   • 清晰说话: "你好"
echo   • 自动识别并发送
echo.
echo ========================================
echo.
pause
echo.
echo 🚀 正在启动开发服务器...
echo.
cd /d "%~dp0"
start cmd /k "npm run dev"
timeout /t 3 >nul
echo.
echo ✅ 服务器已启动
echo.
echo 📱 访问地址:
echo    • PC端: http://localhost:3000
echo    • 手机端: 扫描二维码或输入局域网IP
echo.
echo 🎯 测试重点:
echo    1. 输入区是否明显可见
echo    2. 语音按钮是否可用
echo    3. 文字输入是否流畅
echo    4. 发送按钮是否醒目
echo    5. 移动端布局是否正常
echo.
echo 按任意键打开浏览器...
pause >nul
start http://localhost:3000
echo.
echo ✅ 已打开浏览器
echo    请点击右下角AI助手进行测试！
echo.
pause
