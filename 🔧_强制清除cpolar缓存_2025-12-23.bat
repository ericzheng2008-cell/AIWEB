@echo off
chcp 65001 >nul
echo.
echo ════════════════════════════════════════════════════
echo    🔥 强制清除cpolar VIP链接缓存
echo ════════════════════════════════════════════════════
echo.
echo 【问题】手机端cpolar VIP链接显示旧版本
echo 【原因】多层缓存：浏览器缓存 + cpolar隧道缓存 + Vite服务器缓存
echo 【方案】三步清除 + 强制刷新
echo.
echo ════════════════════════════════════════════════════
echo.

echo [1/4] 🧹 更新版本号...
echo {"version":"2025.12.23.%RANDOM%","updateTime":"%date% %time%","changelog":["强制刷新cpolar缓存"]} > public\version.json
echo ✅ 版本号已更新

echo.
echo [2/4] 🔄 重启Vite开发服务器...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
start /B cmd /c "npm run dev > nul 2>&1"
echo ✅ Vite服务器重启中...

echo.
echo [3/4] 🔄 重启cpolar隧道...
taskkill /F /IM cpolar.exe >nul 2>&1
timeout /t 2 /nobreak >nul
start /B cmd /c "cpolar http 5173 --region=cn_vip"
timeout /t 5 /nobreak >nul
echo ✅ cpolar隧道重启完成

echo.
echo [4/4] 📱 生成强制刷新链接...
echo.
echo ════════════════════════════════════════════════════
echo    🎯 手机端清除缓存完整步骤
echo ════════════════════════════════════════════════════
echo.
echo 📱 iPhone/iPad:
echo    1. 设置 → Safari → 清除历史记录与网站数据
echo    2. 重启Safari浏览器
echo    3. 访问 cpolar VIP 链接
echo    4. 长按刷新按钮选择"无痕浏览"模式
echo.
echo 📱 Android:
echo    1. Chrome → 三点菜单 → 历史记录 → 清除浏览数据
echo    2. 勾选"缓存"和"Cookie"
echo    3. 重启Chrome浏览器
echo    4. 访问 cpolar VIP 链接
echo.
echo 📱 微信内置浏览器:
echo    1. 右上角三点菜单 → 在浏览器中打开
echo    2. 使用系统浏览器访问
echo.
echo ════════════════════════════════════════════════════
echo.
echo ⚡ 强制刷新技巧:
echo    • 在链接末尾添加 ?t=%RANDOM%
echo    • 或使用无痕/隐私浏览模式
echo.
echo ════════════════════════════════════════════════════
echo.
echo 💡 等待10秒后按任意键获取新链接...
timeout /t 10
pause
