@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   测试 ToolsNet 电报解析器
echo ========================================
echo.

cd /d %~dp0

echo [1/3] 创建测试脚本...
(
echo import { ToolsNetTelegramParser } from './server/utils/toolsnet-telegram-parser.js'
echo import { ALL_EXAMPLES } from './server/utils/toolsnet-telegram-examples.js'
echo.
echo console.log('========================================')
echo console.log('  ToolsNet 电报解析器测试')
echo console.log('========================================\n')
echo.
echo // 测试1: 结果电报 (OK)
echo console.log('【测试1】解析结果电报 (OK状态)')
echo console.log('---')
echo try {
echo   const parsed = ToolsNetTelegramParser.parse(ALL_EXAMPLES.result1^)
echo   console.log('✅ 电报类型:', parsed.type^)
echo   console.log('✅ VIN号:', parsed.content.vinNumber^)
echo   console.log('✅ Spindle数量:', parsed.content.numberOfSpindles^)
echo   const spindle = parsed.content.spindles[0]
echo   console.log('✅ Spindle状态:', spindle.overallStatusText^)
echo   console.log('✅ 扭矩:', spindle.torque.value, 'Nm', '(', spindle.torque.statusText, '^)')
echo   console.log('✅ 角度:', spindle.angle.value, '度', '(', spindle.angle.statusText, '^)')
echo   console.log('测试通过！\n')
echo } catch (error^) {
echo   console.error('❌ 测试失败:', error.message^)
echo }
echo.
echo // 测试2: 结果电报 (NOK)
echo console.log('【测试2】解析结果电报 (NOK状态^)')
echo console.log('---')
echo try {
echo   const parsed = ToolsNetTelegramParser.parse(ALL_EXAMPLES.resultNOK^)
echo   const spindle = parsed.content.spindles[0]
echo   console.log('✅ 电报类型:', parsed.type^)
echo   console.log('✅ Spindle状态:', spindle.overallStatusText, '(应为NOK^)')
echo   console.log('✅ 扭矩状态:', spindle.torque.statusText, '(应为Low^)')
echo   console.log('测试通过！\n')
echo } catch (error^) {
echo   console.error('❌ 测试失败:', error.message^)
echo }
echo.
echo // 测试3: 错误事件电报
echo console.log('【测试3】解析错误事件电报')
echo console.log('---')
echo try {
echo   const parsed = ToolsNetTelegramParser.parse(ALL_EXAMPLES.errorEvent^)
echo   console.log('✅ 电报类型:', parsed.type^)
echo   console.log('✅ 错误代码:', parsed.content.errorCode^)
echo   console.log('✅ 事件级别:', parsed.content.eventLevel^)
echo   console.log('测试通过！\n')
echo } catch (error^) {
echo   console.error('❌ 测试失败:', error.message^)
echo }
echo.
echo // 测试4: 系统描述电报
echo console.log('【测试4】解析系统描述电报')
echo console.log('---')
echo try {
echo   const parsed = ToolsNetTelegramParser.parse(ALL_EXAMPLES.systemDesc^)
echo   console.log('✅ 电报类型:', parsed.type^)
echo   console.log('✅ 系统名称:', parsed.content.systemName^)
echo   console.log('✅ IP地址:', parsed.content.ipAddress^)
echo   console.log('测试通过！\n')
echo } catch (error^) {
echo   console.error('❌ 测试失败:', error.message^)
echo }
echo.
echo // 测试5: 工位描述电报
echo console.log('【测试5】解析工位描述电报')
echo console.log('---')
echo try {
echo   const parsed = ToolsNetTelegramParser.parse(ALL_EXAMPLES.stationDesc^)
echo   console.log('✅ 电报类型:', parsed.type^)
echo   console.log('✅ 工位名称:', parsed.content.stationName^)
echo   console.log('✅ Spindle数量:', parsed.content.numberOfSpindles^)
echo   console.log('✅ 第1个Spindle:', parsed.content.spindles[0].spindleName^)
echo   console.log('✅ 程序数量:', parsed.content.spindles[0].numberOfPrograms^)
echo   console.log('测试通过！\n')
echo } catch (error^) {
echo   console.error('❌ 测试失败:', error.message^)
echo }
echo.
echo // 测试6: 构建确认电报
echo console.log('【测试6】构建确认电报')
echo console.log('---')
echo try {
echo   const ack = ToolsNetTelegramParser.buildAcknowledgeTelegram('00001', '000'^)
echo   console.log('✅ 确认电报长度:', ack.substring(0, 4^)^)
echo   console.log('✅ 电报类型:', ack.substring(4, 6^), '(应为05^)')
echo   console.log('✅ Identifier:', ack.substring(6, 11^), '(应为00001^)')
echo   console.log('✅ 完整电报:', ack^)
echo   console.log('测试通过！\n')
echo } catch (error^) {
echo   console.error('❌ 测试失败:', error.message^)
echo }
echo.
echo // 测试7: Keep-Alive电报
echo console.log('【测试7】解析Keep-Alive电报')
echo console.log('---')
echo try {
echo   const parsed = ToolsNetTelegramParser.parse(ALL_EXAMPLES.keepAlive^)
echo   console.log('✅ 电报类型:', parsed.type^)
echo   console.log('测试通过！\n')
echo } catch (error^) {
echo   console.error('❌ 测试失败:', error.message^)
echo }
echo.
echo console.log('========================================')
echo console.log('  所有测试完成！')
echo console.log('========================================')
) > test-telegram-parser.mjs

echo [2/3] 运行测试...
echo.
node test-telegram-parser.mjs

echo.
echo [3/3] 清理测试文件...
del test-telegram-parser.mjs

echo.
echo ========================================
echo   测试完成！
echo ========================================
echo.
pause
