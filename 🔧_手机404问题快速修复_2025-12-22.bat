@echo off
chcp 65001 >nul
title 手机404问题快速修复工具

echo ========================================
echo   手机404问题快速修复工具
echo ========================================
echo.

echo 正在诊断问题...
echo.

:: 1. 检查服务是否启动
echo [1/6] 检查前端服务...
netstat -ano | findstr :3002 >nul
if %errorlevel% neq 0 (
    echo ❌ 前端服务未启动
    set NEED_START=1
) else (
    echo ✅ 前端服务运行中
    set NEED_START=0
)

netstat -ano | findstr :5000 >nul
if %errorlevel% neq 0 (
    echo ❌ 后端服务未启动
    set NEED_START=1
) else (
    echo ✅ 后端服务运行中
)
echo.

:: 2. 获取本机IP
echo [2/6] 获取本机IP地址...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set IP=%%a
)
set IP=%IP: =%
echo ✅ 本机IP: %IP%
echo.

:: 3. 检查端口是否可访问
echo [3/6] 检查端口可访问性...
curl -s http://localhost:3002 >nul
if %errorlevel% neq 0 (
    echo ❌ 本地3002端口无法访问
) else (
    echo ✅ 本地3002端口正常
)
echo.

:: 4. 如果需要启动服务
if %NEED_START%==1 (
    echo [4/6] 启动服务...
    echo 正在启动后端服务（端口5000）...
    cd /d %~dp0server
    start "AIWEB-后端" cmd /k "node index.js"
    timeout /t 5 >nul
    
    echo 正在启动前端服务（端口3002）...
    cd /d %~dp0
    start "AIWEB-前端" cmd /k "npm run dev"
    timeout /t 10 >nul
    echo ✅ 服务已启动
) else (
    echo [4/6] 服务已在运行，跳过启动
)
echo.

:: 5. 配置防火墙
echo [5/6] 配置防火墙规则...
echo 正在添加防火墙规则（需要管理员权限）...

:: 检查是否有管理员权限
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  需要管理员权限配置防火墙
    echo 请右键点击此文件，选择"以管理员身份运行"
    echo.
    echo 或者手动配置防火墙：
    echo 1. 打开 Windows Defender 防火墙
    echo 2. 点击"高级设置"
    echo 3. 点击"入站规则" - "新建规则"
    echo 4. 选择"端口" - TCP - 特定本地端口: 3002,5000
    echo 5. 选择"允许连接"
    echo.
) else (
    netsh advfirewall firewall delete rule name="AIWEB Frontend" >nul 2>&1
    netsh advfirewall firewall delete rule name="AIWEB Backend" >nul 2>&1
    
    netsh advfirewall firewall add rule name="AIWEB Frontend" dir=in action=allow protocol=TCP localport=3002 >nul
    netsh advfirewall firewall add rule name="AIWEB Backend" dir=in action=allow protocol=TCP localport=5000 >nul
    echo ✅ 防火墙规则已添加
)
echo.

:: 6. 提供访问地址
echo [6/6] 手机访问地址...
echo.
echo ========================================
echo   📱 手机访问地址（请复制下方地址）
echo ========================================
echo.
echo   主访问地址：http://%IP%:3002
echo   备用地址：  http://%IP%:3002/
echo.
echo ========================================
echo.

:: 7. 常见404原因分析
echo 📌 手机提示404的常见原因：
echo.
echo 1️⃣  服务未启动
echo    ✅ 已自动启动（如果之前未启动）
echo.
echo 2️⃣  手机和电脑不在同一WiFi
echo    ⚠️  请确认！电脑WiFi: [查看电脑WiFi名称]
echo    ⚠️  请确认！手机WiFi: [必须与电脑相同]
echo.
echo 3️⃣  防火墙阻止
echo    ✅ 已配置规则（如果有管理员权限）
echo    ⚠️  如无权限，请按提示手动配置
echo.
echo 4️⃣  端口号错误
echo    ✅ 正确端口: 3002
echo    ❌ 错误端口: 5173, 8080, 3000等
echo.
echo 5️⃣  IP地址错误
echo    ✅ 正确IP: %IP%
echo    ❌ 错误IP: 192.168.0.x, 127.0.0.1, localhost
echo.
echo 6️⃣  URL路径问题
echo    ✅ 正确: http://%IP%:3002
echo    ✅ 正确: http://%IP%:3002/
echo    ❌ 错误: http://%IP%:3002/index.html
echo.

:: 8. 测试建议
echo 📝 测试步骤：
echo.
echo 第1步: 在电脑浏览器测试
echo        访问: http://localhost:3002
echo        确认能正常打开
echo.
echo 第2步: 在电脑浏览器用IP测试
echo        访问: http://%IP%:3002
echo        确认能正常打开
echo.
echo 第3步: 在手机浏览器测试
echo        确保手机连接同一WiFi
echo        访问: http://%IP%:3002
echo.
echo 第4步: 如果还是404
echo        a. 清除手机浏览器缓存
echo        b. 尝试手机无痕模式
echo        c. 尝试其他浏览器
echo        d. 重启手机WiFi
echo.

:: 9. 自动打开测试页面
echo 正在打开测试页面...
timeout /t 2 >nul
start http://localhost:3002
echo.

:: 10. 生成检查清单
echo ========================================
echo   ✅ 检查清单（请逐项确认）
echo ========================================
echo.
echo [ ] 电脑和手机连接同一个WiFi
echo [ ] 前端服务正在运行（端口3002）
echo [ ] 后端服务正在运行（端口5000）
echo [ ] 防火墙已允许3002和5000端口
echo [ ] 电脑浏览器能访问 http://localhost:3002
echo [ ] 电脑浏览器能访问 http://%IP%:3002
echo [ ] 手机输入的地址完全正确
echo [ ] 手机浏览器缓存已清除
echo.

echo ========================================
echo   🔍 如果问题仍未解决
echo ========================================
echo.
echo 1. 检查WiFi设置
echo    - 某些WiFi有AP隔离功能
echo    - 需要在路由器设置中关闭
echo.
echo 2. 尝试关闭电脑防火墙
echo    - 临时测试用
echo    - 测试后记得开启
echo.
echo 3. 使用cpolar内网穿透
echo    - 不受WiFi限制
echo    - 参考: 🌐_异地手机访问快速方案_2025-12-21.md
echo.
echo 4. 查看详细诊断
echo    - 双击: 🔍_浏览器完整诊断_2025-12-21.html
echo.

pause
