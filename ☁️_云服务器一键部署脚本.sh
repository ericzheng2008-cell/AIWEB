#!/bin/bash
##############################################
# AIWEB 云服务器一键部署脚本 v1.0
# 支持系统：Ubuntu 20.04/22.04
# 用途：企业内测环境快速部署
##############################################

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 打印Banner
print_banner() {
    clear
    cat << "EOF"
========================================
     AIWEB 一键部署脚本 v1.0
  支持Ubuntu 20.04/22.04 LTS
========================================
EOF
    echo ""
}

# 检查root权限
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "请使用root权限运行此脚本"
        echo "使用命令：sudo bash $0"
        exit 1
    fi
}

# 检查系统
check_system() {
    log_info "检查系统环境..."
    
    if [[ ! -f /etc/os-release ]]; then
        log_error "无法识别的操作系统"
        exit 1
    fi
    
    source /etc/os-release
    
    if [[ "$ID" != "ubuntu" ]]; then
        log_error "仅支持Ubuntu系统"
        exit 1
    fi
    
    log_info "系统：$PRETTY_NAME"
}

# 更新系统
update_system() {
    log_info "更新系统软件包..."
    apt update -qq
    apt upgrade -y -qq
    log_info "✓ 系统更新完成"
}

# 安装基础工具
install_basic_tools() {
    log_info "安装基础工具..."
    apt install -y -qq \
        curl \
        wget \
        git \
        vim \
        ufw \
        build-essential \
        software-properties-common \
        gnupg2 \
        ca-certificates
    log_info "✓ 基础工具安装完成"
}

# 安装Node.js
install_nodejs() {
    log_info "安装Node.js 18..."
    
    # 检查是否已安装
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        log_warn "Node.js已安装：$NODE_VERSION"
        read -p "是否重新安装？(y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            return 0
        fi
    fi
    
    # 添加NodeSource仓库
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - > /dev/null 2>&1
    
    # 安装Node.js
    apt install -y nodejs
    
    # 验证安装
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    log_info "✓ Node.js安装完成：$NODE_VERSION"
    log_info "✓ npm版本：$NPM_VERSION"
}

# 安装pnpm
install_pnpm() {
    log_info "安装pnpm..."
    npm install -g pnpm --quiet
    PNPM_VERSION=$(pnpm --version)
    log_info "✓ pnpm安装完成：$PNPM_VERSION"
}

# 安装PM2
install_pm2() {
    log_info "安装PM2进程管理器..."
    npm install -g pm2 --quiet
    PM2_VERSION=$(pm2 --version)
    log_info "✓ PM2安装完成：$PM2_VERSION"
}

# 安装Nginx
install_nginx() {
    log_info "安装Nginx..."
    
    if command -v nginx &> /dev/null; then
        log_warn "Nginx已安装"
        return 0
    fi
    
    apt install -y nginx
    systemctl start nginx
    systemctl enable nginx
    log_info "✓ Nginx安装完成"
}

# 克隆代码
clone_code() {
    log_info "克隆AIWEB代码..."
    
    cd /var/www
    
    # 如果目录已存在，询问是否覆盖
    if [[ -d "AIWEB" ]]; then
        log_warn "目录已存在：/var/www/AIWEB"
        read -p "是否删除并重新克隆？(y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf AIWEB
        else
            log_info "使用现有代码"
            return 0
        fi
    fi
    
    # 克隆代码
    log_info "从GitHub克隆代码..."
    git clone https://github.com/ericzheng2008-cell/AIWEB.git
    
    # 设置权限
    chown -R www-data:www-data AIWEB
    
    log_info "✓ 代码克隆完成"
}

# 安装依赖
install_dependencies() {
    log_info "安装项目依赖..."
    
    cd /var/www/AIWEB
    
    # 安装依赖
    pnpm install --prod
    
    log_info "✓ 依赖安装完成"
}

# 构建前端
build_frontend() {
    log_info "构建前端代码..."
    
    cd /var/www/AIWEB
    
    # 构建
    pnpm run build
    
    # 验证dist目录
    if [[ ! -d "dist" ]]; then
        log_error "构建失败：dist目录不存在"
        exit 1
    fi
    
    log_info "✓ 前端构建完成"
}

# 配置Nginx
configure_nginx() {
    log_info "配置Nginx..."
    
    # 获取服务器IP
    SERVER_IP=$(curl -s ifconfig.me)
    
    # 创建配置文件
    cat > /etc/nginx/sites-available/aiweb << EOF
server {
    listen 80;
    server_name $SERVER_IP _;
    
    # 日志
    access_log /var/log/nginx/aiweb-access.log;
    error_log /var/log/nginx/aiweb-error.log;
    
    # 前端静态文件
    location / {
        root /var/www/AIWEB/dist;
        try_files \$uri \$uri/ /index.html;
        index index.html;
        
        # 缓存控制
        add_header Cache-Control "no-cache, must-revalidate";
    }
    
    # API代理
    location /api/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_http_version 1.1;
        
        # 代理头
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot|webp)$ {
        root /var/www/AIWEB/dist;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/json application/javascript;
}
EOF
    
    # 启用站点
    ln -sf /etc/nginx/sites-available/aiweb /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # 测试配置
    nginx -t
    
    # 重新加载
    systemctl reload nginx
    
    log_info "✓ Nginx配置完成"
}

