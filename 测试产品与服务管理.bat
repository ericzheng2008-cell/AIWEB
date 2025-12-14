@echo off
chcp 65001 >nul
echo ========================================
echo   测试：产品与服务页面管理功能
echo ========================================
echo.
echo 🚀 正在打开测试页面...
echo.
echo 📋 测试清单：
echo   1. 后台管理页面
echo   2. 前台展示页面
echo.
timeout /t 2 /nobreak >nul

echo ✅ 打开后台管理（请登录后查看）
start http://localhost:3003/admin/products-services

timeout /t 2 /nobreak >nul

echo ✅ 打开前台展示页面
start http://localhost:3003/products-services

echo.
echo ========================================
echo   测试步骤：
echo ========================================
echo.
echo 【后台管理测试】
echo   1. 登录账号：admin / admin123
echo   2. 进入"产品与服务管理"
echo   3. 编辑页面横幅（标题、背景图、颜色）
echo   4. 添加产品分类（名称、描述、图片）
echo   5. 调整页面布局设置
echo   6. 点击保存
echo.
echo 【前台展示测试】
echo   1. 刷新前台页面（F5）
echo   2. 查看横幅是否更新
echo   3. 查看产品分类卡片是否更新
echo   4. 测试响应式布局
echo.
echo ========================================
echo   测试完成！
echo ========================================
echo.
echo 💡 提示：
echo   - 修改后请刷新前台页面查看效果
echo   - 详细使用说明请查看：使用指南_产品与服务页面编辑_2025-12-14_v1.0.0.md
echo.
pause
