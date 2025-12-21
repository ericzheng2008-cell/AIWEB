@echo off
chcp 65001 > nul
title 工作流智能体一键修复工具
color 0B

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║           🔧 工作流智能体一键修复工具                          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 本工具将自动修复常见问题：
echo   ✓ 清除缓存
echo   ✓ 重新安装依赖
echo   ✓ 修复路由配置
echo   ✓ 检查端口占用
echo   ✓ 启动服务器
echo.
echo ════════════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

set /p confirm=是否继续修复? (Y/N): 
if /i not "%confirm%"=="Y" (
    echo 操作已取消
    pause
    exit /b 0
)

echo.
echo ════════════════════════════════════════════════════════════════
echo [步骤 1/6] 清除node_modules缓存...
echo ════════════════════════════════════════════════════════════════

if exist "node_modules" (
    echo 删除旧的node_modules目录...
    rd /s /q "node_modules" 2>nul
    echo ✅ node_modules已删除
) else (
    echo ℹ️  node_modules不存在，跳过
)

if exist "package-lock.json" (
    echo 删除package-lock.json...
    del /f /q "package-lock.json" 2>nul
    echo ✅ package-lock.json已删除
)

echo.
echo ════════════════════════════════════════════════════════════════
echo [步骤 2/6] 清除npm缓存...
echo ════════════════════════════════════════════════════════════════

npm cache clean --force
echo ✅ npm缓存已清除

echo.
echo ════════════════════════════════════════════════════════════════
echo [步骤 3/6] 重新安装依赖...
echo ════════════════════════════════════════════════════════════════

echo 正在安装依赖包，这可能需要几分钟...
npm install

if errorlevel 1 (
    echo.
    echo ❌ 依赖安装失败！
    echo.
    echo 可能的原因：
    echo   1. 网络连接问题
    echo   2. npm配置问题
    echo   3. Node.js版本不兼容
    echo.
    echo 建议操作：
    echo   1. 检查网络连接
    echo   2. 尝试使用国内npm镜像：npm config set registry https://registry.npmmirror.com
    echo   3. 更新Node.js到最新LTS版本
    echo.
    pause
    exit /b 1
)

echo ✅ 依赖安装成功

echo.
echo ════════════════════════════════════════════════════════════════
echo [步骤 4/6] 检查端口占用...
echo ════════════════════════════════════════════════════════════════

netstat -ano | findstr ":3000" > nul 2>&1
if not errorlevel 1 (
    echo ⚠️  端口3000被占用
    echo.
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
        set PORT_PID=%%a
        echo 占用进程PID: !PORT_PID!
        echo.
        set /p kill_process=是否结束该进程? (Y/N): 
        if /i "!kill_process!"=="Y" (
            taskkill /PID !PORT_PID! /F
            echo ✅ 进程已结束
        )
    )
) else (
    echo ✅ 端口3000空闲
)

echo.
echo ════════════════════════════════════════════════════════════════
echo [步骤 5/6] 验证关键文件...
echo ════════════════════════════════════════════════════════════════

set FILE_MISSING=0

if not exist "src\views\WorkflowAgent.vue" (
    echo ❌ WorkflowAgent.vue文件缺失
    set FILE_MISSING=1
) else (
    echo ✅ WorkflowAgent.vue存在
)

if not exist "src\views\WorkflowEditorV5_N8N.vue" (
    echo ❌ WorkflowEditorV5_N8N.vue文件缺失
    set FILE_MISSING=1
) else (
    echo ✅ WorkflowEditorV5_N8N.vue存在
)

if not exist "src\router\index.js" (
    echo ❌ router/index.js文件缺失
    set FILE_MISSING=1
) else (
    echo ✅ router/index.js存在
    
    :: 检查路由配置
    findstr /C:"workflow-editor-v5-n8n" src\router\index.js > nul 2>&1
    if errorlevel 1 (
        echo ⚠️  警告：路由配置中未找到v5工作流路由
        set FILE_MISSING=1
    ) else (
        echo ✅ 路由配置正确
    )
)

if %FILE_MISSING%==1 (
    echo.
    echo ❌ 发现文件缺失或配置错误
    echo.
    echo 建议操作：
    echo   1. 检查Git仓库完整性
    echo   2. 重新克隆项目
    echo   3. 联系技术支持
    echo.
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════════
echo [步骤 6/6] 启动开发服务器...
echo ════════════════════════════════════════════════════════════════

echo.
echo 正在启动服务器...
echo 服务器将在新窗口中运行
echo.

start "AIWEB工作流智能体" cmd /k "title AIWEB开发服务器 && npm run dev"

echo ✅ 服务器已启动

:: 等待服务器启动
echo.
echo 等待服务器完全启动（约10秒）...
timeout /t 10 /nobreak > nul

echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo ✅ 修复完成！
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo 📌 接下来的操作：
echo.
echo 1. 打开浏览器访问以下任一地址：
echo.
echo    v7.0 旗舰版（推荐）:
echo    http://localhost:3000/workflow-editor-v5-n8n
echo.
echo    v3.0 企业版:
echo    http://localhost:3000/workflow-agent-v3
echo.
echo    v4.0 专业版:
echo    http://localhost:3000/workflow-editor-v4
echo.
echo 2. 如果页面仍然有问题：
echo    - 按F12打开浏览器开发者工具
echo    - 切换到Console标签
echo    - 截图错误信息并寻求技术支持
echo.
echo 3. 使用诊断工具进一步检查：
echo    运行 "🔍_诊断工作流智能体_2025-12-21.bat"
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo 按任意键打开推荐的v7.0版本...
pause > nul

start http://localhost:3000/workflow-editor-v5-n8n

echo.
echo ✅ 浏览器已打开，请开始测试！
echo.
echo 如需关闭服务器，请关闭"AIWEB开发服务器"窗口
echo.
pause
