@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   📁 小课堂多媒体资源管理测试
echo ========================================
echo.
echo 功能说明：
echo   ✅ 支持5种文件类型上传
echo      - 视频 (.mp4, .avi, .mov等)
echo      - PDF (.pdf)
echo      - PPT (.ppt, .pptx)
echo      - Excel (.xls, .xlsx)
echo      - Word (.doc, .docx)
echo.
echo   ✅ 完整的资源管理功能
echo      - 拖拽上传
echo      - 在线预览
echo      - 一键删除
echo      - 资源统计
echo.
echo ========================================
echo.

echo 正在启动服务器...
start "" "http://localhost:3002/admin/classroom-resources"

echo.
echo ✅ 已打开资源管理页面
echo.
echo 📝 测试步骤：
echo   1. 登录后台（如未登录）
echo   2. 选择课程（三级联动）
echo   3. 上传各类型文件测试
echo   4. 测试预览和删除功能
echo.
echo 💡 提示：
echo   - 文件大小限制: 100MB
echo   - 支持拖拽上传
echo   - 可自定义文件名
echo.
pause
