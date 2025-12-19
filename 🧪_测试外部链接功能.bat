@echo off
chcp 65001 >nul
echo ========================================
echo    外部链接管理功能测试指南
echo ========================================
echo.
echo 📋 测试清单:
echo.
echo [1] 后台管理测试
echo     访问: http://localhost:8080/admin/classroom-manage
echo     → 点击"外部链接管理"标签页
echo     → 测试添加/编辑/删除功能
echo.
echo [2] 前台展示测试  
echo     访问: http://localhost:8080/tech-classroom
echo     → 点击"协作机器人"
echo     → 选择"协作机器人基础"
echo     → 查看"推荐学习资源"区域
echo.
echo [3] AI聊天测试
echo     → 点击右下角聊天按钮
echo     → 输入: "我想学习协作机器人"
echo     → 查看建议卡片
echo.
echo ========================================
echo.

choice /C 123 /M "选择要测试的功能"

if errorlevel 3 goto ai_test
if errorlevel 2 goto frontend_test
if errorlevel 1 goto admin_test

:admin_test
echo.
echo 正在打开后台管理...
start http://localhost:8080/admin/classroom-manage
echo.
echo 💡 测试步骤:
echo 1. 点击"外部链接管理"标签页
echo 2. 点击"添加外部链接"按钮
echo 3. 填写节卡学院信息:
echo    - 一级分类: 协作机器人
echo    - 链接标题: 节卡学院 - 协作机器人技术学习平台
echo    - 链接地址: https://www.jaka.com/zh/jakaAcademy
echo    - 链接类型: 学院平台
echo    - 语言: 中文
echo    - 图标: 🎓
echo 4. 保存并查看列表
echo.
pause
exit

:frontend_test
echo.
echo 正在打开小课堂前台...
start http://localhost:8080/tech-classroom
echo.
echo 💡 测试步骤:
echo 1. 点击"协作机器人"卡片
echo 2. 选择"协作机器人基础"
echo 3. 查看弹窗中的"推荐学习资源"区域
echo 4. 点击外部链接卡片
echo 5. 验证是否打开新窗口
echo.
pause
exit

:ai_test
echo.
echo 正在打开主页...
start http://localhost:8080
timeout /t 3 /nobreak >nul
echo.
echo 💡 测试步骤:
echo 1. 点击右下角紫色聊天按钮
echo 2. 输入: "我想学习协作机器人"
echo 3. 查看AI回复中的建议卡片
echo 4. 点击"进入小课堂"或"节卡学院"卡片
echo 5. 验证跳转是否正确
echo.
echo 💡 其他测试语句:
echo - "协作机器人怎么编程"
echo - "有什么学习资源推荐"
echo - "节卡学院在哪里"
echo.
pause
exit
