@echo off
chcp 65001 >nul
title AIWEB企业访问方案 - 快速导航

:menu
cls
echo ========================================
echo      AIWEB企业访问方案
echo      让团队随时随地访问
echo ========================================
echo.
echo 【方案选择】
echo.
echo  [1] 🚀 方案1：内网穿透（推荐快速启动）
echo      - 30分钟上线
echo      - 年成本¥620
echo      - 适合：小团队、快速测试
echo.
echo  [2] ☁️ 方案2：云服务器（推荐长期使用）
echo      - 4小时部署
echo      - 年成本¥1,300
echo      - 适合：企业级、长期稳定
echo.
echo  [3] 🏢 方案3：自有服务器（适合大型企业）
echo      - 1-2天部署
echo      - 首年¥24,300
echo      - 适合：数据安全、大团队
echo.
echo  [4] 💻 方案4：办公电脑托管（适合临时测试）
echo      - 1小时部署
echo      - 年成本¥620
echo      - 适合：临时、小团队
echo.
echo ========================================
echo.
echo 【快速操作】
echo.
echo  [5] 📖 查看方案对比文档
echo  [6] 🚀 立即启动内网穿透
echo  [7] 🔧 配置cpolar固定域名
echo  [8] 📄 查看用户访问指南
echo  [9] ☁️ 查看云服务器部署指南
echo  [0] 退出
echo.
echo ========================================
echo.
set /p choice=请选择操作 [0-9]: 

if "%choice%"=="1" goto plan1
if "%choice%"=="2" goto plan2
if "%choice%"=="3" goto plan3
if "%choice%"=="4" goto plan4
if "%choice%"=="5" goto doc_compare
if "%choice%"=="6" goto start_cpolar
if "%choice%"=="7" goto config_cpolar
if "%choice%"=="8" goto user_guide
if "%choice%"=="9" goto cloud_guide
if "%choice%"=="0" goto end

echo 无效选择，请重试
timeout /t 2 /nobreak >nul
goto menu

:plan1
cls
echo ========================================
echo  方案1：内网穿透（cpolar）
echo ========================================
echo.
echo 💰 成本：¥620/年（VIP版）
echo ⏱️ 部署时间：30分钟
echo 👥 适用团队：< 30人
echo ⚡ 访问速度：中等
echo 🔒 稳定性：⭐⭐⭐⭐
echo.
echo 【优势】
echo ✅ 快速部署，立即可用
echo ✅ 成本低廉
echo ✅ 无需公网IP
echo ✅ 随时随地访问
echo.
echo 【劣势】
echo ⚠️ 需要电脑24小时开机
echo ⚠️ 依赖办公网络
echo.
echo 【操作步骤】
echo 1. 注册cpolar账号：https://www.cpolar.com
echo 2. 购买VIP（¥10/月）
echo 3. 运行启动脚本
echo 4. 获取固定访问地址
echo 5. 分享给团队
echo.
pause
goto menu

:plan2
cls
echo ========================================
echo  方案2：云服务器部署
echo ========================================
echo.
echo 💰 成本：¥1,300/年
echo ⏱️ 部署时间：4小时
echo 👥 适用团队：30-500人
echo ⚡ 访问速度：快
echo 🔒 稳定性：⭐⭐⭐⭐⭐
echo.
echo 【优势】
echo ✅ 7×24小时稳定运行
echo ✅ 99.95%%高可用性
echo ✅ 性能稳定，速度快
echo ✅ 可配置独立域名
echo ✅ 支持HTTPS加密
echo.
echo 【推荐配置】
echo - 腾讯云/阿里云
echo - 2核4GB内存
echo - 5Mbps带宽
echo - Ubuntu 22.04
echo.
echo 【操作步骤】
echo 1. 购买云服务器
echo 2. 上传部署脚本
echo 3. 运行自动部署
echo 4. 配置域名（可选）
echo 5. 分享访问地址
echo.
pause
goto menu

:plan3
cls
echo ========================================
echo  方案3：企业自有服务器
echo ========================================
echo.
echo 💰 成本：¥24,300（首年）
echo ⏱️ 部署时间：1-2天
echo 👥 适用团队：> 50人
echo ⚡ 访问速度：最快
echo 🔒 稳定性：⭐⭐⭐⭐⭐
echo.
echo 【优势】
echo ✅ 完全自主控制
echo ✅ 数据安全可控
echo ✅ 性能最优
echo ✅ 长期成本低
echo.
echo 【硬件采购】
echo - Dell PowerEdge T140服务器
echo - UPS电源
echo - 网络设备
echo.
echo 【操作步骤】
echo 1. 采购硬件设备
echo 2. 安装操作系统
echo 3. 配置网络环境
echo 4. 部署AIWEB
echo 5. 配置VPN/内网穿透
echo.
pause
goto menu

:plan4
cls
echo ========================================
echo  方案4：办公电脑托管
echo ========================================
echo.
echo 💰 成本：¥620/年
echo ⏱️ 部署时间：1小时
echo 👥 适用团队：< 10人
echo ⚡ 访问速度：中等
echo 🔒 稳定性：⭐⭐⭐
echo.
echo 【优势】
echo ✅ 零硬件成本
echo ✅ 快速部署
echo.
echo 【劣势】
echo ⚠️ 仅工作时间可用
echo ⚠️ 依赖办公网络
echo ⚠️ 稳定性一般
echo.
echo 【说明】
echo 结合方案1（内网穿透）+ 办公电脑
echo 适合短期临时测试使用
echo.
pause
goto menu

:doc_compare
cls
echo 正在打开方案对比文档...
start "" "🌐_企业内测随时随地访问方案_2025-12-21.md"
timeout /t 2 /nobreak >nul
goto menu

:start_cpolar
cls
echo 正在启动内网穿透...
echo.
if exist "🚀_一键启动内网穿透_cpolar.bat" (
    call "🚀_一键启动内网穿透_cpolar.bat"
) else (
    echo [错误] 未找到启动脚本
    echo 请确保文件存在：🚀_一键启动内网穿透_cpolar.bat
    pause
)
goto menu

:config_cpolar
cls
echo 正在打开cpolar配置工具...
if exist "🔧_配置cpolar固定域名.bat" (
    call "🔧_配置cpolar固定域名.bat"
) else (
    echo [错误] 未找到配置工具
    pause
)
goto menu

:user_guide
cls
echo 正在打开用户访问指南...
start "" "📄_企业内测访问指南_分享版.md"
timeout /t 2 /nobreak >nul
goto menu

:cloud_guide
cls
echo 正在打开云服务器部署指南...
start "" "📖_云服务器部署完整指南.md"
timeout /t 2 /nobreak >nul
goto menu

:end
cls
echo.
echo 感谢使用AIWEB企业访问方案！
echo.
echo 如需帮助，请联系IT支持团队
echo.
timeout /t 3 /nobreak >nul
exit
