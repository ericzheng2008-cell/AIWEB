@echo off
chcp 65001 >nul
title 查看VIP固定域名配置
color 0D

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║         💎 您的 cpolar VIP 固定域名配置                 ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              📋 已保留的VIP资源                          ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   ✅ 1. 二级子域名（HTTP/HTTPS）
echo   ┌─────────────────────────────────────────────────────┐
echo   │  地区：    China VIP                                │
echo   │  子域名：  msaiweb                                  │
echo   │  地址：    https://msaiweb.vip.cpolar.cn            │
echo   │  描述：    AIWEB企业内测平台                        │
echo   │  状态：    ✅ 已保留（永久有效）                   │
echo   └─────────────────────────────────────────────────────┘
echo.
echo   ✅ 2. 自定义域名（CNAME）
echo   ┌─────────────────────────────────────────────────────┐
echo   │  域名：    www.eqtcf.cn                             │
echo   │  CNAME：   1c716cc.cname.vip.cpolar.cn              │
echo   │  状态：    ✅ 已保留（需要配置DNS）                │
echo   │  用途：    企业官方网站访问                         │
echo   └─────────────────────────────────────────────────────┘
echo.
echo   ✅ 3. TCP地址
echo   ┌─────────────────────────────────────────────────────┐
echo   │  地址：    3.tcp.vip.cpolar.cn:12423                │
echo   │  描述：    msaiweb                                  │
echo   │  状态：    ✅ 已保留                               │
echo   │  用途：    SSH、RDP等TCP协议服务                    │
echo   └─────────────────────────────────────────────────────┘
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              🎯 推荐使用方案                             ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   方案A：使用二级子域名（推荐⭐）
echo   ─────────────────────────────────────────────────────
echo   优势：配置简单，即刻生效，无需DNS设置
echo.
echo   ✅ 前端服务（AIWEB主页）
echo      本地端口：5173
echo      访问地址：https://msaiweb.vip.cpolar.cn
echo      启动命令：cpolar http 5173 -subdomain=msaiweb -region=cn_vip
echo.
echo   ✅ 后端服务（API接口）
echo      本地端口：5000
echo      访问地址：https://msaiweb-api.vip.cpolar.cn
echo      ⚠️  需要操作：先在控制台保留子域名 msaiweb-api
echo.
echo.
echo   方案B：使用自定义域名（企业级⭐⭐）
echo   ─────────────────────────────────────────────────────
echo   优势：更专业的企业品牌展示
echo.
echo   ✅ 企业官网
echo      访问地址：https://www.eqtcf.cn
echo      DNS配置：CNAME → 1c716cc.cname.vip.cpolar.cn
echo      启动命令：cpolar http 5173 -hostname=www.eqtcf.cn
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              🚀 快速操作                                 ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   [1] 查看详细配置文档
echo   [2] 启动VIP固定隧道
echo   [3] 保留后端子域名（msaiweb-api）
echo   [4] 配置自定义域名DNS
echo   [5] 打开在线控制台
echo   [0] 返回
echo.
set /p choice=   请选择操作 [0-5]: 

if "%choice%"=="1" goto view_doc
if "%choice%"=="2" goto start_vip
if "%choice%"=="3" goto reserve_api
if "%choice%"=="4" goto dns_guide
if "%choice%"=="5" goto open_console
if "%choice%"=="0" goto end

goto menu

:view_doc
cls
echo.
echo 正在打开详细配置文档...
timeout /t 2 >nul
if exist "✅_VIP固定域名配置完成_2025-12-21.md" (
    start "" "✅_VIP固定域名配置完成_2025-12-21.md"
) else (
    echo ❌ 文件不存在
)
pause
goto end

:start_vip
cls
echo.
echo 正在启动VIP固定隧道...
timeout /t 2 >nul
if exist "💎_VIP版本快速启动_2025-12-21.bat" (
    call "💎_VIP版本快速启动_2025-12-21.bat"
) else (
    echo ❌ 文件不存在
)
pause
goto end

:reserve_api
cls
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              保留后端子域名操作指南                      ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   📝 操作步骤：
echo.
echo   1️⃣  打开cpolar保留域名页面（3秒后自动打开）
echo      https://dashboard.cpolar.com/reserved
echo.
echo   2️⃣  点击「保留」→「二级子域名」
echo.
echo   3️⃣  填写信息：
echo      ┌────────────────────────────────────────┐
echo      │ 地区：      China VIP                  │
echo      │ 二级域名：  msaiweb-api                │
echo      │ 描述：      AIWEB后端API服务           │
echo      └────────────────────────────────────────┘
echo.
echo   4️⃣  点击「保留」按钮
echo.
echo   5️⃣  保留成功后，您将获得：
echo      https://msaiweb-api.vip.cpolar.cn
echo.
echo.
echo   按任意键打开cpolar控制台...
pause >nul
start https://dashboard.cpolar.com/reserved
echo.
echo   ✅ 页面已打开
echo.
pause
goto end

:dns_guide
cls
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              自定义域名DNS配置指南                       ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   📝 配置步骤：
echo.
echo   1️⃣  登录您的域名管理后台
echo      域名：eqtcf.cn
echo.
echo   2️⃣  找到DNS解析/域名解析设置
echo.
echo   3️⃣  添加CNAME记录：
echo      ┌────────────────────────────────────────┐
echo      │ 主机记录：  www                        │
echo      │ 记录类型：  CNAME                      │
echo      │ 记录值：    1c716cc.cname.vip.cpolar.cn│
echo      │ TTL：       默认（600或自动）          │
echo      └────────────────────────────────────────┘
echo.
echo   4️⃣  保存配置
echo.
echo   5️⃣  等待DNS生效（通常5-30分钟）
echo.
echo   6️⃣  验证生效：
echo      • Windows：nslookup www.eqtcf.cn
echo      • 在线工具：https://tool.chinaz.com/dns
echo.
echo   7️⃣  启动cpolar隧道：
echo      cpolar http 5173 -hostname=www.eqtcf.cn
echo.
echo.
echo   💡 提示：
echo      • CNAME配置错误或未生效将导致访问失败
echo      • 确保CNAME值完全正确（不含https://）
echo      • DNS生效时间因服务商而异
echo.
echo.
pause
goto end

:open_console
cls
echo.
echo 正在打开cpolar在线控制台...
timeout /t 2 >nul
start https://dashboard.cpolar.com/status
echo.
echo ✅ 控制台已打开
echo.
echo 您可以在控制台中：
echo   • 查看当前运行的隧道
echo   • 管理保留的域名
echo   • 查看流量统计
echo   • 修改配置
echo.
pause
goto end

:end
echo.
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              💡 相关资源                                 ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo   📖 完整文档：
echo      ✅_VIP固定域名配置完成_2025-12-21.md
echo.
echo   🚀 快速启动：
echo      💎_VIP版本快速启动_2025-12-21.bat
echo.
echo   🎯 功能导航：
echo      💎_VIP功能快速导航_2025-12-21.bat
echo.
echo   🌐 在线控制台：
echo      https://dashboard.cpolar.com
echo.
echo.
pause
