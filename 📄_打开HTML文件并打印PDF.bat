@echo off
chcp 65001 >nul
echo ========================================
echo    📄 AIWEB文档HTML转PDF工具
echo ========================================
echo.
echo 已生成7个HTML文件，文件列表：
echo.
echo 1. 📘_AIWEB企业内部部署完整方案_2025-12-20_v2.5.0.html
echo 2. 📘_AIWEB公网部署完整方案_2025-12-20_v2.5.0.html
echo 3. 📘_AIWEB功能截图完整说明_2025-12-20_v2.5.0.html
echo 4. 📘_移动端APP和小程序部署完整方案_2025-12-20_v2.5.0.html
echo 5. 📘_AIWEB代码模块完整说明_2025-12-20_v2.5.0.html
echo 6. 📘_AIWEB网站完整功能说明_2025-12-20_v2.5.0.html
echo 7. 📘_设备全生命周期管理完整说明_2025-12-20_v2.5.0.html
echo.
echo ========================================
echo    如何转换为PDF：
echo ========================================
echo.
echo 1. 双击运行本脚本，会自动打开所有HTML文件
echo 2. 在浏览器中按 Ctrl+P 打开打印对话框
echo 3. 选择"另存为PDF"作为打印机
echo 4. 点击"保存"，PDF会自动保存到当前文件夹
echo 5. 重复步骤2-4，为所有文件生成PDF
echo.
echo ========================================
echo.

choice /C YN /M "是否立即打开所有HTML文件"

if errorlevel 2 (
    echo.
    echo 已取消操作
    pause
    exit
)

echo.
echo 正在打开HTML文件...
echo.

start "" "📘_AIWEB企业内部部署完整方案_2025-12-20_v2.5.0.html"
timeout /t 2 /nobreak >nul

start "" "📘_AIWEB公网部署完整方案_2025-12-20_v2.5.0.html"
timeout /t 2 /nobreak >nul

start "" "📘_AIWEB功能截图完整说明_2025-12-20_v2.5.0.html"
timeout /t 2 /nobreak >nul

start "" "📘_移动端APP和小程序部署完整方案_2025-12-20_v2.5.0.html"
timeout /t 2 /nobreak >nul

start "" "📘_AIWEB代码模块完整说明_2025-12-20_v2.5.0.html"
timeout /t 2 /nobreak >nul

start "" "📘_AIWEB网站完整功能说明_2025-12-20_v2.5.0.html"
timeout /t 2 /nobreak >nul

start "" "📘_设备全生命周期管理完整说明_2025-12-20_v2.5.0.html"

echo.
echo ========================================
echo    ✅ 所有文件已打开！
echo ========================================
echo.
echo 请在浏览器中使用 Ctrl+P 打印为PDF
echo.
pause
