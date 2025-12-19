@echo off
chcp 65001 >nul
echo.
echo ===================================================
echo  测试产品与服务数据同步
echo ===================================================
echo.
echo 开发服务器地址: http://localhost:3002
echo.
echo 测试步骤:
echo.
echo 第一步: 访问后台管理
echo   - 打开: http://localhost:3002/#/admin/products-services
echo   - 添加一个新的一级分类
echo   - 记住分类名称
echo.
echo 第二步: 访问前台页面
echo   - 打开: http://localhost:3002/#/products-services
echo   - 查看新添加的分类是否显示
echo.
echo 第三步: 验证实时同步
echo   - 在后台修改分类名称或描述
echo   - 刷新前台页面
echo   - 检查修改是否生效
echo.
echo 第四步: 测试二级和三级分类
echo   - 在后台添加二级、三级分类
echo   - 在前台点击分类查看
echo   - 验证层级关系是否正确
echo.
echo 第五步: 测试产品管理
echo   - 在后台添加产品
echo   - 在前台查看产品是否显示
echo.
echo ===================================================
echo.
pause

echo 正在打开后台管理页面...
start http://localhost:3002/#/admin/products-services
timeout /t 3 /nobreak >nul

echo 正在打开前台展示页面...
start http://localhost:3002/#/products-services

echo.
echo 测试页面已打开！
echo 请按照上述步骤进行测试
echo.
pause
