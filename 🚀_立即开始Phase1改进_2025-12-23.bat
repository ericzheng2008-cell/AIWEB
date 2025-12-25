@echo off
chcp 65001 >nul
echo.
echo ============================================
echo   🚀 AIWEB Phase 1-2-3 改进计划
echo ============================================
echo.
echo 📋 改进计划已制定完成！
echo.
echo 📂 查看完整计划：
echo    📋_Phase1-2-3改进计划_2025-12-23.md
echo.
echo ✅ Phase 1-1：数据库集成（已完成）
echo    🚀_Phase1-1完成_数据库集成_2025-12-23.md
echo.
echo.
echo ============================================
echo   第1步：安装新依赖
echo ============================================
echo.
echo 正在安装数据库和测试依赖...
call npm install
echo.
echo ✅ 依赖安装完成
echo.
echo.
echo ============================================
echo   第2步：初始化数据库
echo ============================================
echo.
echo 正在创建数据库和默认数据...
call npm run db:init
echo.
echo.
echo ============================================
echo   第3步：启动服务器
echo ============================================
echo.
echo 启动后端服务器（端口5000）...
start "AIWEB后端" cmd /k "npm run server"
timeout /t 3 >nul
echo.
echo 启动前端服务器（端口5173）...
start "AIWEB前端" cmd /k "npm run dev"
timeout /t 3 >nul
echo.
echo.
echo ============================================
echo   ✅ 启动完成！
echo ============================================
echo.
echo 📌 访问地址：
echo    前端：http://localhost:5173
echo    后端：http://localhost:5000
echo.
echo 📌 默认账户：
echo    用户名：admin
echo    密码：admin123
echo.
echo 📌 数据库位置：
echo    ./data/aiweb.db
echo.
echo 📌 验证数据持久化：
echo    1. 登录后台创建产品
echo    2. 重启服务器
echo    3. 数据仍然存在 ✅
echo.
echo 📌 下一步任务：
echo    Phase 1-2: 文件上传安全加固
echo    Phase 1-3: 拆分Home.vue组件
echo.
echo.
pause
