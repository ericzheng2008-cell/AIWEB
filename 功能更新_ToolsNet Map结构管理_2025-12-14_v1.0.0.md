# 🗺️ 功能更新: ToolsNet Map 结构管理

> **版本**: v1.0.0  
> **更新日期**: 2025-12-14  
> **功能**: ToolsNet Map 逻辑结构完整实现

---

## 🎯 更新概述

根据 Atlas Copco ToolsNet 逻辑结构规范，完整实现了四层级系统结构管理（System → Station → Spindle → Program），提供可视化Map编辑器和自动结构构建功能。

---

## 📐 ToolsNet 逻辑结构

### 层级关系

```
System (系统)
  └── Station (工位)
        └── Spindle (主轴)
              └── Program (程序)
```

### 编号规则

| 层级 | 编号规则 | 说明 |
|------|---------|------|
| **System** | 全局唯一 | 每个System必须有唯一的System Number |
| **Station** | System内唯一 | 在同一System内，每个Station Number唯一 |
| **Spindle** | Station内唯一 | 在同一Station内，每个Spindle Number唯一 |
| **Program** | Spindle内唯一 | 在同一Spindle内，每个Program Number唯一 |

### 命名规则

#### 默认命名（基于编号）
- **System 1**: System Number = 1
- **Station 4**: Station Number = 4  
- **Spindle 2**: Spindle Number = 2
- **Program 5**: Program Number = 5

#### 自定义命名
可以通过以下方式修改名称：
1. ToolsNet Map Editor（手动编辑）
2. Description Telegrams（控制器发送）

---

## ✨ 新增功能

### 1️⃣ ToolsNet Map 管理服务 (后端)

#### 核心类: `ToolsNetMapService`

```javascript
class ToolsNetMapService {
  // 初始化默认Map结构
  initializeDefaultMap()
  
  // 获取完整Map
  getFullMap()
  
  // 层级查询
  getSystem(systemNumber)
  getStation(systemNumber, stationNumber)
  getSpindle(systemNumber, stationNumber, spindleNumber)
  getProgram(systemNumber, stationNumber, spindleNumber, programNumber)
  
  // 层级添加
  addSystem(systemData)
  addStation(systemNumber, stationData)
  addSpindle(systemNumber, stationNumber, spindleData)
  addProgram(systemNumber, stationNumber, spindleNumber, programData)
  
  // 层级更新
  updateSystem(systemNumber, updateData)
  updateStation(systemNumber, stationNumber, updateData)
  updateSpindle(systemNumber, stationNumber, spindleNumber, updateData)
  updateProgram(systemNumber, stationNumber, spindleNumber, programNumber, updateData)
  
  // 自动构建
  buildMapFromResult(resultData)
  
  // 统计方法
  countStations()
  countSpindles()
  countPrograms()
  
  // 路径获取
  getHierarchyPath(systemNumber, stationNumber, spindleNumber, programNumber)
}
```

---

### 2️⃣ API 接口

#### 查询接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/tightening/map` | GET | 获取完整Map结构 |
| `/api/tightening/map/system/:systemNumber` | GET | 获取指定系统 |
| `/api/tightening/map/hierarchy` | GET | 获取层级路径 |

**示例请求**: 获取完整Map
```http
GET /api/tightening/map
```

**示例响应**:
```json
{
  "success": true,
  "data": {
    "systems": [
      {
        "systemNumber": 1,
        "systemName": "System 1",
        "description": "Production Line A",
        "controllerType": "PowerFocus 4000",
        "ipAddress": "192.168.1.100",
        "stations": [
          {
            "stationNumber": 1,
            "stationName": "Station 1",
            "description": "Engine Assembly",
            "spindles": [
              {
                "spindleNumber": 1,
                "spindleName": "Spindle 1",
                "description": "Main Spindle",
                "serialNumber": "SN-PF4000-001",
                "programs": [
                  {
                    "programNumber": 1,
                    "programName": "Program 1",
                    "description": "Cylinder Head Bolts",
                    "targetTorque": 35,
                    "targetAngle": 180,
                    "minTorque": 32,
                    "maxTorque": 38,
                    "minAngle": 170,
                    "maxAngle": 190,
                    "lastModified": "2025-12-14T08:00:00.000Z"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    "summary": {
      "totalSystems": 2,
      "totalStations": 3,
      "totalSpindles": 4,
      "totalPrograms": 5
    }
  }
}
```

#### 添加接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/tightening/map/system` | POST | 添加系统 |
| `/api/tightening/map/station` | POST | 添加工位 |
| `/api/tightening/map/spindle` | POST | 添加主轴 |
| `/api/tightening/map/program` | POST | 添加程序 |

**示例请求**: 添加系统
```http
POST /api/tightening/map/system
Content-Type: application/json

{
  "systemNumber": 3,
  "systemName": "System 3",
  "description": "Production Line C",
  "controllerType": "PowerFocus 6000",
  "ipAddress": "192.168.1.102"
}
```

