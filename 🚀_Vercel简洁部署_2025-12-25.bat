@echo off
chcp 65001 >nul
color 0B

title AIWEB - Vercel部署工具

cd /d "%~dp0"
setlocal EnableDelayedExpansion

echo.
echo ========================================
echo   AIWEB - Vercel一键部署
echo ========================================
echo.
echo   本工具将自动完成：
echo   1. 清理旧文件
echo   2. 检查并安装依赖
echo   3. 修复构建配置
echo   4. 本地构建测试
echo   5. 登录Vercel
echo   6. 部署到生产环境
echo.
echo   窗口不会自动关闭，请耐心等待
echo ========================================
echo.

:: 步骤1：清理旧文件
echo.
echo [1/6] 清理旧文件...
echo.

if exist dist (
    echo 删除 dist 目录...
    rmdir /s /q dist 2>nul
    echo OK - dist 已删除
)

if exist node_modules\.vite (
    echo 删除 .vite 缓存...
    rmdir /s /q node_modules\.vite 2>nul
    echo OK - .vite 缓存已清除
)

echo OK - 清理完成
timeout /t 1 >nul

:: 步骤2：检查环境
echo.
echo [2/6] 检查环境...
echo.

echo 检查 Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ERROR - Node.js 未安装
    echo.
    echo 请先安装 Node.js: https://nodejs.org
    echo.
    goto :error_exit
)
echo OK - Node.js 已安装

echo.
echo 检查 Vercel CLI...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo WARNING - Vercel CLI 未安装，正在安装...
    echo.
    call npm install -g vercel
    if errorlevel 1 (
        color 0C
        echo ERROR - Vercel CLI 安装失败
        echo.
        goto :error_exit
    )
    echo OK - Vercel CLI 安装成功
) else (
    echo OK - Vercel CLI 已安装
)

timeout /t 1 >nul

:: 步骤3：安装依赖
echo.
echo [3/6] 安装依赖...
echo.

if not exist node_modules (
    echo 正在安装依赖，请稍候...
    echo (这可能需要3-5分钟)
    echo.
    call npm install
    if errorlevel 1 (
        color 0C
        echo ERROR - 依赖安装失败
        echo.
        goto :error_exit
    )
    echo OK - 依赖安装完成
) else (
    echo OK - 依赖已存在
)

timeout /t 1 >nul

:: 步骤4：本地构建
echo.
echo [4/6] 本地构建测试...
echo.

echo 正在构建项目...
echo (这可能需要1-3分钟)
echo.

set NODE_OPTIONS=--max_old_space_size=4096

call npm run build

if errorlevel 1 (
    color 0C
    echo.
    echo ========================================
    echo   ERROR - 构建失败
    echo ========================================
    echo.
    echo 请检查上方的错误信息
    echo.
    echo 可能的解决方案：
    echo    1. 检查语法错误
    echo    2. 检查导入路径
    echo    3. 运行诊断工具
    echo.
    goto :error_exit
)

echo.
echo OK - 构建成功！
timeout /t 2 >nul

:: 步骤5：登录Vercel
echo.
echo [5/6] 登录Vercel...
echo.

echo 浏览器即将打开，请在浏览器中完成授权
echo.
echo 按任意键继续...
pause >nul

echo.
vercel login

if errorlevel 1 (
    color 0C
    echo.
    echo ERROR - 登录失败
    echo.
    echo 请确保：
    echo    1. 浏览器已打开
    echo    2. 已完成授权
    echo    3. 网络连接正常
    echo.
    goto :error_exit
)

echo.
echo OK - 登录成功
timeout /t 2 >nul

:: 步骤6：部署
echo.
echo [6/6] 部署到生产环境...
echo.

echo 正在部署...
echo (这可能需要2-5分钟)
echo.

vercel --prod

if errorlevel 1 (
    color 0C
    echo.
    echo ========================================
    echo   ERROR - 部署失败
    echo ========================================
    echo.
    echo 可能的原因：
    echo    1. 网络连接问题
    echo    2. Vercel服务器繁忙
    echo    3. 账户权限问题
    echo.
    echo 建议：
    echo    1. 检查网络连接
    echo    2. 稍后重试
    echo    3. 访问 Vercel Dashboard 查看详情
    echo.
    goto :error_exit
)

:: 部署成功
color 0A
echo.
echo.
echo ========================================
echo   SUCCESS - 部署成功！
echo ========================================
echo.
echo 恭喜！AIWEB已成功部署到Vercel
echo.
echo 部署信息：
echo    - 访问地址显示在上方
echo    - 支持全球访问
echo    - 自动HTTPS
echo    - CDN加速
echo.
echo 下一步：
echo    1. 访问部署URL测试
echo    2. 在Vercel Dashboard绑定域名
echo    3. 配置环境变量（如需要）
echo    4. 设置GitHub自动部署
echo.
echo Vercel Dashboard: https://vercel.com/dashboard
echo.

echo.
echo 是否在浏览器中打开Vercel Dashboard？[Y/N]
choice /C YN /N /M "请选择: "

if errorlevel 2 goto :success_exit
echo.
echo 正在打开浏览器...
start https://vercel.com/dashboard
goto :success_exit

:error_exit
echo.
echo ========================================
echo   部署过程中出现错误
echo ========================================
echo.
echo 查看解决方案：
echo    README_Vercel闪退问题已解决_2025-12-25.md
echo.
pause
exit /b 1

:success_exit
echo.
echo ========================================
echo   所有步骤完成！
echo ========================================
echo.
pause
exit /b 0
