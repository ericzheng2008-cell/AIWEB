# 📦 GitHub + 自动部署完整指南

## 🎯 **三步完成部署**

---

## 步骤1️⃣：创建 GitHub 仓库

### **操作步骤：**

1. **打开 GitHub 创建仓库页面**
   ```
   https://github.com/new
   ```

2. **填写仓库信息**：
   - **Repository name**: `mingsheng-website`
   - **Description**: `广州市明升伟业机电有限公司官网`
   - **可见性**: 选择 `Public`（推荐）或 `Private`
   - **重要**：不要勾选任何初始化选项
   - 点击 **"Create repository"**

3. **复制仓库地址**
   
   创建成功后，页面会显示：
   ```
   https://github.com/你的用户名/mingsheng-website.git
   ```
   
   **复制这个地址！**

---

## 步骤2️⃣：推送代码到 GitHub

### **方法A - 使用脚本（推荐）：**

1. **双击运行**：
   ```
   push-to-github.bat
   ```

2. **粘贴仓库地址**：
   ```
   请输入你的 GitHub 仓库地址: 
   → 粘贴你复制的地址
   → 按回车
   ```

3. **等待推送完成**

### **方法B - 手动执行命令：**

在 PowerShell 中执行（替换为你的仓库地址）：

```powershell
cd c:/Users/EricZ/CodeBuddy/AIWEB1

# 添加远程仓库
git remote add origin https://github.com/你的用户名/mingsheng-website.git

# 推送代码
git push -u origin main
```

### **如果遇到权限问题：**

#### **解决方案1 - 使用 Personal Access Token：**

1. **生成 Token**：
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 勾选 `repo` 权限
   - 点击 "Generate token"
   - **复制生成的 Token**（只显示一次！）

2. **使用 Token 推送**：
   ```powershell
   git remote set-url origin https://YOUR_TOKEN@github.com/你的用户名/mingsheng-website.git
   git push -u origin main
   ```

#### **解决方案2 - 使用 GitHub Desktop（最简单）：**

1. 下载安装：https://desktop.github.com/
2. 登录 GitHub 账号
3. File → Add Local Repository
4. 选择 `c:/Users/EricZ/CodeBuddy/AIWEB1`
5. 点击 "Publish repository"

---

## 步骤3️⃣：在 Netlify/Vercel 导入项目

推送成功后，选择一个平台部署：

---

### **选项A：Netlify 导入（推荐）**

#### **1. 访问 Netlify**
```
https://app.netlify.com
```

#### **2. 点击 "Import from Git"**

#### **3. 选择 GitHub**
- 首次使用需要授权 Netlify 访问 GitHub
- 点击 "Authorize Netlify"

#### **4. 选择仓库**
- 找到 `mingsheng-website`
- 点击选择

#### **5. 配置构建设置**
系统会自动检测到 `netlify.toml` 配置文件：
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **直接点击 "Deploy site"**

#### **6. 等待部署完成**
约 2-3 分钟后，会显示：
```
✅ Site is live at https://random-name.netlify.app
```

#### **7. 自定义域名（可选）**
- 点击 "Domain settings"
- 点击 "Options" → "Edit site name"
- 修改为：`mingsheng-website`
- 访问地址变为：`https://mingsheng-website.netlify.app`

---

### **选项B：Vercel 导入**

#### **1. 访问 Vercel**
```
https://vercel.com
```

#### **2. 点击 "Add New..." → "Project"**

#### **3. 导入 Git Repository**
- 选择 "Import Git Repository"
- 点击 "GitHub"
- 找到 `mingsheng-website`

#### **4. 配置项目**
系统会自动识别 Vue 项目：
- **Framework Preset**: `Vue.js`
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- 点击 **"Deploy"**

#### **5. 等待部署**
约 2 分钟后，会显示：
```
✅ Your project is live at https://mingsheng-website.vercel.app
```

---

## 🎉 **部署完成后的优势**

### ✅ **自动部署**
每次你推送代码到 GitHub：
```bash
git add .
git commit -m "更新内容"
git push
```
→ Netlify/Vercel 会自动重新部署！

### ✅ **预览部署**
- 每个分支都有独立的预览地址
- Pull Request 自动生成预览链接
- 方便团队协作和测试

### ✅ **版本回滚**
- 保存所有部署历史
- 一键回滚到任何版本
- 安全可靠

### ✅ **免费功能**
- 自动 HTTPS 证书
- 全球 CDN 加速
- 自定义域名
- 无限带宽（Netlify）
- 无限部署次数

---

## 📊 **后续更新流程**

### **1. 修改网站内容**
在 IDE 中编辑文件

### **2. 提交更改**
```bash
git add .
git commit -m "更新描述"
```

### **3. 推送到 GitHub**
```bash
git push
```

### **4. 自动部署**
Netlify/Vercel 会自动检测到更新并重新部署（约2分钟）

---

## 🔧 **常见问题**

### **Q1: 推送时提示 "Permission denied"**

**解决方法**：使用 Personal Access Token 或 GitHub Desktop

### **Q2: 部署失败，显示 "Build failed"**

**检查项**：
1. 确认 `package.json` 存在
2. 确认构建命令正确：`npm run build`
3. 查看部署日志，找到具体错误

### **Q3: 网站访问 404**

**原因**：路由配置问题

**解决**：确认以下文件存在：
- `netlify.toml` （Netlify）
- `vercel.json` （Vercel）

### **Q4: 如何回滚到之前的版本？**

**Netlify**：
1. 进入项目 Dashboard
2. 点击 "Deploys"
3. 找到要回滚的版本
4. 点击 "Publish deploy"

**Vercel**：
1. 进入项目 Dashboard
2. 点击 "Deployments"
3. 找到要回滚的版本
4. 点击 "Promote to Production"

---

## 📞 **需要帮助？**

如果遇到问题：
1. 查看 GitHub Actions 日志
2. 查看 Netlify/Vercel 部署日志
3. 检查浏览器控制台错误

---

## 🎯 **推荐的工作流程**

### **开发环境**：
```bash
npm run dev
# 访问 http://localhost:3000
```

### **测试构建**：
```bash
npm run build
npm run preview
```

### **部署到生产**：
```bash
git add .
git commit -m "更新内容"
git push
# 自动部署到线上
```

---

**开始第一步：创建 GitHub 仓库！** 🚀

访问：https://github.com/new
