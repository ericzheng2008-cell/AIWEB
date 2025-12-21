/**
 * 🎨 高级动画效果库
 * 提供流畅的页面过渡、元素动画、加载效果等
 */

/**
 * 🌊 滚动动画观察器
 */
export class ScrollAnimationObserver {
  constructor(options = {}) {
    this.options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      animationClass: 'animate-in',
      ...options
    }
    
    this.observer = null
    this.elements = new Set()
  }

  /**
   * 初始化观察器
   */
  init() {
    if (this.observer) return

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(this.options.animationClass)
          
          // 添加延迟动画
          const delay = entry.target.dataset.animationDelay
          if (delay) {
            entry.target.style.animationDelay = `${delay}ms`
          }

          // 观察一次后移除
          if (this.options.once !== false) {
            this.observer.unobserve(entry.target)
          }
        } else if (!this.options.once) {
          entry.target.classList.remove(this.options.animationClass)
        }
      })
    }, {
      threshold: this.options.threshold,
      rootMargin: this.options.rootMargin
    })
  }

  /**
   * 观察元素
   */
  observe(element) {
    if (!this.observer) {
      this.init()
    }

    if (element instanceof NodeList || Array.isArray(element)) {
      element.forEach(el => {
        this.observer.observe(el)
        this.elements.add(el)
      })
    } else if (element) {
      this.observer.observe(element)
      this.elements.add(element)
    }
  }

  /**
   * 停止观察
   */
  unobserve(element) {
    if (!this.observer) return

    if (element) {
      this.observer.unobserve(element)
      this.elements.delete(element)
    } else {
      // 停止观察所有元素
      this.elements.forEach(el => this.observer.unobserve(el))
      this.elements.clear()
    }
  }

  /**
   * 销毁观察器
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
      this.elements.clear()
    }
  }
}

/**
 * ✨ 数字滚动动画
 */
export function animateNumber(element, start, end, duration = 2000, options = {}) {
  const {
    decimals = 0,
    separator = ',',
    prefix = '',
    suffix = '',
    easing = 'easeOutExpo'
  } = options

  const startTime = performance.now()
  const range = end - start

  // 缓动函数
  const easingFunctions = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))
  }

  const easingFn = easingFunctions[easing] || easingFunctions.linear

  function update(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    const currentValue = start + range * easingFn(progress)
    const formattedValue = formatNumber(currentValue, decimals, separator)
    
    element.textContent = `${prefix}${formattedValue}${suffix}`

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  requestAnimationFrame(update)
}

/**
 * 格式化数字
 */
function formatNumber(num, decimals, separator) {
  const fixed = num.toFixed(decimals)
  const parts = fixed.split('.')
  
  // 添加千位分隔符
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  
  return parts.join('.')
}

/**
 * 🎭 页面过渡动画
 */
export const pageTransitions = {
  // 淡入淡出
  fade: {
    enterFromClass: 'opacity-0',
    enterActiveClass: 'transition-opacity duration-300',
    enterToClass: 'opacity-100',
    leaveFromClass: 'opacity-100',
    leaveActiveClass: 'transition-opacity duration-300',
    leaveToClass: 'opacity-0'
  },

  // 从右滑入
  slideRight: {
    enterFromClass: 'translate-x-full opacity-0',
    enterActiveClass: 'transition-all duration-300 ease-out',
    enterToClass: 'translate-x-0 opacity-100',
    leaveFromClass: 'translate-x-0 opacity-100',
    leaveActiveClass: 'transition-all duration-300 ease-in',
    leaveToClass: '-translate-x-full opacity-0'
  },

  // 缩放
  scale: {
    enterFromClass: 'scale-95 opacity-0',
    enterActiveClass: 'transition-all duration-300 ease-out',
    enterToClass: 'scale-100 opacity-100',
    leaveFromClass: 'scale-100 opacity-100',
    leaveActiveClass: 'transition-all duration-200 ease-in',
    leaveToClass: 'scale-95 opacity-0'
  },

  // 旋转淡入
  rotate: {
    enterFromClass: 'rotate-12 opacity-0',
    enterActiveClass: 'transition-all duration-500 ease-out',
    enterToClass: 'rotate-0 opacity-100',
    leaveFromClass: 'rotate-0 opacity-100',
    leaveActiveClass: 'transition-all duration-300 ease-in',
    leaveToClass: '-rotate-12 opacity-0'
  }
}

