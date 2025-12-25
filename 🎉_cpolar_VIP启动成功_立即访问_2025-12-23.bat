@echo off
chcp 65001 >nul
color 0A
cls

echo ====================================
echo     🎉 cpolar VIP 启动成功！
echo ====================================
echo.
echo ✅ 前端访问地址：
echo    https://msaiweb.vip.cpolar.cn
echo.
echo ✅ 后端API地址：
echo    https://msaiweb-api.vip.cpolar.cn
echo.
echo ✅ Web管理界面：
echo    http://127.0.0.1:4040
echo.
echo ====================================
echo     快速操作
echo ====================================
echo.
echo [1] 浏览器访问前端
echo [2] 浏览器访问管理界面
echo [3] 复制前端地址到剪贴板
echo [4] 查看隧道详细信息
echo [5] 退出
echo.

choice /c 12345 /n /m "请选择操作 [1-5]: "

if errorlevel 5 exit /b
if errorlevel 4 goto show_details
if errorlevel 3 goto copy_url
if errorlevel 2 goto open_admin
if errorlevel 1 goto open_frontend

:open_frontend
echo.
echo 正在打开前端页面...
start https://msaiweb.vip.cpolar.cn
timeout /t 2 >nul
goto menu

:open_admin
echo.
echo 正在打开管理界面...
start http://127.0.0.1:4040
timeout /t 2 >nul
goto menu

:copy_url
echo https://msaiweb.vip.cpolar.cn | clip
echo.
echo ✅ 前端地址已复制到剪贴板！
echo    可以直接粘贴分享给团队成员
timeout /t 3 >nul
goto menu

:show_details
cls
echo ====================================
echo     隧道详细信息
echo ====================================
echo.
echo 账户类型: Business (商业版)
echo 隧道状态: online (在线)
echo 版本号:   3.18/3.18
echo.
echo 前端隧道:
echo   本地端口:   5173
echo   访问地址:   https://msaiweb.vip.cpolar.cn
echo   协议:      HTTP/HTTPS
echo   区域:      China VIP
echo.
echo 后端隧道:
echo   本地端口:   5000
echo   访问地址:   https://msaiweb-api.vip.cpolar.cn
echo   协议:      HTTP/HTTPS
echo   区域:      China VIP
echo.
echo 优势特性:
echo   ✅ 固定域名，永不改变
echo   ✅ VIP专线，访问速度快
echo   ✅ 支持HTTPS安全访问
echo   ✅ 支持多设备同时访问
echo.
pause
goto menu

:menu
cls
echo ====================================
echo     🎉 cpolar VIP 启动成功！
echo ====================================
echo.
echo ✅ 前端访问地址：
echo    https://msaiweb.vip.cpolar.cn
echo.
echo ✅ 后端API地址：
echo    https://msaiweb-api.vip.cpolar.cn
echo.
echo ✅ Web管理界面：
echo    http://127.0.0.1:4040
echo.
echo ====================================
echo     快速操作
echo ====================================
echo.
echo [1] 浏览器访问前端
echo [2] 浏览器访问管理界面
echo [3] 复制前端地址到剪贴板
echo [4] 查看隧道详细信息
echo [5] 退出
echo.

choice /c 12345 /n /m "请选择操作 [1-5]: "

if errorlevel 5 exit /b
if errorlevel 4 goto show_details
if errorlevel 3 goto copy_url
if errorlevel 2 goto open_admin
if errorlevel 1 goto open_frontend
