@echo off
chcp 65001 > nul
title 工作流智能体问题诊断工具
color 0E

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║           🔍 工作流智能体问题诊断工具                          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [诊断开始] 检测项目环境...
echo ════════════════════════════════════════════════════════════════
echo.

:: 检查1: Node.js环境
echo [1/8] 检查Node.js环境...
node -v > nul 2>&1
if errorlevel 1 (
    echo ❌ 未安装Node.js
    echo    请访问 https://nodejs.org 下载安装
    set HAS_ERROR=1
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo ✅ Node.js版本: !NODE_VERSION!
)
echo.

:: 检查2: npm环境
echo [2/8] 检查npm环境...
npm -v > nul 2>&1
if errorlevel 1 (
    echo ❌ npm不可用
    set HAS_ERROR=1
) else (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo ✅ npm版本: !NPM_VERSION!
)
echo.

:: 检查3: 项目文件
echo [3/8] 检查项目文件...
if not exist "package.json" (
    echo ❌ package.json文件不存在
    set HAS_ERROR=1
) else (
    echo ✅ package.json存在
)

if not exist "src\views\WorkflowAgent.vue" (
    echo ❌ WorkflowAgent.vue文件不存在
    set HAS_ERROR=1
) else (
    echo ✅ WorkflowAgent.vue存在
)

if not exist "src\views\WorkflowEditorV5_N8N.vue" (
    echo ❌ WorkflowEditorV5_N8N.vue文件不存在
    set HAS_ERROR=1
) else (
    echo ✅ WorkflowEditorV5_N8N.vue存在
)
echo.

:: 检查4: node_modules
echo [4/8] 检查依赖安装...
if not exist "node_modules" (
    echo ❌ node_modules不存在，需要运行 npm install
    set HAS_ERROR=1
    set NEED_INSTALL=1
) else (
    echo ✅ node_modules存在
)
echo.

:: 检查5: 关键依赖
echo [5/8] 检查关键依赖包...
if exist "node_modules\vue" (
    echo ✅ Vue已安装
) else (
    echo ❌ Vue未安装
    set NEED_INSTALL=1
)

if exist "node_modules\element-plus" (
    echo ✅ Element Plus已安装
) else (
    echo ❌ Element Plus未安装
    set NEED_INSTALL=1
)

if exist "node_modules\vue-router" (
    echo ✅ Vue Router已安装
) else (
    echo ❌ Vue Router未安装
    set NEED_INSTALL=1
)
echo.

:: 检查6: 端口占用
echo [6/8] 检查端口占用情况...
netstat -ano | findstr ":3000" > nul 2>&1
if errorlevel 1 (
    echo ✅ 端口3000空闲
) else (
    echo ⚠️  端口3000已被占用
    echo    可能已有服务器在运行，或需要关闭占用进程
)

netstat -ano | findstr ":5000" > nul 2>&1
if errorlevel 1 (
    echo ✅ 端口5000空闲
) else (
    echo ⚠️  端口5000已被占用（后端服务器端口）
)
echo.

:: 检查7: 路由配置
echo [7/8] 检查路由配置...
findstr /C:"workflow-agent" src\router\index.js > nul 2>&1
if errorlevel 1 (
    echo ❌ 路由配置中未找到工作流相关路由
    set HAS_ERROR=1
) else (
    echo ✅ 路由配置正确
    echo    已发现工作流路由注册
)
echo.

