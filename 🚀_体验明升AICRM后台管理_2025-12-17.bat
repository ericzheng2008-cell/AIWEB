@echo off
chcp 65001 >nul
cls

echo.
echo ============================================
echo    🚀 明升AICRM 后台管理系统
echo ============================================
echo.
echo 正在启动开发服务器...
echo.

cd /d "%~dp0"

:: 检查Node进程是否已运行
tasklist /FI "IMAGENAME eq node.exe" | find /I "node.exe" >nul
if %errorlevel% equ 0 (
    echo ✅ 开发服务器已在运行
    echo.
    echo 🌐 后台管理访问地址：
    echo    http://localhost:3003/admin/login
    echo.
    echo 📝 登录后点击左侧菜单：💼 明升AICRM
    echo.
    echo 🎯 前台访问地址：
    echo    http://localhost:3003/mingsheng-aicrm
    echo.
    timeout /t 3 >nul
    start http://localhost:3003/admin/mingsheng-aicrm
) else (
    echo 🔧 正在启动服务器...
    start /B npm run dev
    echo.
    echo ⏳ 等待服务器启动（约10秒）...
    timeout /t 10 >nul
    echo.
    echo ✅ 服务器已启动！
    echo.
    echo 🌐 后台管理访问地址：
    echo    http://localhost:3003/admin/login
    echo.
    echo 📝 登录后点击左侧菜单：💼 明升AICRM
    echo.
    timeout /t 2 >nul
    start http://localhost:3003/admin/mingsheng-aicrm
)

echo.
echo ============================================
echo    功能模块（6大Tab）
echo ============================================
echo.
echo 📊 Tab 1: 智能看板配置
echo    - DB-01: 商机总览（漏斗图）
echo    - DB-02: AI赢率预测
echo    - DB-03: 客户动态
echo    - DB-04: AI推荐任务
echo    - DB-05: KPI面板
echo.
echo 👤 Tab 2: 客户360°配置
echo    - CP-01: 基本信息
echo    - CP-02: 行为轨迹
echo    - CP-03: AI意向预测
echo    - CP-04: 推荐动作
echo    - CP-05: CRM快速操作
echo.
echo 💼 Tab 3: 商机管理配置
echo    - OP-01: 商机信息
echo    - OP-02: 决策链管理
echo    - OP-03: AI推荐下一步
echo.
echo ⚙️ Tab 4: 自动化流程配置
echo    - WF-01: 新线索捕获
echo    - WF-02: 客户ID归一化
echo    - WF-03: AI自动分析
echo    - WF-04: 推荐行动生成
echo    - WF-05: 半自动执行
echo    - WF-06: 行为反馈闭环
echo.
echo 📝 Tab 5: 待办任务配置
echo    - 任务来源、优先级、状态
echo    - 任务提醒、逾期处理
echo.
echo ⚙️ Tab 6: 系统设置
echo    - 界面设置（名称/Logo/主题/语言）
echo    - 功能设置（保留期/备份/导出）
echo    - 集成设置（CRM/邮件/数据云）
echo.
echo ============================================
echo.
echo 💡 提示：按Ctrl+C退出
echo.
pause
