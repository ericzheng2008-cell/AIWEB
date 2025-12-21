@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🚀 测试后台视频图片上传优化
echo ========================================
echo.
echo 📋 测试内容：
echo   1. 明星产品 - 本地视频上传（推荐）
echo   2. 明星产品 - 视频链接（可选）
echo   3. 产品服务 - 产品视频上传
echo   4. 产品服务 - 视频预览功能
echo.
echo ========================================
echo.

echo 🔧 正在启动开发服务器...
cd /d "%~dp0"
start cmd /k "npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ✅ 服务器启动中...
echo.
echo 📍 测试路径：
echo   • 明星产品管理：http://localhost:3002/admin
echo   • 产品服务管理：http://localhost:3002/admin/products-services
echo.
echo ========================================
echo   📖 测试步骤
echo ========================================
echo.
echo 【明星产品测试】
echo   1. 访问：http://localhost:3002/admin
echo   2. 点击"明星产品"标签
echo   3. 点击"添加明星产品"
echo   4. 选择"视频文件 (MP4)" ✅ 推荐
echo   5. 拖拽视频文件到上传区域
echo   6. 查看实时预览
echo   7. 保存产品
echo.
echo 【产品服务测试】
echo   1. 访问：http://localhost:3002/admin/products-services
echo   2. 点击"产品详情"标签
echo   3. 点击"添加产品"
echo   4. 找到"产品视频"区域
echo   5. 选择"本地上传"或"链接地址"
echo   6. 上传视频文件或输入链接
echo   7. 查看预览效果
echo   8. 保存产品
echo.
echo ========================================
echo   ✨ 新功能特性
echo ========================================
echo.
echo ✅ 本地上传优先（带"推荐"标签）
echo ✅ 视频链接改为可选（非必填）
echo ✅ 拖拽上传支持
echo ✅ 实时预览功能
echo ✅ 文件大小验证（视频最大100MB）
echo ✅ 产品视频双模式上传
echo.
echo 正在打开浏览器...
timeout /t 3 /nobreak >nul
start http://localhost:3002/admin

echo.
echo ========================================
echo   测试完成后请检查：
echo   • 视频上传是否成功
echo   • 预览是否正常显示
echo   • 前台是否正确显示
echo ========================================
echo.
pause
