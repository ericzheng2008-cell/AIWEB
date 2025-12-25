/**
 * 移动端点击事件修复
 * 解决移动端卡片点击无响应问题
 */

export function useMobileClick() {
  const handleMobileClick = (callback) => {
    return (event) => {
      // 防止事件冒泡
      event.stopPropagation()
      
      // 执行回调
      if (typeof callback === 'function') {
        callback(event)
      }
    }
  }

  return {
    handleMobileClick
  }
}

// 全局添加移动端优化
export function setupMobileOptimizations() {
  // 移除 FastClick 的 300ms 延迟问题（现代浏览器已不需要）
  // 添加调试信息
  console.log('📱 移动端优化已启用')
  
  // 添加 viewport meta 标签（如果不存在）
  if (!document.querySelector('meta[name="viewport"]')) {
    const meta = document.createElement('meta')
    meta.name = 'viewport'
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
    document.head.appendChild(meta)
    console.log('✅ Viewport meta 已添加')
  }
  
  // 全局触摸事件监听（调试用）
  document.addEventListener('touchstart', function(e) {
    console.log('👆 触摸事件触发:', e.target.className)
  }, { passive: true })
  
  document.addEventListener('click', function(e) {
    console.log('🖱️ 点击事件触发:', e.target.className)
  })
}

