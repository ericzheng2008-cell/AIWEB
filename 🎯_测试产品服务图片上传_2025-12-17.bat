@echo off
chcp 65001 >nul
echo.
echo ===================================================
echo  测试产品服务后台图片上传功能
echo ===================================================
echo.
echo 开发服务器地址: http://localhost:3002
echo.
echo 测试步骤:
echo 1. 访问后台管理 - 产品与服务管理
echo 2. 在一级分类编辑中测试本地图片上传
echo 3. 在二级分类编辑中测试本地图片上传
echo 4. 在三级分类编辑中测试本地图片上传
echo 5. 在产品编辑中测试多图上传功能
echo.
echo 新功能:
echo - 拖拽上传图片
echo - 支持 JPG、PNG、GIF、WebP 格式
echo - 最大 2MB 大小限制
echo - 实时预览已上传图片
echo - 产品支持多张图片上传
echo.
pause
start http://localhost:3002/#/admin/products-services
