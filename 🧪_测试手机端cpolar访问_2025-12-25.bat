@echo off
chcp 65001 >nul
title 🧪 测试手机端cpolar访问

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║           🧪 手机端cpolar访问测试工具                       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📋 测试清单：
echo    本工具将帮助您验证手机端404问题是否已修复
echo.
echo ════════════════════════════════════════════════════════════
echo.

REM 检查路由配置
echo [1/5] 检查路由配置...
findstr /C:"createWebHashHistory" "src\router\index.js" >nul
if errorlevel 1 (
    echo    ❌ 路由仍在使用History模式
    echo    💡 请先运行: 🚀_立即修复手机端404_2025-12-25.bat
    pause
    exit
)
echo    ✅ 路由已配置为Hash模式

REM 检查Node进程
echo [2/5] 检查前端服务器状态...
tasklist | findstr /I "node.exe" >nul
if errorlevel 1 (
    echo    ❌ 前端服务器未启动
    echo    💡 正在启动服务器...
    start "AIWEB前端" cmd /k "cd /d %~dp0 && npm run dev"
    echo    ⏳ 等待服务器启动（30秒）...
    timeout /t 30 /nobreak >nul
) else (
    echo    ✅ 前端服务器正在运行
)

REM 检查cpolar
echo [3/5] 检查cpolar状态...
tasklist | findstr /I "cpolar.exe" >nul
if errorlevel 1 (
    echo    ❌ cpolar未启动
    echo    💡 请启动cpolar后再测试
    echo.
    echo    启动方法：
    echo    - 方法1: 双击 🌐_一键生成cpolar链接_2025-12-21.bat
    echo    - 方法2: 手动运行 cpolar http 5173
    echo.
    pause
    exit
) else (
    echo    ✅ cpolar正在运行
)

REM 生成测试清单
echo [4/5] 生成测试清单...
echo    ✅ 测试清单已准备

echo [5/5] 准备测试页面...
echo    ✅ 就绪

echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 🎯 请按照以下步骤测试：
echo.
echo 【步骤1】获取cpolar链接
echo    1. 打开浏览器访问: https://dashboard.cpolar.com/status
echo    2. 登录cpolar账号
echo    3. 找到5173端口对应的公网URL
echo    4. 复制该URL（例如: https://xxx.cpolar.cn）
echo.
echo 【步骤2】手机测试
echo    5. 打开手机浏览器
echo    6. 粘贴cpolar URL并访问
echo    7. 观察URL是否自动变成: https://xxx.cpolar.cn/#/
echo.
echo 【步骤3】功能测试
echo    测试项1: 首页访问
echo       - 访问: https://xxx.cpolar.cn
echo       - 预期: 自动跳转到 https://xxx.cpolar.cn/#/
echo       - 结果: □ 通过  □ 失败
echo.
echo    测试项2: 内页访问
echo       - 访问: https://xxx.cpolar.cn/products
echo       - 预期: 自动跳转到 https://xxx.cpolar.cn/#/products
echo       - 结果: □ 通过  □ 失败
echo.
echo    测试项3: 页面刷新
echo       - 在任意内页按F5刷新
echo       - 预期: 页面正常显示，不会404
echo       - 结果: □ 通过  □ 失败
echo.
echo    测试项4: 导航跳转
echo       - 点击顶部导航菜单
echo       - 预期: 正常跳转到对应页面
echo       - 结果: □ 通过  □ 失败
echo.
echo    测试项5: 浏览器返回
echo       - 点击浏览器返回按钮
echo       - 预期: 正常返回上一页
echo       - 结果: □ 通过  □ 失败
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 💡 故障排查：
echo.
echo 【问题1】还是显示404
echo    解决方法：
echo    1. 双击: 🔧_强制清除所有Node进程.bat
echo    2. 双击: 🚀_一键启动AIWEB_2025-12-22.bat
echo    3. 手机清除浏览器缓存
echo    4. 重新测试
echo.
echo 【问题2】URL没有#号
echo    说明: 路由配置可能未生效
echo    解决方法：
echo    1. 打开: src\router\index.js
echo    2. 检查第1行是否为:
echo       import { createRouter, createWebHashHistory }
echo    3. 检查第492行左右是否为:
echo       history: createWebHashHistory(),
echo    4. 如果不是，重新运行修复工具
echo.
echo 【问题3】电脑端正常，手机端404
echo    说明: cpolar可能有缓存
echo    解决方法：
echo    1. 重启cpolar
echo    2. 手机清除浏览器缓存
echo    3. 使用无痕模式测试
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 📊 测试结果统计：
echo.
set /p test1=测试项1（首页访问）通过吗？(Y/N): 
set /p test2=测试项2（内页访问）通过吗？(Y/N): 
set /p test3=测试项3（页面刷新）通过吗？(Y/N): 
set /p test4=测试项4（导航跳转）通过吗？(Y/N): 
set /p test5=测试项5（浏览器返回）通过吗？(Y/N): 

echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 📋 测试结果汇总：
echo.
echo    测试项1 - 首页访问: %test1%
echo    测试项2 - 内页访问: %test2%
echo    测试项3 - 页面刷新: %test3%
echo    测试项4 - 导航跳转: %test4%
echo    测试项5 - 浏览器返回: %test5%
echo.

REM 统计通过数量
set /a passed=0
if /i "%test1%"=="Y" set /a passed+=1
if /i "%test2%"=="Y" set /a passed+=1
if /i "%test3%"=="Y" set /a passed+=1
if /i "%test4%"=="Y" set /a passed+=1
if /i "%test5%"=="Y" set /a passed+=1

if %passed%==5 (
    echo 🎉 恭喜！所有测试通过！
    echo    手机端404问题已完全修复 ✅
) else if %passed% GEQ 3 (
    echo ⚠️  部分测试通过（%passed%/5）
    echo    建议查看故障排查部分解决剩余问题
) else (
    echo ❌ 测试未通过（%passed%/5）
    echo    请查看完整解决方案文档
    echo    📖 双击: 📖_手机端404问题完整解决方案_2025-12-25.md
)

echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 📚 相关文档：
echo    - 📖_手机端404问题完整解决方案_2025-12-25.md
echo    - 📑_手机端404修复完整索引_2025-12-25.md
echo    - 🚀_立即修复手机端404_2025-12-25.bat
echo    - 🔧_修复cpolar手机端404_2025-12-25.bat
echo.
echo 💡 需要帮助？
echo    查看详细文档或重新运行修复工具
echo.
pause
exit
