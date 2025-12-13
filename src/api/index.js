import axios from 'axios'
import { ElMessage } from 'element-plus'

// 从环境变量获取 API 地址，开发环境使用本地，生产环境使用部署的后端
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error('未授权，请登录')
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          ElMessage.error('没有权限访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误')
          break
        default:
          ElMessage.error(error.response.data.message || '请求失败')
      }
    } else {
      ElMessage.error('网络错误，请检查您的网络连接')
    }
    return Promise.reject(error)
  }
)

export default {
  // 用户相关
  login(data) {
    return api.post('/auth/login', data)
  },
  register(data) {
    return api.post('/auth/register', data)
  },
  getUserInfo() {
    return api.get('/user/info')
  },
  
  // 产品相关
  getProducts(params) {
    return api.get('/products', { params })
  },
  getProductDetail(id) {
    return api.get(`/products/${id}`)
  },
  createProduct(data) {
    return api.post('/products', data)
  },
  updateProduct(id, data) {
    return api.put(`/products/${id}`, data)
  },
  deleteProduct(id) {
    return api.delete(`/products/${id}`)
  },
  
  // 内容管理
  getSiteConfig() {
    return api.get('/config/site')
  },
  updateSiteConfig(data) {
    return api.put('/config/site', data)
  },
  getBanners() {
    return api.get('/content/banners')
  },
  saveBanner(data) {
    return api.post('/content/banners', data)
  },
  
  // 文件上传
  uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
