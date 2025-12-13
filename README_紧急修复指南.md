# 🚨 紧急修复指南 - localhost:3000 打不开

## 当前状态
- ✅ Node.js 已安装（v24.11.1）
- ✅ npm 已安装（v11.6.2）
- ✅ 依赖已安装（node_modules 存在）
- ✅ Vite 已安装
- ⚠️ 但是 localhost:3000 打不开

---

## 🎯 立即解决（3个脚本任选其一）

### 方案1：一键启动（推荐）
```bash
start-dev-server.bat
```
- 自动清理缓存
- 自动检查依赖
- 启动开发服务器
- 显示详细状态

### 方案2：紧急修复
```bash
emergency-fix.bat
```
- 结束占用端口的进程
- 清理所有缓存
- 强制重启服务器

### 方案3：诊断修复
```bash
diagnose-and-fix.bat
```
- 完整诊断环境
- 重装依赖
- 清理缓存
- 启动服务器

---

## 📋 手动操作步骤（如果脚本不行）

### 步骤1：打开命令行
按 `Win + R`，输入 `cmd`，回车

### 步骤2：进入项目目录
```bash
cd C:\Users\EricZ\CodeBuddy\AIWEB1
```

### 步骤3：清理缓存
```bash
rmdir /s /q node_modules\.vite
rmdir /s /q dist
```

### 步骤4：启动服务器
```bash
npm run dev
```

### 步骤5：查看输出
**成功的输出应该是：**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.x.x:3000/
```

**然后手动在浏览器打开：** http://localhost:3000

---

## 🐛 如果看到错误

### 错误类型1：端口被占用
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决：**
```bash
# 查找占用进程
netstat -ano | findstr ":3000"

# 结束进程（替换1234为实际PID）
taskkill /F /PID 1234

# 重新启动
npm run dev
```

### 错误类型2：模块未找到
```
Error: Cannot find module 'xxx'
```

**解决：**
```bash
npm install
npm run dev
```

### 错误类型3：其他错误
运行诊断脚本获取完整错误信息：
```bash
check-error.bat
```
然后将 `error.log` 文件内容发给我。

---

## ✅ 验证成功的标志

1. 命令行显示：`ready in xxx ms`
2. 命令行显示：`Local: http://localhost:3000/`
3. 浏览器打开 http://localhost:3000 能看到网站首页
4. 页面显示"企业营销平台"
5. 语言切换、AI客服等功能正常

---

## 🔄 完整重置（终极方案）

如果以上都不行，执行完整重置：

```bash
# 1. 删除依赖
rmdir /s /q node_modules
del package-lock.json

# 2. 清理缓存
npm cache clean --force

# 3. 重新安装
npm install

# 4. 启动
npm run dev
```

---

## 📞 需要帮助？

如果还是不行，请提供以下信息：

1. **运行哪个脚本？**
2. **完整的错误输出（截图或复制）**
3. **运行 `npm run dev` 后的完整输出**
4. **浏览器访问 localhost:3000 看到什么？**
   - 无法访问？
   - 空白页？
   - 错误信息？

---

## 💡 常见原因

根据经验，localhost:3000 打不开通常是：

1. ❌ 服务器没启动成功（看命令行有无错误）
2. ❌ 端口被占用（3000端口被其他程序占用）
3. ❌ 浏览器缓存（清除缓存或用无痕模式）
4. ❌ 防火墙拦截（临时关闭防火墙测试）
5. ❌ 依赖损坏（重装依赖）

---

## 🎯 现在就开始

**立即执行：**
```
双击运行：start-dev-server.bat
```

如果看到 "ready in xxx ms"，就在浏览器打开：
**http://localhost:3000**

如果报错，截图发给我！