# 启动后端服务
start_backend() {
    log_info "启动后端服务..."
    
    cd /var/www/AIWEB/server
    
    # 创建必要目录
    mkdir -p data uploads logs
    chown -R www-data:www-data data uploads logs
    
    # 创建环境变量文件
    cat > .env << EOF
PORT=5000
NODE_ENV=production
DATABASE_PATH=./data/aiweb.db
JWT_SECRET=$(openssl rand -hex 32)
UPLOAD_DIR=./uploads
EOF
    
    # 使用PM2启动
    pm2 delete aiweb-backend 2>/dev/null || true
    pm2 start index.js --name aiweb-backend \
        --log ./logs/backend.log \
        --error ./logs/backend-error.log \
        --time
    
    # 配置开机自启
    pm2 startup systemd -u root --hp /root > /dev/null
    pm2 save
    
    log_info "✓ 后端服务已启动"
}

# 配置防火墙
configure_firewall() {
    log_info "配置防火墙..."
    
    # 允许SSH
    ufw allow 22/tcp comment "SSH"
    
    # 允许HTTP/HTTPS
    ufw allow 80/tcp comment "HTTP"
    ufw allow 443/tcp comment "HTTPS"
    
    # 启用防火墙
    echo "y" | ufw enable > /dev/null 2>&1
    
    log_info "✓ 防火墙配置完成"
}

# 创建自动备份
setup_backup() {
    log_info "配置自动备份..."
    
    # 创建备份目录
    mkdir -p /backup/aiweb
    
    # 创建备份脚本
    cat > /usr/local/bin/backup-aiweb.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/aiweb"
DATE=$(date +%Y%m%d_%H%M%S)

# 备份数据库
cp /var/www/AIWEB/server/data/aiweb.db $BACKUP_DIR/aiweb_$DATE.db

# 备份上传文件
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/AIWEB/server/uploads/ 2>/dev/null

# 删除30天前的备份
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "$(date): 备份完成" >> /var/log/aiweb-backup.log
EOF
    
    chmod +x /usr/local/bin/backup-aiweb.sh
    
    # 添加定时任务（每天凌晨2点）
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-aiweb.sh") | crontab -
    
    log_info "✓ 自动备份配置完成（每天凌晨2点）"
}

# 打印完成信息
print_completion() {
    SERVER_IP=$(curl -s ifconfig.me)
    
    clear
    cat << EOF
========================================
     ✅ AIWEB部署完成！
========================================

🌐 访问地址：
   电脑端：http://$SERVER_IP
   手机端：http://$SERVER_IP

📱 内测人员可通过以下方式访问：
   - 电脑浏览器输入上述地址
   - 手机浏览器输入上述地址
   - 扫描二维码（需生成）

🔐 默认登录：
   账号：admin
   密码：Admin@123

📊 服务状态：
   Nginx：systemctl status nginx
   后端：pm2 status
   日志：pm2 logs aiweb-backend

🔧 管理命令：
   重启后端：pm2 restart aiweb-backend
   重载Nginx：systemctl reload nginx
   查看备份：ls -lh /backup/aiweb

📖 文档位置：
   /var/www/AIWEB/README.md

⚠️ 下一步建议：
   1. 配置域名（可选）
   2. 配置HTTPS（推荐）
   3. 分享访问地址给内测人员
   4. 定期查看日志和备份

========================================
EOF

    # 保存部署信息
    cat > /root/aiweb-deploy-info.txt << EOF
AIWEB部署信息
====================
部署时间：$(date)
服务器IP：$SERVER_IP
访问地址：http://$SERVER_IP
Node版本：$(node --version)
PM2状态：pm2 status
Nginx配置：/etc/nginx/sites-available/aiweb
代码目录：/var/www/AIWEB
备份目录：/backup/aiweb
====================
EOF
    
    log_info "部署信息已保存到：/root/aiweb-deploy-info.txt"
}

# 主函数
main() {
    print_banner
    check_root
    check_system
    
    echo ""
    log_info "准备开始部署AIWEB..."
    echo ""
    read -p "按Enter键继续，Ctrl+C取消..." 
    
    update_system
    install_basic_tools
    install_nodejs
    install_pnpm
    install_pm2
    install_nginx
    clone_code
    install_dependencies
    build_frontend
    configure_nginx
    start_backend
    configure_firewall
    setup_backup
    print_completion
}

# 执行主函数
main
