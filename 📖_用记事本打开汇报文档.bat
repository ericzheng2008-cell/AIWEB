@echo off
chcp 65001 >nul
title 用记事本打开AIWEB汇报文档

echo.
echo ========================================
echo   📖 正在用记事本打开汇报文档
echo ========================================
echo.

if exist "📊_AIWEB网站完整汇报文档_2025-12-17_v1.0.md" (
    echo ✅ 找到文档，正在打开...
    start notepad "📊_AIWEB网站完整汇报文档_2025-12-17_v1.0.md"
    echo.
    echo 提示：
    echo - 记事本可以查看完整内容
    echo - 如需更好的格式显示，建议安装Typora或VSCode
    echo - 也可以使用在线工具: https://stackedit.io/app
) else (
    echo ❌ 未找到文档文件
    echo 请确认当前目录为: c:\Users\EricZ\CodeBuddy\AIWEB1\
)

echo.
pause
