@echo off
chcp 65001 >nul
echo.
echo =============================================
echo   🚀 测试资料下载与报价功能
echo =============================================
echo.
echo 📋 测试内容：
echo.
echo    1. 前台资料下载卡片（首页）
echo    2. 顶部导航"索取报价"按钮
echo    3. 用户注册弹窗（人机验证）
echo    4. 后台资料下载管理（/admin）
echo.
echo =============================================
echo.
echo ⏱️  启动开发服务器中...
echo.

cd /d "%~dp0"

echo 🔄 正在启动前端服务器...
start cmd /k "npm run dev"

echo.
echo =============================================
echo   ✅ 服务器启动中，请稍候...
echo =============================================
echo.
echo 📍 预计访问地址：
echo    前台首页：http://localhost:5173
echo    后台管理：http://localhost:5173/admin/material-download
echo.
echo 📖 测试步骤：
echo.
echo    【前台测试】
echo    1. 访问首页，查看"资料下载"卡片
echo    2. 点击"资料下载"卡片，查看资料列表
echo    3. 点击下载某个资料，测试注册弹窗
echo    4. 填写注册信息（姓名、公司、电话、邮箱）
echo    5. 输入验证码，提交注册
echo    6. 查看下载是否成功
echo.
echo    【索取报价测试】
echo    7. 点击顶部导航"索取报价"按钮
echo    8. 填写报价表单（产品需求）
echo    9. 输入验证码，提交报价请求
echo   10. 查看提交成功提示
echo.
echo    【后台管理测试】
echo   11. 登录后台（/admin）
echo   12. 进入"资料下载管理"
echo   13. 测试添加/编辑/删除分类
echo   14. 测试上传PDF/Excel资料
echo   15. 测试查看下载统计
echo   16. 测试查看报价请求列表
echo.
echo =============================================
echo.
pause
