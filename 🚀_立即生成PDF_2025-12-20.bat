@echo off
chcp 65001 >nul
color 0A
echo.
echo ========================================
echo    🚀 AIWEB文档PDF生成工具
echo ========================================
echo.
echo 📦 已准备好7个HTML文件，准备转换为PDF
echo.
echo 文件列表：
echo   1. 企业内部部署完整方案（18,000字）
echo   2. 公网部署完整方案（16,000字）
echo   3. 功能截图完整说明（12,000字）
echo   4. 移动端APP和小程序部署（14,000字）
echo   5. 代码模块完整说明（8,000字）
echo   6. 网站完整功能说明（10,000字）
echo   7. 设备全生命周期管理（15,000字）
echo.
echo 📊 总计：93,000+字的专业技术文档
echo.
echo ========================================
echo    转换方法
echo ========================================
echo.
echo 浏览器将打开所有HTML文件
echo 在每个标签页中：
echo   1. 按 Ctrl+P（打开打印对话框）
echo   2. 选择"另存为PDF"
echo   3. 点击"保存"
echo   4. 切换到下一个标签页（Ctrl+Tab）
echo.
echo ⏱️ 预计耗时：5-10分钟
echo.
echo ========================================
echo.

choice /C YN /M "是否立即开始转换"

if errorlevel 2 (
    echo.
    echo ❌ 已取消操作
    echo.
    pause
    exit
)

echo.
echo ========================================
echo    正在打开HTML文件...
echo ========================================
echo.

echo [1/7] 打开：企业内部部署方案...
start "" "📘_AIWEB企业内部部署完整方案_2025-12-20_v2.5.0.html"
timeout /t 2 /nobreak >nul

echo [2/7] 打开：公网部署方案...
start "" "📘_AIWEB公网部署完整方案_2025-12-20_v2.5.0.html"
timeout /t 2 /nobreak >nul

echo [3/7] 打开：功能截图说明...
start "" "📘_AIWEB功能截图完整说明_2025-12-20_v2.5.0.html"
timeout /t 2 /nobreak >nul

echo [4/7] 打开：移动端APP方案...
start "" "📘_移动端APP和小程序部署完整方案_2025-12-20_v2.5.0.html"
timeout /t 2 /nobreak >nul

echo [5/7] 打开：代码模块说明...
start "" "📘_AIWEB代码模块完整说明_2025-12-20_v2.5.0.html"
timeout /t 2 /nobreak >nul

echo [6/7] 打开：网站功能说明...
start "" "📘_AIWEB网站完整功能说明_2025-12-20_v2.5.0.html"
timeout /t 2 /nobreak >nul

echo [7/7] 打开：设备全生命周期管理...
start "" "📘_设备全生命周期管理完整说明_2025-12-20_v2.5.0.html"

echo.
echo ========================================
echo    ✅ 所有文件已打开！
echo ========================================
echo.
echo 📝 操作提示：
echo   • 在浏览器中按 Ctrl+P 打开打印
echo   • 选择"另存为PDF"
echo   • 文件会保存到下载文件夹
echo   • 建议移动到当前项目文件夹
echo.
echo 🎯 推荐设置：
echo   • 目标：另存为PDF
echo   • 页眉和页脚：关闭
echo   • 背景图形：开启
echo   • 纸张大小：A4
echo.
echo ⚡ 快捷键：
echo   • Ctrl+P：打开打印
echo   • Ctrl+Tab：切换标签页
echo   • Enter：确认保存
echo.
echo ========================================
echo.
pause