**示例请求**: 添加程序
```http
POST /api/tightening/map/program
Content-Type: application/json

{
  "systemNumber": 1,
  "stationNumber": 1,
  "spindleNumber": 1,
  "programNumber": 3,
  "programName": "Program 3",
  "description": "New Bolt Pattern",
  "targetTorque": 40,
  "targetAngle": 200,
  "minTorque": 38,
  "maxTorque": 42,
  "minAngle": 190,
  "maxAngle": 210
}
```

#### 更新接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/tightening/map/system/:systemNumber` | PUT | 更新系统信息 |
| `/api/tightening/map/program` | PUT | 更新程序信息 |

#### 自动构建接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/tightening/map/build-from-result` | POST | 从Result电报自动构建 |

**说明**: 
- 当收到Result telegram时，系统会自动提取System Number、Station Number、Spindle Number、Program Number
- 如果对应的层级不存在，自动创建（使用默认名称）
- 适用于非Atlas Copco控制器

**示例请求**:
```http
POST /api/tightening/map/build-from-result
Content-Type: application/json

{
  "systemNumber": 2,
  "stationNumber": 3,
  "spindleNumber": 1,
  "programNumber": 2,
  "targetTorque": 50,
  "targetAngle": 150
}
```

**示例响应**:
```json
{
  "success": true,
  "message": "Map structure ensured",
  "path": "System 2 → Station 3 → Spindle 1 → Program 2"
}
```

---

### 3️⃣ 可视化 Map 编辑器 (前端)

#### 组件: `ToolsNetMapViewer.vue`

##### 功能特性

**1. 树形结构展示**
- 四层级树形显示
- 层级图标和颜色区分
- 展开/折叠控制
- 节点信息标签

**2. 统计概览面板**
- 系统总数
- 工位总数
- 主轴总数
- 程序总数

**3. 节点操作**
- 查看详情
- 编辑信息
- 添加子节点
- 删除节点（计划中）

**4. 详情对话框**
- 显示完整信息
- 层级路径展示
- 特定字段展示（根据类型）

**5. 编辑/添加对话框**
- 动态表单（根据类型）
- 数据验证
- 实时保存

---

## 🖥️ 使用界面

### 访问路径

1. 登录系统
2. 进入「拧紧数据采集」页面
3. 切换到「**ToolsNet Map**」标签页

### 界面布局

```
┌─────────────────────────────────────────────────────┐
│  ToolsNet Map 结构                   [刷新] [添加系统] │
├─────────────────────────────────────────────────────┤
│  系统数量: 2   工位数量: 3   主轴数量: 4   程序数量: 5  │
├─────────────────────────────────────────────────────┤
│  ▼ 📘 System 1 (系统 1)         [PowerFocus 4000]   │
│    ▼ 📗 Station 1 (工位 1)              [编辑][添加]│
│       ▼ 🔧 Spindle 1 (主轴 1)           [编辑][添加]│
│          📄 Program 1 (程序 1)  35Nm/180° [编辑][详情]│
│          📄 Program 2 (程序 2)  25Nm/90°  [编辑][详情]│
│       ▼ 🔧 Spindle 2 (主轴 2)           [编辑][添加]│
│          📄 Program 1 (程序 1)  45Nm/120° [编辑][详情]│
│    ▼ 📗 Station 2 (工位 2)              [编辑][添加]│
│       ▼ 🔧 Spindle 1 (主轴 1)           [编辑][添加]│
│          📄 Program 1 (程序 1)  60Nm/240° [编辑][详情]│
│  ▼ 📘 System 2 (系统 2)         [PowerFocus 6000]   │
│    ▼ 📗 Station 1 (工位 1)              [编辑][添加]│
│       ▼ 🔧 Spindle 1 (主轴 1)           [编辑][添加]│
│          📄 Program 1 (程序 1)  120Nm/360° [编辑][详情]│
└─────────────────────────────────────────────────────┘
```

---

## 📊 数据结构

### System（系统）

```typescript
interface System {
  systemNumber: number        // 系统编号（全局唯一）
  systemName: string          // 系统名称
  description: string         // 描述
  controllerType: string      // 控制器类型
  ipAddress: string          // IP地址
  stations: Station[]        // 工位数组
}
```

### Station（工位）

```typescript
interface Station {
  stationNumber: number      // 工位编号（系统内唯一）
  stationName: string        // 工位名称
  description: string        // 描述
  spindles: Spindle[]       // 主轴数组
}
```

### Spindle（主轴）

```typescript
interface Spindle {
  spindleNumber: number      // 主轴编号（工位内唯一）
  spindleName: string        // 主轴名称
  description: string        // 描述
  serialNumber: string       // 序列号
  programs: Program[]        // 程序数组
}
```

### Program（程序）

