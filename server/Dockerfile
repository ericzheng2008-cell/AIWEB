FROM node:18-alpine

WORKDIR /app

# 复制package.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制服务器代码
COPY . .

# 创建上传目录
RUN mkdir -p /app/public/uploads

# 暴露端口
EXPOSE 5000

# 启动服务
CMD ["node", "index.js"]
