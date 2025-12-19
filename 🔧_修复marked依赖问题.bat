@echo off
chcp 65001 >nul
echo ========================================
echo 🔧 修复 marked 依赖问题
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 清理 node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo ✅ 已删除 node_modules
) else (
    echo ⚠️ node_modules 不存在
)

echo.
echo [2/3] 清理 package-lock.json...
if exist package-lock.json (
    del package-lock.json
    echo ✅ 已删除 package-lock.json
) else (
    echo ⚠️ package-lock.json 不存在
)

echo.
echo [3/3] 重新安装所有依赖...
call npm install

echo.
echo ========================================
echo ✅ 依赖安装完成！
echo ========================================
echo.
echo 请按任意键启动开发服务器...
pause >nul

echo.
echo 🚀 正在启动开发服务器...
call npm run dev

pause