:: 检查8: 生成HTML诊断报告
echo [8/8] 生成浏览器诊断页面...
(
echo ^<!DOCTYPE html^>
echo ^<html^>
echo ^<head^>
echo ^<meta charset="UTF-8"^>
echo ^<title^>工作流智能体诊断报告^</title^>
echo ^<style^>
echo body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
echo .container { max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1^); }
echo h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
echo h2 { color: #3498db; margin-top: 30px; }
echo .test-item { background: #ecf0f1; padding: 15px; margin: 10px 0; border-radius: 5px; }
echo .success { color: #27ae60; font-weight: bold; }
echo .error { color: #e74c3c; font-weight: bold; }
echo .warning { color: #f39c12; font-weight: bold; }
echo .code { background: #2c3e50; color: #ecf0f1; padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; margin: 10px 0; }
echo button { background: #3498db; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 5px; }
echo button:hover { background: #2980b9; }
echo ^</style^>
echo ^</head^>
echo ^<body^>
echo ^<div class="container"^>
echo ^<h1^>🔍 工作流智能体诊断报告^</h1^>
echo ^<p^>诊断时间: %date% %time%^</p^>
echo ^<h2^>快速访问测试^</h2^>
echo ^<div class="test-item"^>
echo ^<p^>请点击以下按钮测试不同版本的工作流智能体：^</p^>
echo ^<button onclick="window.open('http://localhost:3000/workflow-agent'^)"^>测试 v2.7 基础版^</button^>
echo ^<button onclick="window.open('http://localhost:3000/workflow-agent-v3'^)"^>测试 v3.0 企业版^</button^>
echo ^<button onclick="window.open('http://localhost:3000/workflow-editor-v4'^)"^>测试 v4.0 专业版^</button^>
echo ^<button onclick="window.open('http://localhost:3000/workflow-editor-v5-n8n'^)" style="background:#27ae60"^>测试 v7.0 旗舰版 ⭐^</button^>
echo ^</div^>
echo ^<h2^>常见问题解决方案^</h2^>
echo ^<div class="test-item"^>
echo ^<h3 class="error"^>问题1: 页面空白或无法访问^</h3^>
echo ^<p^>^<strong^>解决方案：^</strong^>^</p^>
echo ^<div class="code"^>npm run dev^</div^>
echo ^<p^>确保开发服务器正在运行（端口3000）^</p^>
echo ^</div^>
echo ^<div class="test-item"^>
echo ^<h3 class="error"^>问题2: 节点拖拽不工作^</h3^>
echo ^<p^>^<strong^>解决方案：^</strong^> 按 Ctrl+F5 强制刷新页面^</p^>
echo ^</div^>
echo ^<div class="test-item"^>
echo ^<h3 class="error"^>问题3: 控制台JavaScript错误^</h3^>
echo ^<p^>^<strong^>解决方案：^</strong^>^</p^>
echo ^<ol^>
echo ^<li^>按F12打开浏览器开发者工具^</li^>
echo ^<li^>切换到Console标签^</li^>
echo ^<li^>查看具体错误信息^</li^>
echo ^<li^>将错误信息截图发送给技术支持^</li^>
echo ^</ol^>
echo ^</div^>
echo ^<h2^>调试工具^</h2^>
echo ^<div class="test-item"^>
echo ^<button onclick="testAPI(^)"^>测试后端API连接^</button^>
echo ^<button onclick="checkLocalStorage(^)"^>检查本地存储^</button^>
echo ^<button onclick="clearCache(^)"^>清除浏览器缓存^</button^>
echo ^<div id="debug-output" style="margin-top:15px; padding:10px; background:#f8f9fa; border-radius:5px; display:none;"^>^</div^>
echo ^</div^>
echo ^<script^>
echo function testAPI(^) {
echo   const output = document.getElementById('debug-output'^);
echo   output.style.display = 'block';
echo   output.innerHTML = '^<p^>正在测试API连接...^</p^>';
echo   fetch('http://localhost:5000/api/health'^)
echo     .then(r =^> r.json(^)^)
echo     .then(data =^> { output.innerHTML = '^<p class="success"^>✅ 后端API连接正常！^</p^>'; }^)
echo     .catch(e =^> { output.innerHTML = '^<p class="error"^>❌ 后端API无法连接。请确保后端服务器已启动。^</p^>'; }^);
echo }
echo function checkLocalStorage(^) {
echo   const output = document.getElementById('debug-output'^);
echo   output.style.display = 'block';
echo   const items = [];
echo   for^(let i=0; i^<localStorage.length; i++^) {
echo     const key = localStorage.key^(i^);
echo     items.push^(`${key}: ${localStorage.getItem^(key^)}`^);
echo   }
echo   output.innerHTML = '^<h4^>本地存储内容：^</h4^>^<pre^>' + items.join^('\\n'^) + '^</pre^>';
echo }
echo function clearCache(^) {
echo   localStorage.clear(^);
echo   sessionStorage.clear(^);
echo   alert^('缓存已清除！请刷新页面。'^);
echo   location.reload(^);
echo }
echo ^</script^>
echo ^</div^>
echo ^</body^>
echo ^</html^>
) > "工作流智能体诊断报告.html"

echo ✅ 诊断页面已生成
echo.

:: 诊断总结
echo ════════════════════════════════════════════════════════════════
echo.
echo [诊断总结]
echo.

if defined NEED_INSTALL (
    echo ⚠️  需要安装依赖包
    echo    请运行: npm install
    echo.
)

if defined HAS_ERROR (
    echo ❌ 发现一些问题，请查看上述详细信息
    echo.
    echo 建议操作:
    if defined NEED_INSTALL (
        echo 1. 运行 npm install 安装依赖
    )
    echo 2. 查看 工作流智能体诊断报告.html 了解详情
    echo 3. 联系技术支持并提供错误截图
) else (
    echo ✅ 所有基础检查通过！
    echo.
    echo 环境正常，可以启动测试：
    echo 1. 运行 npm run dev 启动前端服务器
    echo 2. 访问 http://localhost:3000/workflow-editor-v5-n8n
    echo 3. 如仍有问题，请按F12查看浏览器控制台
)

echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo 正在打开诊断报告...
timeout /t 2 /nobreak > nul
start 工作流智能体诊断报告.html

echo.
echo ✅ 诊断完成！
echo.
pause
