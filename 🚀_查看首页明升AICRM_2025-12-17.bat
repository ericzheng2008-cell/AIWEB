@echo off
chcp 65001 >nul
cls

echo.
echo ============================================
echo    🚀 查看首页新增明升AICRM智能体
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
    echo 🌐 访问地址：
    echo    http://localhost:3003/
    echo.
    echo 📍 在首页找到：
    echo    ▶ AI智能体中心
    echo    ▶ 第9个智能体卡片：明升AICRM智能助手
    echo    ▶ 标签：客户管理 / AI预测 / 商机跟进
    echo    ▶ 徽章：AI营销
    echo.
    timeout /t 3 >nul
    start http://localhost:3003/
) else (
    echo 🔧 正在启动服务器...
    start /B npm run dev
    echo.
    echo ⏳ 等待服务器启动（约10秒）...
    timeout /t 10 >nul
    echo.
    echo ✅ 服务器已启动！
    echo.
    echo 🌐 访问地址：
    echo    http://localhost:3003/
    echo.
    timeout /t 2 >nul
    start http://localhost:3003/
)

echo.
echo ============================================
echo    明升AICRM 功能亮点
echo ============================================
echo.
echo 📊 智能看板
echo    - 商机总览（漏斗图）
echo    - AI赢率预测（准确率87%%）
echo    - 客户实时动态
echo    - AI推荐任务
echo    - KPI面板
echo.
echo 👤 客户360°
echo    - 基本信息档案
echo    - 行为轨迹时间线
echo    - AI意向评分
echo    - 推荐下一步行动
echo.
echo 💼 商机管理
echo    - 5阶段漏斗
echo    - 决策链触达
echo    - AI推荐策略
echo.
echo ⚙️ 自动化流程
echo    - 线索自动捕获
echo    - AI分析（赢率/意向/风险）
echo    - 半自动执行
echo    - 反馈闭环优化
echo.
echo 📝 待办任务
echo    - AI自动生成
echo    - 优先级排序
echo    - 人工确认执行
echo.
echo ============================================
echo.
echo 💡 提示：
echo    - 点击卡片进入明升AICRM系统
echo    - 后台管理：/admin/mingsheng-aicrm
echo.
pause