```typescript
interface Program {
  programNumber: number      // 程序编号（主轴内唯一）
  programName: string        // 程序名称
  description: string        // 描述
  targetTorque: number       // 目标扭矩 (Nm)
  targetAngle: number        // 目标角度 (°)
  minTorque: number          // 最小扭矩 (Nm)
  maxTorque: number          // 最大扭矩 (Nm)
  minAngle: number           // 最小角度 (°)
  maxAngle: number           // 最大角度 (°)
  lastModified: string       // 最后修改时间
}
```

---

## 🎯 使用场景

### 场景 1: 初始化生产线结构

**需求**: 设置新的生产线拧紧系统

**步骤**:
1. 添加System（生产线）
2. 添加Stations（各工位）
3. 添加Spindles（各主轴工具）
4. 添加Programs（拧紧程序）

### 场景 2: 从Result自动构建

**需求**: 非Atlas Copco控制器，通过Result telegram自动建立结构

**实现**:
```javascript
// Result telegram包含:
// System Number: 3
// Station Number: 2
// Spindle Number: 1
// Program Number: 5

// 系统自动检查并创建:
// → System 3 (如不存在)
// → Station 2 (如不存在)
// → Spindle 1 (如不存在)
// → Program 5 (如不存在)
```

### 场景 3: 手动编辑Map结构

**需求**: 修改系统、工位、主轴或程序的名称和参数

**步骤**:
1. 在ToolsNet Map界面找到对应节点
2. 点击「编辑」按钮
3. 修改信息
4. 保存

### 场景 4: 查看层级路径

**需求**: 快速了解某个程序所属的完整层级结构

**使用**:
```http
GET /api/tightening/map/hierarchy?systemNumber=1&stationNumber=2&spindleNumber=1&programNumber=3
```

**响应**:
```json
{
  "success": true,
  "data": {
    "system": { "systemNumber": 1, "systemName": "System 1", ... },
    "station": { "stationNumber": 2, "stationName": "Station 2", ... },
    "spindle": { "spindleNumber": 1, "spindleName": "Spindle 1", ... },
    "program": { "programNumber": 3, "programName": "Program 3", ... },
    "path": "System 1 → Station 2 → Spindle 1 → Program 3"
  }
}
```

---

## 🔧 技术实现

### 后端技术

- **语言**: Node.js / JavaScript
- **框架**: Express
- **存储**: 内存存储（可扩展至SQL Server/Oracle）
- **数据结构**: 嵌套对象数组

### 前端技术

- **框架**: Vue 3 (Composition API)
- **UI库**: Element Plus
- **组件**: Tree、Dialog、Form、Statistic
- **样式**: Scoped CSS

### 数据流

```
Result Telegram
      ↓
buildMapFromResult()
      ↓
检查/创建层级
      ↓
dataStore.toolsNetMap
      ↓
API响应
      ↓
前端Tree组件
```

---

## 📝 最佳实践

### 1. 编号规划

**建议编号规则**:
```
System Number:  1-99  (生产线)
Station Number: 1-20  (工位)
Spindle Number: 1-10  (主轴)
Program Number: 1-50  (程序)
```

### 2. 命名规范

**推荐命名格式**:
```
System:  "产线A - PowerFocus 4000"
Station: "发动机装配工位"
Spindle: "主轴 - 高扭矩"
Program: "缸盖螺栓拧紧"
```

### 3. 描述信息

**建议包含**:
- 功能说明
- 使用场景
- 特殊要求
- 维护记录

---

## 🎓 扩展功能（计划中）

### 短期功能

1. **节点删除** ⏳
   - 支持删除System/Station/Spindle/Program
   - 级联删除子节点
   - 删除确认对话框

2. **批量操作** ⏳
   - 批量添加节点
   - 批量修改参数
   - CSV导入/导出

3. **搜索功能** ⏳
   - 按名称搜索
   - 按编号搜索
   - 高级筛选

### 中期功能

4. **Map可视化** ⏳
   - 图形化展示
   - 拖拽排序
   - 缩放查看

5. **历史版本** ⏳
   - Map变更记录
   - 版本对比
   - 回滚功能

6. **导入导出** ⏳
   - JSON格式导出
   - XML格式导入
   - 模板功能

---

## 📚 相关文档

- [功能文档_拧紧数据采集系统_ToolsNet8架构_2025-12-14_v3.0.0.md](./功能文档_拧紧数据采集系统_ToolsNet8架构_2025-12-14_v3.0.0.md)
- [ToolsNet 8 Manual - Chapter 16: ToolsNet Structure]()
- [Open Protocol Specification]()

---

## ✅ 完成清单

- [x] 后端ToolsNetMapService类
- [x] 完整API接口（10个）
- [x] 前端ToolsNetMapViewer组件
- [x] 树形结构展示
- [x] 节点CRUD操作
- [x] 详情查看
- [x] 编辑/添加对话框
- [x] 自动构建功能
- [x] 统计概览
- [x] 文档编写

---

**版本历史**:
- v1.0.0 (2025-12-14): 初始版本 - ToolsNet Map完整实现

**作者**: AI 智能助手  
**更新时间**: 2025-12-14
