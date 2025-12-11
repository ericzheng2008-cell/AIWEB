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
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  
  // 构建优化
  build: {
    // 输出目录
    outDir: 'dist',
    
    // 静态资源基础路径
    assetsDir: 'assets',
    
    // chunk 大小警告阈值（KB）
    chunkSizeWarningLimit: 1000,
    
    // 生产环境关闭 sourcemap
    sourcemap: false,
    
    // 压缩选项
    minify: 'esbuild',
    
    // Rollup 打包配置
    rollupOptions: {
      output: {
        // 手动分包策略
        manualChunks: {
          // Vue 核心库
          'vue-vendor': ['vue', 'vue-router', 'pinia', 'vue-i18n'],
          
          // Element Plus UI库
          'element-plus': ['element-plus', '@element-plus/icons-vue'],
          
          // HTTP 库
          'http-vendor': ['axios'],
          
          // CMS 管理相关
          'cms': [
            './src/store/cms.js',
            './src/store/cmsAdvanced.js',
            './src/views/admin/CmsManage.vue'
          ],
          
          // 页面内容管理
          'page-content': [
            './src/store/pageContent.js',
            './src/views/admin/PageContentManage.vue'
          ]
        },
        
        // 输出文件命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    
    // 资源内联阈值（KB）
    assetsInlineLimit: 4096,
    
    // CSS 代码拆分
    cssCodeSplit: true,
    
    // 启用 CSS 压缩
    cssMinify: true
  },
  
  // 生产环境移除 console 和 debugger
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  },
  
  // 优化依赖预构建
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'vue-i18n',
      'element-plus',
      '@element-plus/icons-vue',
      'axios'
    ],
    exclude: []
  }
})
