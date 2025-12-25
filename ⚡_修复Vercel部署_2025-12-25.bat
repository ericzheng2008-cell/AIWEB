@echo off
chcp 65001 >nul
echo ========================================
echo   Vercel部署问题诊断和修复
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] 清理旧的构建文件...
if exist dist rmdir /s /q dist
if exist node_modules\.vite rmdir /s /q node_modules\.vite
echo ✅ 清理完成

echo.
echo [2/5] 修复vite配置（禁用sourcemap）...
echo 正在更新vite.config.js...

echo.
echo [3/5] 重新安装依赖...
call npm install
echo ✅ 依赖安装完成

echo.
echo [4/5] 尝试构建项目...
call npm run build
if errorlevel 1 (
    echo ❌ 构建失败，请查看上方错误信息
    echo.
    echo 常见问题解决方案：
    echo 1. 检查 src/components/BehaviorModelPanel.vue 第67行
    echo 2. 检查是否有未导入的组件
    echo 3. 检查是否有语法错误
    pause
    exit /b 1
)

echo ✅ 构建成功！

echo.
echo [5/5] 部署到Vercel...
echo.
vercel --prod

echo.
echo ========================================
echo   部署完成！
echo   请查看上方显示的访问地址
echo ========================================
pause
