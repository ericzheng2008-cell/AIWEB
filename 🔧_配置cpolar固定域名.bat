@echo off
:: cpolar固定域名配置工具 v1.0
:: VIP版专用

chcp 65001 >nul
title cpolar固定域名配置

echo ========================================
echo  cpolar 固定域名配置向导
echo  VIP版专用（¥10/月）
echo ========================================
echo.

:: 检查cpolar
where cpolar >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未安装cpolar
    pause
    exit /b 1
)

echo 请按以下步骤配置固定域名：
echo.
echo 第一步：升级VIP会员
echo ----------------------------------------
echo 1. 访问 https://dashboard.cpolar.com/vip
echo 2. 选择VIP套餐（推荐月付¥10）
echo 3. 完成支付
echo.
pause

echo.
echo 第二步：创建固定隧道
echo ----------------------------------------
echo 1. 访问 https://dashboard.cpolar.com/reserved
echo 2. 点击「创建」
echo 3. 填写以下信息：
echo    - 隧道名称：aiweb-tunnel
echo    - 地区：China VIP
echo    - 二级域名：aiweb-test（或您喜欢的名称）
echo    - 类型：http
echo 4. 点击「创建」
echo.
pause

echo.
echo 第三步：配置本地客户端
echo ----------------------------------------
echo.

:: 创建配置文件
set CONFIG_FILE=%USERPROFILE%\.cpolar\cpolar.yml

if not exist "%USERPROFILE%\.cpolar" mkdir "%USERPROFILE%\.cpolar"

echo 请输入您的cpolar authtoken:
set /p AUTHTOKEN=
echo.

echo 请输入您设置的二级域名（如：aiweb-test）:
set /p SUBDOMAIN=
echo.

echo version: "2"> "%CONFIG_FILE%"
echo authtoken: %AUTHTOKEN%>> "%CONFIG_FILE%"
echo.>> "%CONFIG_FILE%"
echo tunnels:>> "%CONFIG_FILE%"
echo   aiweb:>> "%CONFIG_FILE%"
echo     proto: http>> "%CONFIG_FILE%"
echo     addr: 3002>> "%CONFIG_FILE%"
echo     region: cn_vip>> "%CONFIG_FILE%"
echo     subdomain: %SUBDOMAIN%>> "%CONFIG_FILE%"
echo     inspect: true>> "%CONFIG_FILE%"
echo     bind_tls: true>> "%CONFIG_FILE%"

echo ✓ 配置文件已创建：%CONFIG_FILE%
echo.

echo 第四步：测试连接
echo ----------------------------------------
echo 正在启动隧道...
echo.

cpolar start aiweb

echo.
echo ========================================
echo 配置完成！
echo ========================================
echo.
echo 您的固定访问地址：
echo https://%SUBDOMAIN%.cpolar.cn
echo.
echo 提示：
echo - 此地址固定不变，可放心分享
echo - 建议将地址添加到企业文档
echo - 定期检查隧道状态
echo.
pause
