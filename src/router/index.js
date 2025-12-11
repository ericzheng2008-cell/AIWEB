import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/products-services',
    name: 'ProductsServices',
    component: () => import('../views/ProductsServices.vue')
  },
  {
    path: '/divisions',
    name: 'Divisions',
    component: () => import('../views/Divisions.vue')
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/Products.vue')
  },
  {
    path: '/product-category/:categoryId',
    name: 'ProductCategory',
    component: () => import('../views/ProductCategory.vue')
  },
  {
    path: '/product-category/:categoryId/:subCategoryId',
    name: 'ProductSubCategory',
    component: () => import('../views/ProductCategory.vue')
  },
  {
    path: '/product-category/:categoryId/:subCategoryId/:thirdCategoryId',
    name: 'ProductThirdCategory',
    component: () => import('../views/ProductCategory.vue')
  },
  {
    path: '/product-category/:categoryId/:subCategoryId/:thirdCategoryId/:fourthCategoryId',
    name: 'ProductFourthCategory',
    component: () => import('../views/ProductCategory.vue')
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetail.vue')
  },
  {
    path: '/solutions',
    name: 'Solutions',
    component: () => import('../views/Solutions.vue')
  },
  {
    path: '/solution-category/:categoryId',
    name: 'SolutionCategory',
    component: () => import('../views/SolutionCategory.vue')
  },
  {
    path: '/solution-category/:categoryId/:subCategoryId',
    name: 'SolutionSubCategory',
    component: () => import('../views/SolutionCategory.vue')
  },
  {
    path: '/solution-category/:categoryId/:subCategoryId/:thirdCategoryId',
    name: 'SolutionThirdCategory',
    component: () => import('../views/SolutionCategory.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/service',
    name: 'Service',
    component: () => import('../views/Service.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/Contact.vue')
  },
  {
    path: '/ai-knowledge',
    name: 'AiKnowledge',
    component: () => import('../views/AiKnowledgeManager.vue')
  },
  // 管理后台路由
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true },
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue')
      },
      {
        path: 'cms',
        name: 'AdminCms',
        component: () => import('../views/admin/CmsManage.vue')
      },
      {
        path: 'page-content',
        name: 'AdminPageContent',
        component: () => import('../views/admin/PageContentManage.vue')
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../views/admin/UserManagement.vue')
      },
      {
        path: 'ai-knowledge',
        name: 'AdminAiKnowledge',
        component: () => import('../views/AiKnowledgeManager.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('adminToken')
  
  if (to.meta.requiresAuth && !token) {
    // 需要登录但未登录，跳转到登录页
    next('/admin/login')
  } else if (to.meta.requiresGuest && token) {
    // 已登录访问登录页，跳转到后台首页
    next('/admin/dashboard')
  } else {
    next()
  }
})

export default router
