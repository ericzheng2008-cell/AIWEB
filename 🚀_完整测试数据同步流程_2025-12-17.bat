@echo off
chcp 65001 >nul
color 0A
echo.
echo ========================================
echo 🚀 完整测试数据同步流程
echo ========================================
echo.
echo 📋 测试步骤:
echo.
echo 1️⃣  打开诊断工具查看当前数据状态
echo 2️⃣  打开后台管理添加测试分类
echo 3️⃣  打开前台页面验证是否显示
echo.
echo ========================================
echo.

echo ⏳ 步骤 1/3: 打开诊断工具...
start "" "🔍_诊断产品服务数据同步.html"
timeout /t 2 /nobreak >nul

echo ⏳ 步骤 2/3: 打开后台管理...
start "" "http://localhost:3002/#/admin/products-services"
timeout /t 2 /nobreak >nul

echo ⏳ 步骤 3/3: 打开前台展示...
start "" "http://localhost:3002/#/products-services"
timeout /t 1 /nobreak >nul

echo.
echo ========================================
echo ✅ 所有页面已打开!
echo ========================================
echo.
echo 📝 请按照以下步骤测试:
echo.
echo 1. 在 "诊断工具" 中查看当前数据
echo    - 检查 productsLevel1 是否有数据
echo    - 记录当前分类数量
echo.
echo 2. 在 "后台管理" 中添加新分类:
echo    - 中文名称: 测试产品分类
echo    - 英文名称: Test Category
echo    - 填写描述和图片URL
echo    - 点击保存
echo.
echo 3. 返回 "诊断工具" 点击 "刷新数据检查"
echo    - 确认新分类已保存到 localStorage
echo    - 记录新的分类数量
echo.
echo 4. 在 "前台展示" 按 Ctrl+F5 强制刷新
echo    - 应该看到新添加的分类卡片
echo.
echo ========================================
echo.
echo 💡 提示:
echo - 如果前台不显示，请按 F12 打开开发者工具查看错误
echo - 在 Console 标签查看是否有JavaScript错误
echo - 在 Application → Local Storage 查看数据
echo.
echo ========================================
echo.
pause
