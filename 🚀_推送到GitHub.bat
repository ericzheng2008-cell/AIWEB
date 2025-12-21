@echo off
chcp 65001 >nul
title 推送AIWEB到GitHub

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         🚀 AIWEB项目推送到GitHub                          ║
echo ║    https://github.com/ericzheng2008-cell/AIWEB.git       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/7] 📍 当前目录: %CD%
echo.

echo [2/7] 🔍 检查远程仓库配置...
git remote -v
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Git未初始化或远程仓库未配置
    echo.
    pause
    exit /b 1
)
echo ✅ 远程仓库已配置
echo.

echo [3/7] 📊 查看当前状态...
git status --short
echo.

echo [4/7] ➕ 添加所有更改...
git add -A
echo ✅ 文件已暂存
echo.

echo [5/7] 💾 提交更改...
set commit_msg=✅ AIWEB完整推送 - 移动端优化版 v2.6.0 (2025-12-21)
git commit -m "%commit_msg%"
if %ERRORLEVEL% EQU 0 (
    echo ✅ 提交成功
) else (
    echo ⚠️ 没有新的更改需要提交
)
echo.

echo [6/7] 📤 推送到GitHub...
echo 推送主分支...
git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️ 推送main失败，尝试master分支...
    git push -u origin master
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ❌ 推送失败！
        echo.
        echo 可能原因:
        echo 1. 网络连接问题
        echo 2. GitHub认证失败（需要Personal Access Token）
        echo 3. 分支名称不匹配
        echo.
        echo 解决方法:
        echo - 检查网络连接
        echo - 确认GitHub登录状态
        echo - 查看 📘_GitHub导入完整指南_2025-12-21.md
        echo.
        pause
        exit /b 1
    )
)
echo ✅ 主分支推送成功
echo.

echo [7/7] 🏷️ 推送标签...
git push origin --tags
if %ERRORLEVEL% EQU 0 (
    echo ✅ 标签推送成功
) else (
    echo ⚠️ 标签推送失败（可能已存在）
)
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║                  ✅ 推送完成！                             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📊 推送统计:
git log --oneline -5
echo.
echo 🌐 访问GitHub仓库:
echo https://github.com/ericzheng2008-cell/AIWEB
echo.
echo 📋 提交历史:
echo https://github.com/ericzheng2008-cell/AIWEB/commits/main
echo.
echo 🏷️ 标签列表:
echo https://github.com/ericzheng2008-cell/AIWEB/tags
echo.

pause
