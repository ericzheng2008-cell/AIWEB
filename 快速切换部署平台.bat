@echo off
chcp 65001 >nul
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║              选择部署平台                                  ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo.
echo  [1] Netlify（推荐 - 国内访问快）
echo  [2] Vercel（国外访问快）
echo  [3] GitHub Pages（完全免费）
echo  [4] 查看部署状态
echo  [5] 返回主菜单
echo.
set /p choice="请选择部署平台（1-5）: "

if "%choice%"=="1" goto netlify
if "%choice%"=="2" goto vercel
if "%choice%"=="3" goto github
if "%choice%"=="4" goto status
if "%choice%"=="5" goto main_menu
goto invalid

:netlify
cls
echo [Netlify 部署] 启动中...
call deploy-to-netlify.bat
goto end

:vercel
cls
echo [Vercel 部署] 启动中...
call deploy-now.bat
goto end

:github
cls
echo [GitHub Pages] 启动中...
call deploy-github-pages.bat
goto end

:status
cls
echo [检查状态]
echo.
echo === Netlify 状态 ===
netlify status 2>nul
echo.
echo === Vercel 状态 ===
vercel ls 2>nul
echo.
pause
goto end

:main_menu
call 开始这里.bat
goto end

:invalid
echo.
echo 无效选项！
timeout /t 2 /nobreak >nul
cls
goto start

:end
exit
