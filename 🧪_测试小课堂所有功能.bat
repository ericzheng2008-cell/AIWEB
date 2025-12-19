@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   小课堂智能体功能测试指南
echo ========================================
echo.
echo 📋 测试项目:
echo.
echo 【前台测试】http://localhost:5173/#/tech-classroom
echo   1. 点击任意一级分类卡片
echo   2. 查看二级分类列表
echo   3. 点击二级分类进入课程列表
echo   4. 查看视频、外部链接、课程三部分内容
echo   5. 点击视频播放
echo   6. 点击课程查看详情
echo   7. 点击外部链接跳转
echo   8. 测试点赞功能
echo   9. 测试所有对话框关闭按钮
echo.
echo 【后台测试】http://localhost:5173/#/admin/classroom
echo   1. 测试一级分类 - 添加/编辑/删除
echo   2. 测试二级分类 - 添加/编辑/删除
echo   3. 测试课程管理 - 添加/编辑/删除/筛选
echo   4. 测试视频管理 - 上传/编辑/删除 ⭐重点
echo   5. 测试外部链接 - 添加/编辑/删除/状态切换
echo   6. 测试筛选功能
echo   7. 刷新页面验证数据持久化
echo.
echo ========================================
echo.
echo 按任意键打开浏览器开始测试...
pause >nul

start http://localhost:5173/#/tech-classroom

timeout /t 3 >nul

start http://localhost:5173/#/admin/classroom

echo.
echo ✅ 已打开前台和后台页面
echo.
echo 💡 测试提示:
echo   - 打开浏览器开发者工具(F12)查看控制台
echo   - 检查是否有红色错误信息
echo   - 测试后刷新页面验证数据保存
echo   - 查看LocalStorage中的数据
echo.
echo 📝 详细检查清单请查看:
echo   📋_小课堂功能检查清单_2025-12-15.md
echo.
pause
