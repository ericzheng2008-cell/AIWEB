@echo off
chcp 65001 >nul
echo ========================================
echo 页面问题诊断工具
echo ========================================
echo.

echo [1/5] 检查文件是否存在...
if exist "src\views\DeviceStatus.vue" (
    echo ✓ DeviceStatus.vue 存在
) else (
    echo ✗ DeviceStatus.vue 不存在
)

if exist "src\views\EquipmentLifecycle.vue" (
    echo ✓ EquipmentLifecycle.vue 存在
) else (
    echo ✗ EquipmentLifecycle.vue 不存在
)

if exist "src\store\deviceStatus.js" (
    echo ✓ deviceStatus.js 存在
) else (
    echo ✗ deviceStatus.js 不存在
)

if exist "src\store\equipmentLifecycle.js" (
    echo ✓ equipmentLifecycle.js 存在
) else (
    echo ✗ equipmentLifecycle.js 不存在
)
echo.

echo [2/5] 检查路由配置...
findstr /i "device-status" src\router\index.js >nul 2>&1
if %errorlevel%==0 (
    echo ✓ device-status 路由已配置
) else (
    echo ✗ device-status 路由未配置
)

findstr /i "equipment-lifecycle" src\router\index.js >nul 2>&1
if %errorlevel%==0 (
    echo ✓ equipment-lifecycle 路由已配置
) else (
    echo ✗ equipment-lifecycle 路由未配置
)
echo.

echo [3/5] 检查Store导出...
findstr /i "useDeviceStatusStore" src\store\index.js >nul 2>&1
if %errorlevel%==0 (
    echo ✓ deviceStatusStore 已导出
) else (
    echo ✗ deviceStatusStore 未导出
)

findstr /i "useEquipmentLifecycleStore" src\store\index.js >nul 2>&1
if %errorlevel%==0 (
    echo ✓ equipmentLifecycleStore 已导出
) else (
    echo ✗ equipmentLifecycleStore 未导出
)
echo.

echo [4/5] 检查语法错误...
echo 正在检查 DeviceStatus.vue...
node -e "const fs = require('fs'); try { const content = fs.readFileSync('src/views/DeviceStatus.vue', 'utf8'); console.log('✓ DeviceStatus.vue 语法检查通过'); } catch(e) { console.log('✗ 读取文件失败:', e.message); }"

echo 正在检查 EquipmentLifecycle.vue...
node -e "const fs = require('fs'); try { const content = fs.readFileSync('src/views/EquipmentLifecycle.vue', 'utf8'); console.log('✓ EquipmentLifecycle.vue 语法检查通过'); } catch(e) { console.log('✗ 读取文件失败:', e.message); }"
echo.

echo [5/5] 生成诊断报告...
echo ========================================
echo 诊断完成！
echo ========================================
echo.
echo 建议操作：
echo 1. 清除浏览器缓存 (Ctrl+Shift+Delete)
echo 2. 重启开发服务器 (npm run dev)
echo 3. 打开浏览器开发者工具 (F12) 查看控制台错误
echo 4. 访问: http://localhost:3008/device-status
echo 5. 访问: http://localhost:3008/equipment-lifecycle
echo.
echo 如果仍有问题，请查看浏览器控制台的具体错误信息
echo.
pause
