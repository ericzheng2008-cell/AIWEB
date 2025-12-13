@echo off
chcp 65001 >nul
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║          企业营销平台 - 本地开发环境启动工具              ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo.
echo  请选择操作：
echo.
echo  [1] 快速启动开发服务器（推荐）
echo  [2] 紧急修复并启动
echo  [3] 完整诊断和修复
echo  [4] 查看错误日志
echo  [5] 部署到 Netlify（推荐 - 国内快）
echo  [6] 选择其他部署平台
echo  [7] 部署后端到 Railway
echo  [8] 退出
echo.
set /p choice="请输入选项（1-8）: "

if "%choice%"=="1" goto quick_start
if "%choice%"=="2" goto emergency
if "%choice%"=="3" goto full_fix
if "%choice%"=="4" goto check_error
if "%choice%"=="5" goto deploy_netlify
if "%choice%"=="6" goto choose_platform
if "%choice%"=="7" goto deploy_backend
if "%choice%"=="8" goto end
goto invalid

:quick_start
cls
echo [快速启动] 正在启动开发服务器...
call start-dev-server.bat
goto end

:emergency
cls
echo [紧急修复] 正在执行紧急修复...
call emergency-fix.bat
goto end

:full_fix
cls
echo [完整修复] 正在执行完整诊断和修复...
call diagnose-and-fix.bat
goto end

:check_error
cls
echo [错误检查] 正在检查错误...
call check-error.bat
goto end

:deploy_netlify
cls
echo [部署Netlify] 正在部署前端到 Netlify...
call deploy-to-netlify.bat
goto end

:choose_platform
cls
echo [选择平台] 正在打开平台选择菜单...
call 快速切换部署平台.bat
goto end

:deploy_backend
cls
echo [部署后端] 正在部署后端到 Railway...
call deploy-backend.bat
goto end

:invalid
echo.
echo 无效选项！请输入 1-8
timeout /t 2 /nobreak >nul
cls
goto start

:end
exit
