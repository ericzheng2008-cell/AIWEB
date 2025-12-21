# 📖 Markdown转PDF完整指南

版本：v1.0.0  
日期：2025-12-20  
适用项目：AIWEB v2.5.0

---

## 🎯 5种方法对比

| 方法 | 难度 | 效果 | 中文支持 | 推荐度 |
|-----|------|------|---------|--------|
| VSCode插件 | ⭐ | ⭐⭐⭐ | ✅ | ⭐⭐⭐⭐⭐ |
| 在线工具 | ⭐ | ⭐⭐⭐ | ✅ | ⭐⭐⭐⭐ |
| Typora | ⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ | ⭐⭐⭐⭐⭐ |
| Pandoc | ⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ | ⭐⭐⭐⭐ |
| 批量脚本 | ⭐ | ⭐⭐⭐⭐ | ✅ | ⭐⭐⭐⭐⭐ |

---

## 方法1️⃣：VSCode插件（最快速）

### 安装步骤：

1. **打开VSCode**
2. **点击左侧扩展图标**（或按 `Ctrl + Shift + X`）
3. **搜索** `Markdown PDF`
4. **安装** "Markdown PDF" by yzane

### 使用方法：

```
1. 在VSCode中打开任意 .md 文件
2. 按 Ctrl + Shift + P
3. 输入 "Markdown PDF: Export (pdf)"
4. 按 Enter
5. 等待转换完成（会自动保存在同目录）
```

### 配置中文字体：

在 `settings.json` 中添加：

```json
{
  "markdown-pdf.styles": [],
  "markdown-pdf.headerTemplate": "<div></div>",
  "markdown-pdf.footerTemplate": "<div style='font-size:9px; text-align:center; width:100%;'>第 <span class='pageNumber'></span> 页 / 共 <span class='totalPages'></span> 页</div>"
}
```

---

## 方法2️⃣：在线工具（无需安装）

### 推荐网站：

#### 1. Markdown to PDF
🔗 https://www.markdowntopdf.com/

**步骤：**
1. 访问网站
2. 点击 "Choose File" 或拖拽 `.md` 文件
3. 点击 "Convert"
4. 下载PDF

#### 2. Dillinger
🔗 https://dillinger.io/

**步骤：**
1. 访问网站
2. 将Markdown内容粘贴到左侧编辑器
3. 点击右上角 "Export as" → "PDF"
4. 下载文件

#### 3. CloudConvert
🔗 https://cloudconvert.com/md-to-pdf

**步骤：**
1. 访问网站
2. 选择文件
3. 点击 "Start Conversion"
4. 下载转换后的PDF

---

## 方法3️⃣：Typora（最美观）⭐推荐

### 下载安装：

🔗 官网：https://typora.io/  
💰 价格：$14.99（约89元人民币），终身授权

### 使用步骤：

```
1. 用Typora打开 .md 文件
2. 点击 文件 → 导出 → PDF
3. 选择保存位置
4. 点击保存
```

### 优点：

- ✅ 所见即所得编辑
- ✅ 完美支持中文
- ✅ 排版最美观
- ✅ 支持数学公式、图表
- ✅ 可自定义CSS样式

### 自定义样式：

1. 点击 `文件` → `偏好设置` → `外观` → `打开主题文件夹`
2. 在文件夹中创建 `custom.css`：

```css
body {
  font-family: "Microsoft YaHei", "SimSun", serif;
  font-size: 14px;
  line-height: 1.8;
}

h1, h2, h3 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 8px;
}

code {
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
}
```

---

## 方法4️⃣：Pandoc（最专业）

### 安装Pandoc：

#### Windows方式1（推荐）：
```bash
# 使用Chocolatey包管理器
choco install pandoc
```

#### Windows方式2：
1. 访问 https://pandoc.org/installing.html
2. 下载 `pandoc-x.x.x-windows-x86_64.msi`
3. 双击安装

#### 验证安装：
```bash
pandoc --version
```

### 基础转换命令：

```bash
# 简单转换
pandoc input.md -o output.pdf

# 支持中文（重要！）
pandoc input.md -o output.pdf --pdf-engine=xelatex -V CJKmainfont="Microsoft YaHei"

# 添加目录
pandoc input.md -o output.pdf --pdf-engine=xelatex -V CJKmainfont="Microsoft YaHei" --toc

# 完整配置
pandoc input.md -o output.pdf \
  --pdf-engine=xelatex \
  -V CJKmainfont="Microsoft YaHei" \
  -V geometry:margin=1in \
  --toc \
  --toc-depth=3 \
  -V colorlinks=true \
  -V linkcolor=blue \
  -V urlcolor=blue
```

### 转换AIWEB项目文档：

```bash
# 转换企业内部部署方案
pandoc "📘_AIWEB企业内部部署完整方案_2025-12-20_v2.5.0.md" \
  -o "AIWEB企业内部部署方案.pdf" \
  --pdf-engine=xelatex \
  -V CJKmainfont="Microsoft YaHei" \
  -V geometry:margin=1in \
  --toc \
  -V colorlinks=true

# 转换功能截图说明
pandoc "📘_AIWEB功能截图完整说明_2025-12-20_v2.5.0.md" \
  -o "AIWEB功能截图说明.pdf" \
  --pdf-engine=xelatex \
  -V CJKmainfont="Microsoft YaHei" \
  --toc

# 转换移动端部署方案
pandoc "📘_移动端APP和小程序部署完整方案_2025-12-20_v2.5.0.md" \
  -o "移动端APP部署方案.pdf" \
  --pdf-engine=xelatex \
  -V CJKmainfont="Microsoft YaHei" \
  --toc
```

