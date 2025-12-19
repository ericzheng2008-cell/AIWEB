@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║         🧪 测试小课堂课程外部链接功能                       ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📋 测试清单:
echo.
echo 【后台功能测试】
echo  1. 访问: http://localhost:5173/#/admin/classroom
echo  2. 进入 "课程管理" 标签
echo  3. 点击 "添加课程" 或编辑现有课程
echo  4. 检查 "外部链接" 输入框是否存在
echo  5. 输入测试URL: https://www.atlascopco.com
echo  6. 点击 "预览" 按钮测试
echo  7. 保存课程
echo  8. 检查课程列表 "外部链接" 列是否显示 "已设置"
echo.
echo 【前台展示测试】
echo  1. 访问: http://localhost:5173/#/tech-classroom
echo  2. 选择分类和二级分类
echo  3. 找到设置了外部链接的课程
echo  4. 检查课程卡片是否有 "🔗 相关链接" 标签
echo  5. 点击课程打开详情页
echo  6. 检查是否有 "🔗 查看相关链接" 按钮
echo  7. 点击按钮测试链接是否正确打开
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 🚀 按任意键打开后台管理页面...
pause >nul

start http://localhost:5173/#/admin/classroom

echo.
echo ✅ 已打开后台管理页面
echo.
echo 📌 完成后台测试后，按任意键打开前台页面...
pause >nul

start http://localhost:5173/#/tech-classroom

echo.
echo ✅ 已打开前台页面
echo.
echo 📖 详细说明请查看: ✅_小课堂课程外部链接功能完成_2025-12-15.md
echo.
pause
