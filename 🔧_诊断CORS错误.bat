@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║         🔧 CORS错误诊断工具                                ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📋 关于您看到的CORS错误:
echo.
echo ⚠️  错误信息:
echo     Access to fetch at 'https://dsp.lenovo.com.cn/...'
echo     from origin 'null' has been blocked by CORS policy
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 🔍 错误分析:
echo.
echo ✅ 这个错误与项目代码无关
echo ✅ 不影响项目任何功能
echo ✅ 项目中没有调用联想API
echo.
echo 📌 可能的原因:
echo    1. 浏览器扩展程序(广告拦截器等)
echo    2. 网络运营商注入的广告代码
echo    3. DNS缓存污染
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 💡 解决方案:
echo.
echo 【方案1】清除浏览器缓存(推荐)
echo    1. 按 Ctrl+Shift+Delete
echo    2. 勾选"缓存图像和文件"
echo    3. 清除数据
echo    4. 刷新页面
echo.
echo 【方案2】禁用浏览器扩展
echo    1. 打开浏览器设置
echo    2. 进入"扩展程序"
echo    3. 逐个禁用测试
echo    4. 找到问题扩展并移除
echo.
echo 【方案3】使用隐私模式测试
echo    Chrome: Ctrl+Shift+N
echo    Edge: Ctrl+Shift+P
echo.
echo 【方案4】忽略此错误
echo    如果不影响功能使用,可以直接忽略
echo    在控制台Filter框输入: -lenovo
echo.
echo ═══════════════════════════════════════════════════════════
echo.
echo 🧪 按任意键进行功能测试(验证项目是否正常)...
pause >nul

echo.
echo 🚀 正在打开项目...
start http://localhost:5173

echo.
echo ✅ 已打开项目
echo.
echo 📋 请测试以下功能:
echo    □ 首页加载是否正常
echo    □ 导航栏是否正常
echo    □ 智能体页面是否正常
echo    □ 小课堂功能是否正常
echo    □ 3D驾驶舱是否正常
echo.
echo 💡 如果所有功能正常,说明CORS错误可以忽略
echo.
echo ═══════════════════════════════════════════════════════════
echo.
pause
