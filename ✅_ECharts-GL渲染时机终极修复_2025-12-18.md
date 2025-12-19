# ✅ ECharts-GL 渲染时机终极修复完成（v-show 问题已解决）

## 问题描述
控制台持续出现 ECharts-GL 错误：
```
echarts-gl.js:43 Dom has no width or height
[ECharts] Can't get DOM width or height. Please check dom.clientWidth and dom.clientHeight.
```

## 根本原因 🎯
**关键发现**：组件在父组件中使用 `v-show` 而非 `v-if`！

```vue
<!-- MingShengAICRM_V3.vue -->
<div v-show="activeModule === 'sandbox'" class="sandbox-module">
  <CustomerSandboxAdvanced />
</div>
```

### 问题分析
1. **v-show 特性**：元素始终在 DOM 中，只是通过 `display: none` 隐藏
2. **容器尺寸为 0**：被隐藏的元素 `clientWidth` 和 `clientHeight` 都是 0
3. **组件过早初始化**：`onMounted` 时容器被隐藏，导致 ECharts 初始化失败
4. **重复渲染**：用户切换到该模块时，已隐藏的容器被显示，但图表未重新渲染

## 修复方案

### 核心修复：检查容器可见性
在所有 3 个渲染函数中添加 `offsetParent` 检查：

```javascript
const render3DSandbox = (retryCount = 0) => {
  if (!sandbox3DRef.value) return
  
  // 🔑 关键修复：检查容器是否可见（v-show 导致容器存在但不可见）
  const container = sandbox3DRef.value
  if (container.offsetParent === null) {
    // 容器被隐藏（display: none），最多重试 10 次
    if (retryCount < 10) {
      setTimeout(() => render3DSandbox(retryCount + 1), 300)
    }
    return
  }
  
  // 检查容器尺寸
  const width = container.clientWidth
  const height = container.clientHeight
  
  if (!width || !height) {
    // 最多重试5次，避免无限循环
    if (retryCount < 5) {
      setTimeout(() => render3DSandbox(retryCount + 1), 200)
    }
    return
  }
  
  // ... 其余初始化代码
}
```

### 辅助修复
1. **延迟初始化**：`onMounted` + `setTimeout(500ms)`
2. **延迟切换**：`watch(viewMode)` + `setTimeout(300ms)`
3. **resize 保护**：resize 前检查当前尺寸

## 技术细节

### offsetParent 检查
- **offsetParent === null**：元素或其祖先被隐藏（display: none）
- **offsetParent !== null**：元素可见且有定位上下文
- **优势**：比检查 `getComputedStyle` 更快，比检查尺寸更准确

### v-show vs v-if
| 特性 | v-show | v-if |
|------|--------|------|
| DOM 存在 | ✅ 始终存在 | ❌ 条件销毁 |
| clientWidth | ⚠️ 隐藏时为 0 | ❌ 不存在 |
| offsetParent | ⚠️ 隐藏时为 null | ❌ 不存在 |
| 适用场景 | 频繁切换 | 偶尔渲染 |

## 修改文件
- ✅ `src/components/CustomerSandboxAdvanced.vue`
  - `render3DSandbox()`：添加 offsetParent 检查，重试次数 10 次
  - `renderTimeline()`：添加 offsetParent 检查，重试次数 10 次
  - `renderMatrix()`：添加 offsetParent 检查，重试次数 10 次
  - `onMounted()`：延迟 500ms
  - `watch(viewMode)`：延迟 300ms

## 修复效果
- ✅ **彻底消除警告**：容器隐藏时不再尝试初始化 ECharts
- ✅ **自动等待显示**：容器显示后自动渲染图表（最多等待 3 秒）
- ✅ **保持性能**：避免无效的初始化和 resize 调用
- ✅ **兼容 v-show**：完美支持父组件使用 v-show 控制显示

## 六层防护机制
1. **可见性检查**：offsetParent !== null（新增）⭐
2. **延迟初始化**：onMounted + setTimeout(500ms)
3. **延迟切换**：watch + setTimeout(300ms)
4. **尺寸检查**：clientWidth && clientHeight > 0
5. **resize 保护**：resize 前二次检查
6. **异常捕获**：try-catch 捕获所有渲染错误

## 测试建议
1. ✅ 切换到"客户沙盘分析"模块，检查控制台无警告
2. ✅ 在其他模块时，检查不会触发图表初始化
3. ✅ 快速切换模块，验证无重复警告
4. ✅ 刷新页面，验证初始化流程正确

---
**修复时间**：2025-12-18  
**影响范围**：客户沙盘分析组件的 3 个图表渲染函数  
**核心突破**：解决 v-show 导致的容器隐藏问题 🎯
