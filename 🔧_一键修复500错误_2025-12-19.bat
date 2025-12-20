@echo off
chcp 65001 >nul
echo ====================================
echo 🔧 一键修复500错误
echo ====================================
echo.

echo 📊 诊断步骤:
echo   1. 检查后端服务器是否运行
echo   2. 如未运行，自动启动
echo   3. 测试API连接
echo   4. 打开诊断页面
echo.
echo ====================================
echo.

:: 检查端口5000是否被占用
netstat -ano | findstr ":5000" >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ 后端服务器已在运行 (端口5000)
    echo.
) else (
    echo ⚠️  后端服务器未运行，正在启动...
    echo.
    
    cd /d "%~dp0server"
    
    :: 在新窗口启动后端
    start "后端服务器 (端口5000)" cmd /k "node index.js"
    
    echo ⏳ 等待后端启动 (5秒)...
    timeout /t 5 /nobreak >nul
    
    :: 再次检查
    netstat -ano | findstr ":5000" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ 后端服务器启动成功！
    ) else (
        echo ❌ 后端启动失败，请手动检查
        echo.
        echo 💡 可能原因:
        echo   - Node.js未安装
        echo   - 依赖未安装 (运行: npm install)
        echo   - 端口5000被占用
        echo   - server/index.js 有语法错误
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ====================================
echo 🧪 测试API连接...
echo ====================================
echo.

:: 使用PowerShell测试API
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api' -TimeoutSec 3; Write-Host '✅ API连接成功 (状态码: ' $response.StatusCode ')' -ForegroundColor Green } catch { Write-Host '⚠️  API连接测试: ' $_.Exception.Message -ForegroundColor Yellow }"

echo.
echo ====================================
echo 📊 打开完整诊断页面...
echo ====================================
echo.

:: 打开诊断页面
start "" "%~dp0🔍_诊断500错误_完整版_2025-12-19.html"

timeout /t 2 /nobreak >nul

echo.
echo ====================================
echo ✅ 诊断工具已打开
echo ====================================
echo.
echo 💡 下一步:
echo   1. 在诊断页面点击"运行完整诊断"
echo   2. 查看具体哪个API返回500错误
echo   3. 根据解决方案进行修复
echo.
echo 🔍 常见500错误原因:
echo   - 数据库连接失败
echo   - 路由文件未正确导入
echo   - 代码语法错误
echo   - 缺少必要的依赖
echo.
pause
