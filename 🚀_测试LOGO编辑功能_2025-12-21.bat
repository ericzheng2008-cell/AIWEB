@echo off
chcp 65001 >nul
echo ========================================
echo   测试首页LOGO和公司名称编辑功能
echo ========================================
echo.
echo ✅ 功能清单:
echo    1. LOGO图片上传（PNG/JPG/SVG）
echo    2. 公司名称编辑（中英文）
echo    3. 公司口号编辑（中英文）
echo    4. 实时预览效果
echo.
echo 📍 测试路径:
echo    后台管理 → 内容管理 → 站点配置
echo.
echo 正在启动开发服务器...
echo.
cd /d "%~dp0"
start http://localhost:5173/admin
npm run dev
pause
