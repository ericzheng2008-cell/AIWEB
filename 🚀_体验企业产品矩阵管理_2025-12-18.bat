@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 启动企业产品矩阵管理系统
echo ========================================
echo.
echo 📊 系统功能：
echo    - 产品收益-现金流战略矩阵
echo    - BCG四象限分析
echo    - AI智能推荐与预警
echo    - 大类对比分析
echo    - 单产品钻取分析
echo.
echo 🎯 访问地址：
echo    前台：http://localhost:5173/mingsheng-aicrm
echo    后台：http://localhost:5173/admin/product-matrix
echo.
echo ⏳ 正在启动开发服务器...
echo.

cd /d "%~dp0"
npm run dev

pause
