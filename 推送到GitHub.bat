@echo off
chcp 65001 >nul
color 0B
title 推送代码到GitHub

echo.
echo ========================================
echo   推送代码到GitHub
echo ========================================
echo.

echo [检查] 查看待推送的提交...
git log origin/main..HEAD --oneline
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  没有找到远程仓库或没有新提交
    echo.
    pause
    exit /b 1
)

echo.
echo [确认] 准备推送以上提交到远程仓库
echo.
echo 按任意键继续推送，或关闭窗口取消...
pause >nul

echo.
echo [推送] 正在推送到GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   推送成功！
    echo ========================================
    echo.
    echo ✅ 所有提交已推送到远程仓库
    echo.
    echo 现在可以:
    echo 1. 在GitHub上查看代码
    echo 2. 触发自动部署（如配置了CI/CD）
    echo 3. 继续开发新功能
    echo.
) else (
    echo.
    echo ========================================
    echo   推送失败
    echo ========================================
    echo.
    echo 可能的原因:
    echo 1. 没有推送权限
    echo 2. 网络连接问题
    echo 3. 远程仓库有新提交，需要先pull
    echo.
    echo 建议操作:
    echo git pull origin main --rebase
    echo git push origin main
    echo.
)

echo.
pause
