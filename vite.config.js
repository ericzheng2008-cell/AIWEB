import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  server: {
    host: '0.0.0.0', // 允许局域网访问
    port: 5173,
    // 允许来自 cpolar 和所有域名的访问
    allowedHosts: [
      '.cpolar.top',
      '.cpolar.cn',
      'localhost',
      '127.0.0.1',
      '0.0.0.0'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  
  // 🚀 构建优化 - 性能提升优先
  build: {
    // 输出目录
    outDir: 'dist',
    
    // 静态资源基础路径
    assetsDir: 'assets',
    
    // chunk 大小警告阈值（KB）- 提高至2000KB
    chunkSizeWarningLimit: 2000,
    
    // 生产环境关闭 sourcemap - 减少体积
    sourcemap: false,
    
    // 压缩选项 - 使用terser获得更好的压缩比
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // 移除console
        drop_debugger: true, // 移除debugger
        pure_funcs: ['console.log', 'console.info'], // 移除特定函数
        passes: 2 // 压缩遍数
      },
      format: {
        comments: false // 移除注释
      }
    },
    
    // 🎯 Rollup 打包配置 - 精细化分包
    rollupOptions: {
      output: {
        // 手动分包策略 - 智能分组
        manualChunks(id) {
          // Vue 核心生态
          if (id.includes('node_modules/vue') || id.includes('node_modules/@vue') || 
              id.includes('node_modules/pinia') || id.includes('node_modules/vue-router') ||
              id.includes('node_modules/vue-i18n')) {
            return 'vue-vendor'
          }
          
          // Element Plus UI库
          if (id.includes('node_modules/element-plus') || id.includes('node_modules/@element-plus')) {
            return 'element-plus'
          }
          
          // ECharts图表库 - 单独分包
          if (id.includes('node_modules/echarts')) {
            return 'echarts-vendor'
          }
          
          // ECharts-GL 3D图表库 - 单独分包
          if (id.includes('node_modules/echarts-gl')) {
            return 'echarts-gl'
          }
          
          // HTTP 和工具库
          if (id.includes('node_modules/axios') || id.includes('node_modules/lodash')) {
            return 'http-vendor'
          }
          
          // 编辑器相关库
          if (id.includes('node_modules/monaco-editor') || id.includes('node_modules/@monaco')) {
            return 'editor'
          }
          
          // AICRM相关页面 - 按需加载
          if (id.includes('views/MingShengAICRM') || id.includes('components/Customer') || 
              id.includes('components/Sales') || id.includes('components/Bidding')) {
            return 'aicrm-module'
          }
          
          // 工作流相关页面 - 按需加载
          if (id.includes('views/Workflow') || id.includes('components/Workflow')) {
            return 'workflow-module'
          }
          
          // 数据分析相关 - 按需加载
          if (id.includes('components/Data') || id.includes('components/Chart') || 
              id.includes('views/Marketing') || id.includes('components/Business')) {
            return 'analytics-module'
          }
          
          // 后台管理模块 - 按需加载
          if (id.includes('views/admin/')) {
            return 'admin-module'
          }
          
          // 其他 node_modules
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
        
        // 输出文件命名 - 带内容哈希便于缓存
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // 根据文件类型分类存储
          const extType = assetInfo.name.split('.').pop()
          if (/png|jpe?g|svg|gif|webp|ico/i.test(extType)) {
            return 'assets/images/[name]-[hash].[ext]'
          }
          if (/woff2?|eot|ttf|otf/i.test(extType)) {
            return 'assets/fonts/[name]-[hash].[ext]'
          }
          return 'assets/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    
    // 资源内联阈值（KB）- 小于8KB的资源内联为base64
    assetsInlineLimit: 8192,
    
    // CSS 代码拆分 - 按路由拆分
    cssCodeSplit: true,
    
    // 启用 CSS 压缩 - 使用 lightningcss
    cssMinify: 'lightningcss',
    
    // 🎯 预加载策略
    modulePreload: {
      polyfill: true
    },
    
    // 🎯 输出优化
    reportCompressedSize: false, // 关闭压缩大小报告以提升构建速度
    
    // 🎯 多线程打包
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  
  // 生产环境移除 console 和 debugger
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  },
  
  // 🚀 优化依赖预构建 - 加速开发服务器
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'vue-i18n',
      'element-plus',
      '@element-plus/icons-vue',
      'axios',
      'echarts/core',
      'echarts/charts',
      'echarts/components',
      'echarts/renderers'
    ],
    exclude: [
      'echarts-gl' // 动态加载，排除预构建
    ],
    // 强制预构建
    force: false,
    // 依赖发现
    entries: [
      'src/main.js',
      'src/views/**/*.vue'
    ]
  },
  
  // 🎯 缓存优化
  cacheDir: 'node_modules/.vite',
  
  // 🎯 性能优化
  performance: {
    maxEntrypointSize: 500000,    // 入口文件最大500KB
    maxAssetSize: 300000,          // 资源文件最大300KB
    hints: 'warning'
  }
})