/**
 * 🎪 粒子动画
 */
export class ParticleAnimation {
  constructor(canvas, options = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.options = {
      particleCount: 50,
      particleSize: 2,
      particleColor: '#409EFF',
      speed: 1,
      connectionDistance: 100,
      ...options
    }
    
    this.particles = []
    this.animationId = null
    
    this.init()
  }

  init() {
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight
    
    // 创建粒子
    for (let i = 0; i < this.options.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.options.speed,
        vy: (Math.random() - 0.5) * this.options.speed
      })
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // 绘制粒子
    this.particles.forEach(particle => {
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, this.options.particleSize, 0, Math.PI * 2)
      this.ctx.fillStyle = this.options.particleColor
      this.ctx.fill()
    })

    // 绘制连接线
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x
        const dy = this.particles[i].y - this.particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < this.options.connectionDistance) {
          this.ctx.beginPath()
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y)
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y)
          this.ctx.strokeStyle = `${this.options.particleColor}${Math.floor((1 - distance / this.options.connectionDistance) * 255).toString(16)}`
          this.ctx.lineWidth = 1
          this.ctx.stroke()
        }
      }
    }
  }

  update() {
    this.particles.forEach(particle => {
      particle.x += particle.vx
      particle.y += particle.vy

      // 边界反弹
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1
    })
  }

  animate() {
    this.draw()
    this.update()
    this.animationId = requestAnimationFrame(() => this.animate())
  }

  start() {
    this.animate()
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }
}

/**
 * 🌈 波纹效果
 */
export function createRipple(event, element, options = {}) {
  const {
    color = 'rgba(255, 255, 255, 0.6)',
    duration = 600
  } = options

  const rect = element.getBoundingClientRect()
  const ripple = document.createElement('span')
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  ripple.style.width = ripple.style.height = `${size}px`
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`
  ripple.style.background = color
  ripple.className = 'ripple-effect'

  element.appendChild(ripple)

  setTimeout(() => {
    ripple.remove()
  }, duration)
}

/**
 * 🎯 打字机效果
 */
export async function typewriterEffect(element, text, options = {}) {
  const {
    speed = 50,
    cursor = true,
    cursorChar = '|',
    onComplete = null
  } = options

  let currentText = ''
  const chars = text.split('')

  // 添加光标
  if (cursor) {
    element.innerHTML = cursorChar
    element.classList.add('typing-cursor')
  }

  for (const char of chars) {
    await new Promise(resolve => setTimeout(resolve, speed))
    currentText += char
    element.innerHTML = cursor ? `${currentText}${cursorChar}` : currentText
  }

  // 移除光标
  if (cursor) {
    await new Promise(resolve => setTimeout(resolve, 500))
    element.classList.remove('typing-cursor')
    element.innerHTML = currentText
  }

  if (onComplete) {
    onComplete()
  }
}

/**
 * 🎨 渐变色动画
 */
export function animateGradient(element, colors, duration = 3000) {
  let startTime = null

  function animate(currentTime) {
    if (!startTime) startTime = currentTime
    const progress = ((currentTime - startTime) % duration) / duration

    const colorCount = colors.length
    const colorIndex = Math.floor(progress * (colorCount - 1))
    const nextColorIndex = (colorIndex + 1) % colorCount
    const colorProgress = (progress * (colorCount - 1)) % 1

    const currentColor = interpolateColor(
      colors[colorIndex],
      colors[nextColorIndex],
      colorProgress
    )

    element.style.background = currentColor
    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}

/**
 * 颜色插值
 */
function interpolateColor(color1, color2, factor) {
  const c1 = hexToRgb(color1)
  const c2 = hexToRgb(color2)

  const r = Math.round(c1.r + (c2.r - c1.r) * factor)
  const g = Math.round(c1.g + (c2.g - c1.g) * factor)
  const b = Math.round(c1.b + (c2.b - c1.b) * factor)

  return `rgb(${r}, ${g}, ${b})`
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

export default {
  ScrollAnimationObserver,
  animateNumber,
  pageTransitions,
  ParticleAnimation,
  createRipple,
  typewriterEffect,
  animateGradient
}
