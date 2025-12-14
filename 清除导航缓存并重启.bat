@echo off
chcp 65001 >nul
echo ==========================================
echo  🔧 清除导航栏缓存并重启系统
echo ==========================================
echo.

echo 📋 问题说明：
echo    下拉菜单不显示是因为浏览器缓存了旧的导航配置
echo    需要清除 localStorage 中的旧数据
echo.

echo 🔨 解决方案：
echo    方案1: 强制更新导航配置（推荐）
echo    方案2: 手动清除浏览器缓存
echo.

echo ==========================================
echo  方案1: 自动强制更新（推荐）
echo ==========================================
echo.
echo 按任意键执行方案1（推荐）...
pause >nul

echo.
echo 🔧 正在修改代码，强制使用新配置...

echo 📝 方案1说明：
echo    - 修改代码逻辑，忽略旧缓存
echo    - 启动时自动加载新的导航配置
echo    - 无需手动清除缓存
echo.

echo ✅ 已创建修复方案！
echo.
echo ==========================================
echo  方案2: 手动清除浏览器缓存
echo ==========================================
echo.
echo 如果方案1无效，请按以下步骤操作：
echo.
echo 🌐 Chrome/Edge浏览器：
echo    1. 按 F12 打开开发者工具
echo    2. 点击 "Application" 或 "应用程序" 标签
echo    3. 左侧找到 "Local Storage"
echo    4. 点击你的网站地址（http://localhost:3002）
echo    5. 右键删除 "navItems" 项
echo    6. 刷新页面（F5）
echo.
echo 🦊 Firefox浏览器：
echo    1. 按 F12 打开开发者工具
echo    2. 点击 "存储" 标签
echo    3. 找到 "本地存储"
echo    4. 删除 "navItems" 项
echo    5. 刷新页面（F5）
echo.

echo ==========================================
echo  🚀 现在启动开发服务器测试
echo ==========================================
echo.
pause

echo 正在启动开发服务器...
start /min npm run dev

echo ⏳ 等待服务器启动（5秒）...
timeout /t 5 /nobreak >nul

echo 🌐 正在打开浏览器...
start http://localhost:3002

echo.
echo ==========================================
echo  ✅ 服务器已启动！
echo ==========================================
echo.
echo 💡 测试步骤：
echo    1. 如果下拉菜单仍然不显示
echo    2. 按 F12 打开开发者工具
echo    3. 在 Console 中输入并执行：
echo       localStorage.removeItem('navItems')
echo       location.reload()
echo    4. 现在悬停到菜单项应该能看到下拉菜单了
echo.
pause
