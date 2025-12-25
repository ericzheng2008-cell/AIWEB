@echo off
chcp 65001 >nul
title 🚀 立即修复手机端404问题

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         🚀 手机端cpolar访问404 - 一键修复工具               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📋 当前问题：
echo    - 电脑端 localhost:5173 访问正常 ✅
echo    - 手机端 cpolar链接 显示404 ❌
echo.
echo 🎯 修复方案：
echo    将Vue Router改为Hash模式（URL会带#号）
echo    例如: https://xxx.cpolar.cn/#/products
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo ⏳ 正在自动修复...
echo.

REM 1. 备份原文件
echo [1/5] 备份路由配置文件...
copy /Y "src\router\index.js" "src\router\index.js.backup.%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%" >nul 2>&1
if errorlevel 1 (
    echo    ❌ 备份失败！请确保文件存在
    goto error
)
echo    ✅ 备份成功

REM 2. 修改导入语句
echo [2/5] 修改路由导入语句...
powershell -Command "(Get-Content 'src\router\index.js' -Raw) -replace 'import \{ createRouter, createWebHistory \}', 'import { createRouter, createWebHashHistory }' | Set-Content 'src\router\index.js'"
if errorlevel 1 (
    echo    ❌ 修改失败！
    goto restore
)
echo    ✅ 导入语句已更新

REM 3. 修改路由配置
echo [3/5] 修改路由模式配置...
powershell -Command "(Get-Content 'src\router\index.js' -Raw) -replace 'history: createWebHistory\(\)', 'history: createWebHashHistory()' | Set-Content 'src\router\index.js'"
if errorlevel 1 (
    echo    ❌ 修改失败！
    goto restore
)
echo    ✅ 路由模式已更新

REM 4. 停止现有服务
echo [4/5] 停止现有前端服务器...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo    ✅ 服务已停止

REM 5. 启动服务
echo [5/5] 启动前端服务器...
start "AIWEB前端" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 3 /nobreak >nul
echo    ✅ 服务启动中...

echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 🎉 修复完成！
echo.
echo 📱 测试步骤：
echo    1. 等待前端服务器完全启动（约10秒）
echo    2. 打开手机浏览器
echo    3. 访问cpolar链接: https://xxx.cpolar.cn
echo    4. URL会自动变成: https://xxx.cpolar.cn/#/
echo    5. 浏览不同页面并刷新测试
echo.
echo 💡 预期效果：
echo    - 首页: https://xxx.cpolar.cn/#/
echo    - 产品: https://xxx.cpolar.cn/#/products
echo    - 关于: https://xxx.cpolar.cn/#/about
echo    - 刷新任意页面都不会404 ✅
echo.
echo ════════════════════════════════════════════════════════════
echo.
echo 📖 查看完整文档:
echo    双击: 📖_手机端404问题完整解决方案_2025-12-25.md
echo.
pause
goto end

:restore
echo.
echo ⚠️  修改失败，正在恢复备份...
copy /Y "src\router\index.js.backup.*" "src\router\index.js" >nul 2>&1
echo ✅ 已恢复原配置
goto error

:error
echo.
echo ❌ 自动修复失败！
echo.
echo 🔧 手动修复步骤：
echo    1. 打开文件: src\router\index.js
echo    2. 找到第1行: import { createRouter, createWebHistory }
echo       改为: import { createRouter, createWebHashHistory }
echo    3. 找到第497行: history: createWebHistory()
echo       改为: history: createWebHashHistory()
echo    4. 保存文件
echo    5. 重启服务器: npm run dev
echo.
echo 📖 详细步骤请查看:
echo    📖_手机端404问题完整解决方案_2025-12-25.md
echo.
pause
goto end

:end
exit