---

## 方法5️⃣：批量转换脚本（最高效）⭐推荐

### 使用方法：

**前提条件：** 已安装Pandoc

**步骤：**
```
1. 双击运行 "📄_批量转换MD为PDF.bat"
2. 等待转换完成
3. 自动打开 "PDF文档" 文件夹
4. 所有PDF文件已生成
```

### 脚本功能：

- ✅ 自动检测Pandoc是否安装
- ✅ 批量转换所有📘、🎊、📖、📊开头的 `.md` 文件
- ✅ 自动创建 `PDF文档` 目录
- ✅ 支持中文，使用微软雅黑字体
- ✅ 自动生成目录（TOC）
- ✅ 彩色超链接
- ✅ 显示转换进度和结果

### 转换的文件列表：

```
📘_AIWEB企业内部部署完整方案_2025-12-20_v2.5.0.md
📘_AIWEB公网部署完整方案_2025-12-20_v2.5.0.md
📘_AIWEB功能截图完整说明_2025-12-20_v2.5.0.md
📘_移动端APP和小程序部署完整方案_2025-12-20_v2.5.0.md
📘_AIWEB代码模块完整说明_2025-12-20_v2.5.0.md
📘_设备全生命周期管理完整说明_2025-12-20_v2.5.0.md
📘_AIWEB网站完整功能说明_2025-12-20_v2.5.0.md
🎊_四项任务全部完成_2025-12-20_v2.5.0.md
... 等所有重要文档
```

---

## 📊 各方法对比详情

### VSCode插件
**优点：**
- 最简单，一键转换
- 无需额外软件
- 自动保存

**缺点：**
- 样式定制有限
- 批量转换需手动

**适用场景：** 快速转换单个文件

---

### 在线工具
**优点：**
- 无需安装任何软件
- 随时随地可用
- 操作简单

**缺点：**
- 需要上传文件（安全性）
- 依赖网络
- 批量转换麻烦

**适用场景：** 临时转换、无法安装软件的环境

---

### Typora
**优点：**
- 排版最美观
- 所见即所得
- 支持实时预览
- 高度自定义

**缺点：**
- 付费软件（89元）
- 批量转换需手动

**适用场景：** 专业文档编写、追求最佳效果

---

### Pandoc
**优点：**
- 最专业、最强大
- 支持多种格式
- 高度可定制
- 免费开源

**缺点：**
- 需要学习命令行
- 安装稍复杂

**适用场景：** 批量转换、自动化脚本

---

### 批量脚本
**优点：**
- 一键批量转换
- 自动化程度最高
- 专为AIWEB项目优化
- 免费

**缺点：**
- 需要先安装Pandoc
- 仅限Windows

**适用场景：** AIWEB项目文档批量导出

---

## 🛠️ 常见问题解决

### 1. 中文乱码问题

**原因：** 未指定中文字体

**解决：**
```bash
# 使用XeLaTeX引擎 + 中文字体
pandoc input.md -o output.pdf --pdf-engine=xelatex -V CJKmainfont="Microsoft YaHei"
```

### 2. 转换失败："missing xelatex"

**原因：** 未安装LaTeX

**解决：**
```bash
# 安装MiKTeX（轻量级LaTeX发行版）
choco install miktex

# 或下载安装包
# https://miktex.org/download
```

### 3. 表格超出页面宽度

**解决：**
```bash
# 添加页边距设置
pandoc input.md -o output.pdf -V geometry:margin=0.5in
```

### 4. 图片不显示

**原因：** 图片路径错误或不支持

**解决：**
- 使用相对路径
- 确保图片存在
- 支持格式：PNG、JPG、GIF

---

## 📌 快速推荐

### 场景1：快速转换单个文件
👉 **使用VSCode插件**

### 场景2：追求最佳效果
👉 **使用Typora**

### 场景3：批量转换AIWEB文档
👉 **使用批量脚本**（需先安装Pandoc）

### 场景4：无法安装软件
👉 **使用在线工具**

---

## 🎯 针对AIWEB项目的最佳实践

### 推荐流程：

```
1. 安装Pandoc（一次性，5分钟）
   https://pandoc.org/installing.html

2. 双击运行批量转换脚本
   📄_批量转换MD为PDF.bat

3. 等待转换完成（约1-2分钟）

4. 打开 "PDF文档" 文件夹

5. 所有PDF文件已生成，可直接分享或打印
```

### 输出的PDF文件：

```
PDF文档/
├── AIWEB企业内部部署完整方案_2025-12-20_v2.5.0.pdf
├── AIWEB公网部署完整方案_2025-12-20_v2.5.0.pdf
├── AIWEB功能截图完整说明_2025-12-20_v2.5.0.pdf
├── 移动端APP和小程序部署完整方案_2025-12-20_v2.5.0.pdf
├── AIWEB代码模块完整说明_2025-12-20_v2.5.0.pdf
├── 设备全生命周期管理完整说明_2025-12-20_v2.5.0.pdf
├── AIWEB网站完整功能说明_2025-12-20_v2.5.0.pdf
└── 四项任务全部完成_2025-12-20_v2.5.0.pdf
```

---

## ✅ 总结

**最推荐的方案：**

1. **日常快速转换** → VSCode插件
2. **专业文档制作** → Typora
3. **AIWEB项目文档批量导出** → 批量转换脚本

**现在就开始：**
```
双击运行 → 📄_批量转换MD为PDF.bat
```

所有AIWEB项目文档将自动转换为精美的PDF！🎉

---

*文档版本：v1.0.0*  
*最后更新：2025-12-20*  
*适用项目：AIWEB v2.5.0*
