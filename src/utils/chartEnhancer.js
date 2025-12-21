/**
 * 📊 ECharts图表增强工具
 * 提供统一的图表主题、配置优化、性能优化
 */

import * as echarts from 'echarts'

/**
 * 🎨 自定义图表主题
 */
export const customTheme = {
  color: [
    '#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE',
    '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC', '#5470C6'
  ],
  backgroundColor: 'rgba(255, 255, 255, 0)',
  textStyle: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 12,
    fontWeight: 'normal',
    color: '#606266'
  },
  title: {
    textStyle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#303133'
    },
    subtextStyle: {
      fontSize: 14,
      color: '#909399'
    }
  },
  line: {
    smooth: true,
    lineStyle: {
      width: 3
    },
    symbolSize: 6,
    symbol: 'circle',
    areaStyle: {
      opacity: 0.1
    }
  },
  bar: {
    barBorderRadius: [4, 4, 0, 0],
    itemStyle: {
      borderRadius: 4
    }
  },
  pie: {
    radius: ['40%', '70%'],
    label: {
      fontSize: 12,
      color: '#606266'
    },
    labelLine: {
      length: 15,
      length2: 10
    }
  },
  scatter: {
    symbolSize: 10
  },
  radar: {
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: {
      width: 2
    }
  },
  gauge: {
    startAngle: 225,
    endAngle: -45,
    axisLine: {
      lineStyle: {
        width: 12
      }
    },
    pointer: {
      width: 5
    },
    title: {
      fontSize: 16
    },
    detail: {
      fontSize: 24,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    backgroundColor: 'rgba(50, 50, 50, 0.95)',
    borderColor: '#333',
    borderWidth: 0,
    textStyle: {
      color: '#fff',
      fontSize: 13
    },
    padding: [10, 15],
    confine: true,
    extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px;'
  },
  legend: {
    textStyle: {
      fontSize: 13,
      color: '#606266'
    },
    icon: 'circle',
    itemWidth: 12,
    itemHeight: 12
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  axisLine: {
    lineStyle: {
      color: '#E4E7ED'
    }
  },
  splitLine: {
    lineStyle: {
      color: '#F2F6FC',
      type: 'dashed'
    }
  },
  axisTick: {
    lineStyle: {
      color: '#E4E7ED'
    }
  },
  axisLabel: {
    color: '#909399',
    fontSize: 12
  }
}

/**
 * 📊 通用图表配置生成器
 */
export class ChartConfigGenerator {
  /**
   * 生成折线图配置
   */
  static generateLineChart(options = {}) {
    const {
      title = '',
      subtitle = '',
      xAxisData = [],
      series = [],
      legend = true,
      smooth = true,
      areaStyle = false,
      zoom = true
    } = options

    return {
      title: {
        text: title,
        subtext: subtitle,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: legend ? {
        data: series.map(s => s.name),
        bottom: 10
      } : undefined,
      grid: {
        left: '3%',
        right: '4%',
        bottom: zoom ? '15%' : '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
        axisLabel: {
          rotate: xAxisData.length > 10 ? 45 : 0
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      dataZoom: zoom ? [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100
        }
      ] : undefined,
      series: series.map(s => ({
        ...s,
        type: 'line',
        smooth: smooth,
        areaStyle: areaStyle ? { opacity: 0.3 } : undefined,
        emphasis: {
          focus: 'series'
        }
      }))
    }
  }

  /**
   * 生成柱状图配置
   */
  static generateBarChart(options = {}) {
    const {
      title = '',
      subtitle = '',
      xAxisData = [],
      series = [],
      legend = true,
      stack = false,
      horizontal = false
    } = options

    const axisConfig = horizontal ? {
      xAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: xAxisData
      }
    } : {
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          rotate: xAxisData.length > 10 ? 45 : 0
        }
      },
      yAxis: {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      }
    }

    return {
      title: {
        text: title,
        subtext: subtitle,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: legend ? {
        data: series.map(s => s.name),
        bottom: 10
      } : undefined,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      ...axisConfig,
      series: series.map(s => ({
        ...s,
        type: 'bar',
        stack: stack ? 'total' : undefined,
        barMaxWidth: 50,
        itemStyle: {
          borderRadius: horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]
        },
        emphasis: {
          focus: 'series'
        }
      }))
    }
  }

  /**
   * 生成饼图配置
   */
  static generatePieChart(options = {}) {
    const {
      title = '',
      subtitle = '',
      data = [],
      roseType = false,
      radius = ['40%', '70%']
    } = options

    return {
      title: {
        text: title,
        subtext: subtitle,
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        bottom: 10,
        left: 'center'
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: radius,
          roseType: roseType ? 'radius' : undefined,
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            formatter: '{b}: {d}%'
          }
        }
      ]
    }
  }

  /**
   * 生成雷达图配置
   */
  static generateRadarChart(options = {}) {
    const {
      title = '',
      subtitle = '',
      indicator = [],
      series = []
    } = options

    return {
      title: {
        text: title,
        subtext: subtitle,
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        data: series.map(s => s.name),
        bottom: 10
      },
      radar: {
        indicator: indicator,
        radius: '65%',
        splitNumber: 4,
        axisName: {
          color: '#606266',
          fontSize: 12
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(114, 172, 209, 0.1)', 'rgba(114, 172, 209, 0.2)']
          }
        }
      },
      series: [{
        type: 'radar',
        data: series.map(s => ({
          ...s,
          emphasis: {
            lineStyle: {
              width: 4
            }
          }
        }))
      }]
    }
  }

  /**
   * 生成仪表盘配置
   */
  static generateGaugeChart(options = {}) {
    const {
      title = '',
      value = 0,
      min = 0,
      max = 100,
      unit = '%'
    } = options

    return {
      series: [
        {
          type: 'gauge',
          startAngle: 200,
          endAngle: -20,
          min: min,
          max: max,
          splitNumber: 10,
          itemStyle: {
            color: '#5470C6'
          },
          progress: {
            show: true,
            width: 18
          },
          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 18
            }
          },
          axisTick: {
            distance: -30,
            splitNumber: 5,
            lineStyle: {
              width: 2,
              color: '#999'
            }
          },
          splitLine: {
            distance: -35,
            length: 14,
            lineStyle: {
              width: 3,
              color: '#999'
            }
          },
          axisLabel: {
            distance: -20,
            color: '#999',
            fontSize: 14
          },
          anchor: {
            show: false
          },
          title: {
            show: true,
            offsetCenter: [0, '70%'],
            fontSize: 16,
            color: '#606266'
          },
          detail: {
            valueAnimation: true,
            width: '60%',
            lineHeight: 40,
            borderRadius: 8,
            offsetCenter: [0, '10%'],
            fontSize: 40,
            fontWeight: 'bold',
            formatter: `{value}${unit}`,
            color: '#303133'
          },
          data: [
            {
              value: value,
              name: title
            }
          ]
        }
      ]
    }
  }
}

