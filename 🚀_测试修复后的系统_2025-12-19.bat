@echo off
chcp 65001 >nul
title 测试修复后的系统 - 2025-12-19

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          🚀 测试修复后的系统 - 2025-12-19                  ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ✅ 已修复问题:
echo    - followUp 函数重复声明错误
echo    - 联系人跟进函数已重命名为 followUpContact
echo.
echo 🎯 启动开发服务器...
echo.

start http://localhost:5173/mingsheng-aicrm-v3

npm run dev

pause
