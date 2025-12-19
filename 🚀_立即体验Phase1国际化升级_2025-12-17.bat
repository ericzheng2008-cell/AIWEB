@echo off
chcp 65001 > nul
color 0A

echo.
echo ========================================
echo   🌍 Phase 1 国际化快速优化
echo   立即体验新功能！
echo ========================================
echo.
echo ✅ 已完成的功能：
echo.
echo 1️⃣  多语言支持（7种语言）
echo    • 简体中文 🇨🇳
echo    • English 🇺🇸
echo    • Español 🇪🇸
echo    • Deutsch 🇩🇪
echo    • 日本語 🇯🇵
echo    • Português 🇧🇷
echo    • Français 🇫🇷
echo.
echo 2️⃣  AI国际买家顾问
echo    • 识别国际买家关键词
echo    • 多语言智能对话
echo    • 产品智能推荐
echo    • 询盘报价引导
echo.
echo 3️⃣  国际化询盘表单
echo    • 20+国家选择
echo    • 多语言表单
echo    • 实时验证
echo    • 移动端优化
echo.
echo ========================================
echo   🧪 测试步骤
echo ========================================
echo.
echo 📌 步骤1：切换语言
echo    → 点击顶部导航栏"语言切换器"
echo    → 选择不同语言查看效果
echo.
echo 📌 步骤2：测试AI顾问
echo    → 点击右下角AI助手
echo    → 输入：international buyer
echo    → 查看国际买家专属服务
echo.
echo 📌 步骤3：填写询盘表单
echo    → 点击右下角"获取报价"按钮
echo    → 填写表单信息
echo    → 选择国家
echo    → 提交测试
echo.
echo ========================================
echo.
echo 正在启动开发服务器...
echo.

cd /d "%~dp0"
npm run dev

pause
