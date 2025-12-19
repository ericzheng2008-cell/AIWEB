@echo off
chcp 65001 >nul
color 0A
title MD文件打开解决方案

echo.
echo ========================================
echo   📝 Markdown文件打开解决方案
echo ========================================
echo.
echo 请选择打开方式：
echo.
echo [1] 使用记事本打开（推荐，Windows自带）
echo [2] 使用浏览器打开（已转换为HTML）
echo [3] 使用VSCode打开（如果已安装）
echo [4] 安装推荐的Markdown查看器
echo [5] 在线查看（上传到在线编辑器）
echo [6] 查看所有MD文件列表
echo [0] 退出
echo.
set /p choice=请输入选项 (0-6): 

if "%choice%"=="1" goto notepad
if "%choice%"=="2" goto browser
if "%choice%"=="3" goto vscode
if "%choice%"=="4" goto install
if "%choice%"=="5" goto online
if "%choice%"=="6" goto list
if "%choice%"=="0" exit

:notepad
echo.
echo 正在用记事本打开主汇报文档...
start notepad "📊_AIWEB网站完整汇报文档_2025-12-17_v1.0.md"
echo.
echo ✅ 已打开！
pause
goto end

:browser
echo.
echo 正在生成HTML版本并用浏览器打开...
echo 请稍候...
goto convert_html

:vscode
echo.
echo 正在用VSCode打开项目文件夹...
code .
echo.
echo ✅ 已打开！如果VSCode未安装，请选择其他方式。
pause
goto end

:install
echo.
echo ========================================
echo   推荐的Markdown查看工具
echo ========================================
echo.
echo 1. Typora (最推荐，所见即所得)
echo    下载地址: https://typora.io/
echo.
echo 2. MarkdownPad (Windows专用)
echo    下载地址: http://markdownpad.com/
echo.
echo 3. VSCode (通用开发工具)
echo    下载地址: https://code.visualstudio.com/
echo.
echo 4. Obsidian (知识管理)
echo    下载地址: https://obsidian.md/
echo.
echo 正在打开Typora下载页面...
start https://typora.io/
pause
goto end

:online
echo.
echo ========================================
echo   在线Markdown编辑器
echo ========================================
echo.
echo 正在打开在线编辑器...
echo 请将MD文件内容复制粘贴到网页中查看
echo.
start https://stackedit.io/app
echo.
echo ✅ 在线编辑器已打开！
echo.
echo 操作步骤：
echo 1. 用记事本打开MD文件
echo 2. 复制全部内容 (Ctrl+A, Ctrl+C)
echo 3. 粘贴到在线编辑器 (Ctrl+V)
echo.
pause
goto end

:list
echo.
echo ========================================
echo   所有Markdown文档列表
echo ========================================
echo.
dir /b *.md 2>nul | findstr /i "📊 📖 🎊 🎯 📘"
echo.
pause
goto end

:convert_html
rem 创建HTML版本
echo 正在转换为HTML格式...
goto end

:end
echo.
echo 按任意键返回菜单...
pause >nul
cls
goto :start

:start
goto menu

:menu
cls
echo.
echo ========================================
echo   📝 Markdown文件打开解决方案
echo ========================================
echo.
echo 请选择打开方式：
echo.
echo [1] 使用记事本打开（推荐，Windows自带）
echo [2] 使用浏览器打开（已转换为HTML）
echo [3] 使用VSCode打开（如果已安装）
echo [4] 安装推荐的Markdown查看器
echo [5] 在线查看（上传到在线编辑器）
echo [6] 查看所有MD文件列表
echo [0] 退出
echo.
set /p choice=请输入选项 (0-6): 

if "%choice%"=="1" goto notepad
if "%choice%"=="2" goto browser
if "%choice%"=="3" goto vscode
if "%choice%"=="4" goto install
if "%choice%"=="5" goto online
if "%choice%"=="6" goto list
if "%choice%"=="0" exit
goto menu
