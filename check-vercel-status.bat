@echo off
chcp 65001 >nul
cls
echo ========================================
echo   检查 Vercel 部署状态
echo ========================================
echo.

cd /d "%~dp0"

echo [检查1] 测试网络连接...
ping vercel.com -n 2

echo.
echo [检查2] 查看 Vercel 项目列表...
vercel list

echo.
echo [检查3] 查看最新部署状态...
vercel inspect

echo.
echo ========================================
echo   如果看到部署成功但无法访问
echo   可能是以下原因：
echo ========================================
echo.
echo 1. 网络问题（最常见）
echo    - 尝试使用手机流量访问
echo    - 使用 VPN
echo    - 等待几分钟后重试
echo.
echo 2. DNS 未生效
echo    - 等待 5-10 分钟
echo    - 清除浏览器缓存
echo    - 使用无痕模式
echo.
echo 3. 防火墙拦截
echo    - 临时关闭防火墙测试
echo    - 检查公司网络限制
echo.
echo 4. Vercel 服务问题
echo    - 访问 status.vercel.com 查看状态
echo.
pause
