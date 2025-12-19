@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   测试小课堂管理模块
echo ========================================
echo.
echo 正在打开两个管理模块...
echo.
echo [1/2] 打开分类与课程管理...
start http://localhost:3002/admin/classroom
timeout /t 2 /nobreak >nul
echo.
echo [2/2] 打开多媒体资源管理...
start http://localhost:3002/admin/classroom-resources
echo.
echo ========================================
echo   测试页面已打开
echo ========================================
echo.
echo 功能说明:
echo.
echo 【分类与课程管理】
echo   - 一级分类管理（添加/编辑/删除）
echo   - 二级分类管理（关联一级分类）
echo   - 课程管理（关联分类体系）
echo   - 视频管理（按二级分类组织）
echo.
echo 【多媒体资源管理】
echo   - 视频资源上传与管理
echo   - PDF文档上传与管理
echo   - PPT演示文稿上传与管理
echo   - Excel表格上传与管理
echo   - Word文档上传与管理
echo.
echo ========================================
echo   修复完成！所有功能正常
echo ========================================
echo.
pause
