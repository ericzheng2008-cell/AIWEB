@echo off
chcp 65001 >nul
title 恭喜升级VIP - 立即开始配置
color 0D

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║         🎉 恭喜您升级 cpolar VIP 服务！                 ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              ✨ 您已获得的VIP特权                        ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   ✅ 固定域名 - 永久不变，一次分享终身有效
echo      • 已保留：msaiweb.vip.cpolar.cn
echo      • 已保留：www.eqtcf.cn（自定义域名）
echo.
echo   ✅ 无时间限制 - 7×24小时稳定运行
echo      • 不再有2小时限制
echo      • 隧道可以长期在线
echo.
echo   ✅ 3-10条隧道 - 支持多个服务同时穿透
echo      • 前端 + 后端 + 其他服务
echo      • TCP隧道：3.tcp.vip.cpolar.cn:12423
echo.
echo   ✅ 专线节点 - 更快的访问速度
echo      • VIP专属线路
echo      • 更低延迟
echo.
echo   ✅ IP白名单 - 企业级安全控制
echo      • 限制访问IP范围
echo      • 提高安全性
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              📋 您的VIP资源清单                          ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   ✅ 二级子域名（HTTP/HTTPS）
echo      地区：China VIP
echo      子域名：msaiweb
echo      完整地址：https://msaiweb.vip.cpolar.cn
echo      状态：已保留
echo.
echo   ✅ 自定义域名（CNAME）
echo      域名：www.eqtcf.cn
echo      CNAME目标：1c716cc.cname.vip.cpolar.cn
echo      状态：已保留（需配置DNS）
echo.
echo   ✅ TCP地址
echo      地址：3.tcp.vip.cpolar.cn:12423
echo      描述：msaiweb
echo      状态：已保留
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              🚀 立即开始配置                             ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   选择配置方式：
echo.
echo   [1] 🎯 自动配置并启动（推荐⭐）
echo       • 自动创建配置文件
echo       • 自动启动前后端服务
echo       • 自动启动VIP固定隧道
echo       • 完整地址：https://msaiweb.vip.cpolar.cn
echo.
echo   [2] 📖 查看配置说明（新手推荐）
echo       • 详细了解VIP功能
echo       • 了解配置步骤
echo       • 手动配置选项
echo.
echo   [3] 🌐 保留更多域名
echo       • 为后端API保留子域名
echo       • 保留其他服务域名
echo.
echo   [0] 暂时不配置
echo.
echo.
set /p choice=   请选择 [0-3]: 

if "%choice%"=="1" goto auto_setup
if "%choice%"=="2" goto view_guide
if "%choice%"=="3" goto reserve_more
if "%choice%"=="0" goto end

goto menu

:auto_setup
cls
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              🎯 自动配置VIP服务                          ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo.
echo   💡 提示：需要先保留后端域名 msaiweb-api
echo.
echo   是否已经保留了 msaiweb-api 子域名？[Y/N]
set /p hasapi=   
if /i "%hasapi%"=="N" (
    echo.
    echo   正在打开cpolar控制台，请保留子域名：msaiweb-api
    timeout /t 3 >nul
    start https://dashboard.cpolar.com/reserved
    echo.
    echo   保留完成后，按任意键继续...
    pause >nul
)

echo.
echo   正在启动自动配置...
timeout /t 2 >nul

if exist "💎_VIP版本固定域名配置_2025-12-21.bat" (
    call "💎_VIP版本固定域名配置_2025-12-21.bat"
) else (
    echo   ❌ 配置脚本不存在
    pause
)
goto end

:view_guide
cls
echo.
echo   正在打开配置指南...
timeout /t 2 >nul

if exist "✅_VIP固定域名配置完成_2025-12-21.md" (
    start "" "✅_VIP固定域名配置完成_2025-12-21.md"
    echo   ✅ 文档已打开
) else (
    echo   ❌ 文档不存在
)

echo.
echo   同时打开在线控制台...
timeout /t 2 >nul
start https://dashboard.cpolar.com

pause
goto end

:reserve_more
cls
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              🌐 保留更多域名                             ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   📝 建议保留的域名：
echo.
echo   ✅ msaiweb-api
echo      用途：AIWEB后端API服务
echo      地址：https://msaiweb-api.vip.cpolar.cn
echo.
echo   💡 其他可选域名（根据需要）：
echo      • msaiweb-admin（管理后台）
echo      • msaiweb-test（测试环境）
echo      • msaiweb-dev（开发环境）
echo.
echo.
echo   按任意键打开cpolar控制台...
pause >nul

start https://dashboard.cpolar.com/reserved

echo.
echo   ✅ 控制台已打开
echo.
echo   操作步骤：
echo   1. 点击「保留」→「二级子域名」
echo   2. 地区选择：China VIP
echo   3. 输入子域名（例如：msaiweb-api）
echo   4. 填写描述
echo   5. 点击「保留」按钮
echo.
pause
goto end

:end
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              💎 VIP快速导航                              ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   🎯 自动配置：
echo      💎_VIP版本固定域名配置_2025-12-21.bat
echo.
echo   🚀 快速启动：
echo      💎_VIP版本快速启动_2025-12-21.bat
echo.
echo   📖 查看配置：
echo      🎉_查看VIP固定域名配置_2025-12-21.bat
echo.
echo   💎 功能导航：
echo      💎_VIP功能快速导航_2025-12-21.bat
echo.
echo   📚 完整文档：
echo      ✅_VIP固定域名配置完成_2025-12-21.md
echo.
echo   🌐 在线控制台：
echo      https://dashboard.cpolar.com
echo.
echo.
echo   感谢您升级VIP服务！
echo   如有问题，请参考官方文档：https://www.cpolar.com/docs
echo.
echo.
pause
