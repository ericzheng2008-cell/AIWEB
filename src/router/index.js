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
    path: '/tech-classroom',
    name: 'TechClassroom',
    component: () => import('../views/TechClassroom.vue')
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
  {
    path: '/ai-agents',
    name: 'AiAgents',
    component: () => import('../views/AiAgents.vue')
  },
  {
    path: '/ai-agent/:id',
    name: 'AiAgent',
    component: () => import('../views/AiAgent.vue')
  },
  {
    path: '/tool-selector',
    name: 'ToolSelector',
    component: () => import('../views/ToolSelector.vue')
  },
  {
    path: '/tool-selector-enhanced',
    name: 'ToolSelectorEnhanced',
    component: () => import('../views/ToolSelectorEnhanced.vue'),
    meta: { 
      title: '拧紧工具选型（增强版）',
      description: '具备完全自主运行能力的智能体系统'
    }
  },
  {
    path: '/tightening-data',
    name: 'TighteningData',
    component: () => import('../views/admin/TighteningDataAnalysis.vue')
  },
  {
    path: '/socket-selector',
    name: 'SocketSelector',
    component: () => import('../views/SocketSelector.vue')
  },
  {
    path: '/tool-brand-match',
    name: 'ToolBrandMatch',
    component: () => import('../views/ToolBrandMatch.vue')
  },
  {
    path: '/tightening-strategy',
    name: 'TighteningStrategy',
    component: () => import('../views/TighteningStrategy.vue')
  },
  {
    path: '/cost-optimization',
    name: 'CostOptimization',
    component: () => import('../views/CostOptimization.vue')
  },

  {
    path: '/curve-analysis',
    name: 'CurveAnalysis',
    component: () => import('../views/CurveAnalysis.vue')
  },
  {
    path: '/process-verification',
    name: 'ProcessVerification',
    component: () => import('../views/ProcessVerification.vue')
  },
  {
    path: '/fault-tracking',
    name: 'FaultTracking',
    component: () => import('../views/FaultTracking.vue')
  },
  {
    path: '/equipment-lifecycle',
    name: 'EquipmentLifecycle',
    component: () => import('../views/EquipmentLifecycle.vue')
  },
  {
    path: '/equipment-dashboard',
    name: 'EquipmentDashboard',
    component: () => import('../views/EquipmentDashboard.vue')
  },
  {
    path: '/maintenance-history',
    name: 'MaintenanceHistory',
    component: () => import('../views/MaintenanceHistory.vue')
  },
  {
    path: '/fault-statistics',
    name: 'FaultStatistics',
    component: () => import('../views/FaultStatistics.vue')
  },
  {
    path: '/cost-optimization',
    name: 'CostOptimization',
    component: () => import('../views/CostOptimization.vue')
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
        path: 'products-services',
        name: 'AdminProductsServices',
        component: () => import('../views/admin/ProductsServicesManage.vue')
      },
      {
        path: 'tightening-data',
        name: 'TighteningDataAnalysis',
        component: () => import('../views/admin/TighteningDataAnalysis.vue')
      },
      {
        path: 'classroom',
        name: 'AdminClassroom',
        component: () => import('../views/admin/ClassroomManage.vue')
      },
      {
        path: 'ai-agents',
        name: 'AdminAiAgents',
        component: () => import('../views/admin/AiAgentManage.vue')
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../views/admin/UserManagement.vue')
      },
      {
        path: 'tool-database',
        name: 'AdminToolDatabase',
        component: () => import('../views/admin/ToolDatabase.vue')
      },
      {
        path: 'tool-brand-database',
        name: 'AdminToolBrandDatabase',
        component: () => import('../views/admin/ToolBrandDatabase.vue')
      },
      {
        path: 'socket-database',
        name: 'AdminSocketDatabase',
        component: () => import('../views/admin/SocketDatabase.vue')
      },
      {
        path: 'equipment',
        name: 'AdminEquipment',
        component: () => import('../views/admin/EquipmentManage.vue')
      },
      {
        path: 'workorder',
        name: 'AdminWorkOrder',
        component: () => import('../views/admin/WorkOrderManage.vue')
      },
      {
        path: 'ai-knowledge',
        name: 'AdminAiKnowledge',
        component: () => import('../views/AiKnowledgeManager.vue')
      },
      {
        path: 'workstation',
        name: 'AdminWorkstation',
        component: () => import('../views/admin/WorkstationManage.vue')
      },
      {
        path: 'production-line',
        name: 'AdminProductionLine',
        component: () => import('../views/admin/ProductionLineManage.vue')
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
