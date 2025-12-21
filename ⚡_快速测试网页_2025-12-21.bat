@echo off
chcp 65001 >nul
echo 正在测试 http://localhost:5173 ...
echo.

powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5173' -TimeoutSec 5 -UseBasicParsing; if($response.StatusCode -eq 200) { Write-Host '✅ 网页正常打开！HTTP 200' -ForegroundColor Green; Start-Process 'http://localhost:5173' } else { Write-Host \"⚠️  HTTP $($response.StatusCode)\" -ForegroundColor Yellow } } catch { Write-Host \"❌ 错误: $($_.Exception.Message)\" -ForegroundColor Red; Write-Host ''; Write-Host '💡 请先运行: 本地启动并测试.bat' -ForegroundColor Yellow }"

echo.
pause
