# 营销平台后端 API

## 部署到 Railway

### 方式一：通过 Railway CLI（推荐）

1. 安装 Railway CLI：
```bash
npm install -g @railway/cli
```

2. 登录 Railway：
```bash
railway login
```

3. 在 server 目录下初始化项目：
```bash
cd server
railway init
```

4. 部署：
```bash
railway up
```

5. 获取部署 URL：
```bash
railway domain
```

### 方式二：通过 Railway Web 界面

1. 访问 https://railway.app
2. 登录并创建新项目
3. 选择 "Deploy from GitHub repo"
4. 选择您的仓库
5. 设置 Root Directory 为 `server`
6. 点击 Deploy

## 环境变量

在 Railway 项目设置中添加以下环境变量：

- `PORT`: 自动设置（Railway 自动注入）
- `NODE_ENV`: production
- `JWT_SECRET`: 您的 JWT 密钥（自行生成）

## API 端点

部署后，您的 API 将可通过以下地址访问：
- `https://your-app.railway.app/api/auth/*`
- `https://your-app.railway.app/api/products/*`
- `https://your-app.railway.app/api/content/*`
- `https://your-app.railway.app/api/user/*`

## 本地开发

```bash
cd server
npm install
npm run dev
```

服务器将运行在 http://localhost:5000