/**
 * ⚡ 图表性能优化器
 */
export class ChartPerformanceOptimizer {
  /**
   * 优化大数据集
   */
  static optimizeLargeDataset(data, maxPoints = 1000) {
    if (data.length <= maxPoints) {
      return data
    }

    // 使用降采样算法
    const step = Math.ceil(data.length / maxPoints)
    const optimized = []
    
    for (let i = 0; i < data.length; i += step) {
      const chunk = data.slice(i, i + step)
      // 取平均值
      const avg = chunk.reduce((sum, val) => sum + (typeof val === 'number' ? val : val.value), 0) / chunk.length
      optimized.push(typeof data[0] === 'number' ? avg : { ...chunk[0], value: avg })
    }

    return optimized
  }

  /**
   * 启用渐进式渲染
   */
  static enableProgressiveRendering(option, dataCount) {
    if (dataCount > 1000) {
      return {
        ...option,
        progressive: 500,
        progressiveThreshold: 1000,
        progressiveChunkMode: 'sequential'
      }
    }
    return option
  }

  /**
   * 添加数据加载动画
   */
  static addLoadingAnimation(chartInstance) {
    chartInstance.showLoading('default', {
      text: '数据加载中...',
      color: '#409EFF',
      textColor: '#606266',
      maskColor: 'rgba(255, 255, 255, 0.8)',
      zlevel: 0
    })

    return () => chartInstance.hideLoading()
  }
}

/**
 * 🎨 响应式图表工具
 */
export class ResponsiveChartHelper {
  /**
   * 根据容器宽度调整配置
   */
  static adaptToWidth(option, width) {
    const isMobile = width < 768
    const isTablet = width >= 768 && width < 1024

    return {
      ...option,
      title: {
        ...option.title,
        textStyle: {
          fontSize: isMobile ? 14 : isTablet ? 16 : 18
        }
      },
      legend: option.legend ? {
        ...option.legend,
        orient: isMobile ? 'horizontal' : 'horizontal',
        textStyle: {
          fontSize: isMobile ? 11 : 13
        }
      } : undefined,
      grid: {
        ...option.grid,
        left: isMobile ? '15%' : '3%',
        right: isMobile ? '5%' : '4%',
        bottom: isMobile ? '20%' : '10%'
      }
    }
  }

  /**
   * 自动调整图表大小
   */
  static setupAutoResize(chartInstance) {
    const resizeObserver = new ResizeObserver(() => {
      chartInstance.resize()
    })

    const container = chartInstance.getDom()
    if (container) {
      resizeObserver.observe(container)
    }

    return () => resizeObserver.disconnect()
  }
}

// 注册自定义主题
echarts.registerTheme('custom', customTheme)

export default {
  customTheme,
  ChartConfigGenerator,
  ChartPerformanceOptimizer,
  ResponsiveChartHelper
}
