@echo off
chcp 65001 >nul 2>&1
title 服务状态诊断

echo ========================================
echo   🔍 AIWEB 服务状态诊断
echo ========================================
echo.

echo 📌 正在检查服务状态...
echo.

:: 检查后端端口3001
echo 【1/4】检查后端服务器 (端口3001)
netstat -ano | findstr :3001 >nul
if %errorlevel% == 0 (
    echo    ✅ 后端服务器正在运行
) else (
    echo    ❌ 后端服务器未启动
    echo    💡 请运行: ⚡_启动后端服务器_2025-12-25.bat
)
echo.

:: 检查前端端口5173
echo 【2/4】检查前端服务器 (端口5173)
netstat -ano | findstr :5173 >nul
if %errorlevel% == 0 (
    echo    ✅ 前端服务器正在运行 (端口5173)
) else (
    echo    ⚠️  端口5173未占用，检查5174...
    netstat -ano | findstr :5174 >nul
    if %errorlevel% == 0 (
        echo    ✅ 前端服务器正在运行 (端口5174)
    ) else (
        echo    ❌ 前端服务器未启动
        echo    💡 请运行: npm run dev
    )
)
echo.

:: 检查Node进程
echo 【3/4】检查Node进程
tasklist /FI "IMAGENAME eq node.exe" 2>nul | find /I "node.exe" >nul
if %errorlevel% == 0 (
    echo    ✅ Node进程存在
    tasklist /FI "IMAGENAME eq node.exe" | find /I "node.exe"
) else (
    echo    ❌ 没有Node进程
    echo    💡 需要启动服务
)
echo.

:: 测试后端API
echo 【4/4】测试后端API
curl -s -o nul -w "%%{http_code}" http://localhost:3001/api/content/banners >nul 2>&1
if %errorlevel% == 0 (
    echo    ✅ 后端API响应正常
) else (
    echo    ❌ 后端API无响应
    echo    💡 可能原因: 后端未启动或启动失败
)
echo.

echo ========================================
echo   📊 诊断完成
echo ========================================
echo.
echo 💡 建议操作:
echo    1. 如果后端未启动 → 运行: ⚡_启动后端服务器_2025-12-25.bat
echo    2. 如果前端未启动 → 运行: npm run dev
echo    3. 如果都未启动   → 运行: ⚡_完整启动_前后端_2025-12-25.bat
echo.
pause
