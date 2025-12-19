/**
 * 演示数据初始化工具
 * 用于确保所有访客看到相同的初始数据
 */

// 默认演示数据
// 🔧 管理员可以通过访问 /import-demo-data.html 导出实际配置的数据，然后替换这里的内容
const demoData = {
  // 标记：演示数据版本
  demoDataVersion: '1.0.0',
  
  // CMS 首页Banner数据
  cms: JSON.stringify({
    homeBanners: [
      {
        id: 'banner-1',
        title: {
          'zh-CN': '专业工业工具',
          'en-US': 'Professional Industrial Tools'
        },
        subtitle: {
          'zh-CN': '为您的装配提供精准解决方案',
          'en-US': 'Precise Solutions for Your Assembly'
        },
        image: '/images/banner1.jpg',
        buttonText: {
          'zh-CN': '了解更多',
          'en-US': 'Learn More'
        },
        buttonAction: 'products',
        status: 'active',
        order: 1
      },
      {
        id: 'banner-2',
        title: {
          'zh-CN': '智能装配方案',
          'en-US': 'Smart Assembly Solutions'
        },
        subtitle: {
          'zh-CN': '提升生产效率，降低成本',
          'en-US': 'Boost Efficiency, Reduce Costs'
        },
        image: '/images/banner2.jpg',
        buttonText: {
          'zh-CN': '探索方案',
          'en-US': 'Explore Solutions'
        },
        buttonAction: 'solutions',
        status: 'active',
        order: 2
      }
    ],
    featuredProducts: [
      {
        id: 'featured-1',
        title: {
          'zh-CN': '智能拧紧系统',
          'en-US': 'Smart Tightening System'
        },
        description: {
          'zh-CN': '高精度扭矩控制，实时数据监控',
          'en-US': 'High-precision torque control with real-time monitoring'
        },
        mediaType: 'image',
        mediaUrl: '/images/product-demo.jpg',
        thumbnailUrl: '/images/product-thumb.jpg',
        link: '/products',
        status: 'active',
        order: 1
      }
    ]
  }),

  // 其他 store 的初始数据可以在这里添加
  // 例如：
  // products: JSON.stringify({ list: [...] }),
  // classroom: JSON.stringify({ courses: [...] }),
}

/**
 * 初始化演示数据
 * 只在首次访问时加载，避免覆盖用户的操作
 */
export function initDemoData() {
  try {
    // 检查是否已加载过演示数据
    const loadedVersion = localStorage.getItem('demoDataVersion')
    const currentVersion = demoData.demoDataVersion

    // 如果版本相同，说明已加载过，直接返回
    if (loadedVersion === currentVersion) {
      console.log('✅ 演示数据已存在，版本:', loadedVersion)
      return
    }

    console.log('📦 正在加载演示数据...')

    // 只加载不存在的数据，避免覆盖用户已有的配置
    let loadedCount = 0
    for (const [key, value] of Object.entries(demoData)) {
      // 如果该键不存在，则加载默认数据
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, value)
        loadedCount++
      }
    }

    // 标记版本
    localStorage.setItem('demoDataVersion', currentVersion)

    console.log(`✅ 演示数据加载完成！共加载 ${loadedCount} 项`)
    console.log('💡 提示：访问 /import-demo-data.html 可以导出/导入自定义数据')
  } catch (error) {
    console.error('❌ 演示数据加载失败:', error)
  }
}

/**
 * 强制重新加载演示数据（会覆盖现有数据）
 * ⚠️ 仅用于开发/测试
 */
export function forceReloadDemoData() {
  if (confirm('⚠️ 这将覆盖所有现有数据，确定继续吗？')) {
    for (const [key, value] of Object.entries(demoData)) {
      localStorage.setItem(key, value)
    }
    console.log('✅ 演示数据已强制重新加载')
    location.reload()
  }
}

/**
 * 清空所有数据
 * ⚠️ 仅用于开发/测试
 */
export function clearAllData() {
  if (confirm('⚠️ 这将清空所有数据，确定继续吗？')) {
    localStorage.clear()
    console.log('✅ 所有数据已清空')
    location.reload()
  }
}

// 在开发环境下暴露到全局，方便调试
if (import.meta.env.MODE === 'development') {
  window.__demoData = {
    init: initDemoData,
    forceReload: forceReloadDemoData,
    clear: clearAllData
  }
  console.log('🔧 开发模式：可通过 window.__demoData 访问数据管理功能')
}
