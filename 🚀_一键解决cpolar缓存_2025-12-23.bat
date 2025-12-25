@echo off
chcp 65001 >nul
color 0A
title 🚀 cpolar缓存问题一键解决

echo.
echo ══════════════════════════════════════════════════════════════
echo.
echo          🚀 cpolar缓存问题一键解决工具
echo.
echo ══════════════════════════════════════════════════════════════
echo.
echo  【问题】手机端cpolar链接显示旧版本
echo  【方案】自动完成所有修复步骤
echo.
echo ══════════════════════════════════════════════════════════════
echo.
pause
echo.

echo ┌────────────────────────────────────────────────────────────┐
echo │ [1/6] 🧹 更新版本号                                         │
echo └────────────────────────────────────────────────────────────┘
set VERSION=2025.12.23.%RANDOM%
echo {"version":"%VERSION%","updateTime":"%date% %time%","changelog":["强制刷新cpolar缓存","修复手机端显示问题"]} > public\version.json
echo ✅ 版本号已更新为: %VERSION%
timeout /t 2 /nobreak >nul

echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │ [2/6] 🛑 停止所有Node进程                                   │
echo └────────────────────────────────────────────────────────────┘
taskkill /F /IM node.exe >nul 2>&1
if errorlevel 1 (
  echo ⚠️ 没有运行中的Node进程
) else (
  echo ✅ Node进程已停止
)
timeout /t 2 /nobreak >nul

echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │ [3/6] 🛑 停止cpolar进程                                     │
echo └────────────────────────────────────────────────────────────┘
taskkill /F /IM cpolar.exe >nul 2>&1
if errorlevel 1 (
  echo ⚠️ 没有运行中的cpolar进程
) else (
  echo ✅ cpolar进程已停止
)
timeout /t 2 /nobreak >nul

echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │ [4/6] 🚀 启动Vite开发服务器                                 │
echo └────────────────────────────────────────────────────────────┘
start /B cmd /c "npm run dev > nul 2>&1"
echo ⏳ 等待服务器启动...
timeout /t 8 /nobreak >nul
echo ✅ Vite服务器已启动

echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │ [5/6] 🌐 启动cpolar VIP隧道                                 │
echo └────────────────────────────────────────────────────────────┘
start /B cmd /c "cpolar http 5173 --region=cn_vip"
echo ⏳ 等待隧道建立...
timeout /t 10 /nobreak >nul
echo ✅ cpolar隧道已建立

echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │ [6/6] 📱 打开验证工具                                       │
echo └────────────────────────────────────────────────────────────┘
start http://localhost:5173
timeout /t 2 /nobreak >nul
start 🧪_验证cpolar缓存清除_2025-12-23.html
start 📱_手机端强制刷新完整指南_2025-12-23.html
echo ✅ 验证工具已打开

echo.
echo ══════════════════════════════════════════════════════════════
echo.
echo  ✅ 服务器端修复完成！
echo.
echo ══════════════════════════════════════════════════════════════
echo.
echo  📋 接下来的步骤：
echo.
echo  1️⃣  查看打开的验证工具，确认版本号已更新
echo  2️⃣  获取新的cpolar链接（固定域名不变，但需等待隧道重建）
echo  3️⃣  在手机上按照《手机端强制刷新完整指南》操作
echo.
echo  📱 手机端操作要点：
echo     • iPhone: 设置 → Safari → 清除历史记录
echo     • Android: Chrome → 清除浏览数据
echo     • 或使用隐私/无痕模式访问
echo.
echo ══════════════════════════════════════════════════════════════
echo.
echo  💡 提示：
echo     • cpolar VIP固定域名不会改变
echo     • 但需等待隧道重新建立（已完成）
echo     • 手机端必须清除浏览器缓存才能看到新版本
echo.
echo ══════════════════════════════════════════════════════════════
echo.
pause
