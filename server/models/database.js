/**
 * ToolsNet 8 数据库模型
 * 
 * 支持的数据库:
 * - Microsoft SQL Server (推荐)
 * - Oracle Database
 * 
 * 数据库架构基于Atlas Copco ToolsNet 8标准
 */

/**
 * 拧紧结果表 (TighteningResults)
 * 
 * 存储来自Data Collection Service的拧紧结果
 */
export const TighteningResultsSchema = {
  tableName: 'TighteningResults',
  columns: {
    // 主键
    ResultId: { type: 'BIGINT', primaryKey: true, autoIncrement: true },
    
    // 标识信息
    ConnectionId: { type: 'VARCHAR(100)', nullable: false },
    UnitName: { type: 'VARCHAR(100)', nullable: false },
    CellId: { type: 'VARCHAR(50)', nullable: true },
    ChannelId: { type: 'VARCHAR(50)', nullable: true },
    
    // 产品信息
    VinNumber: { type: 'VARCHAR(50)', nullable: true, index: true },
    Identifier: { type: 'VARCHAR(100)', nullable: true, index: true },
    
    // 程序信息
    JobId: { type: 'INT', nullable: false, index: true },
    PsetId: { type: 'INT', nullable: false, index: true },
    ProgramName: { type: 'VARCHAR(200)', nullable: true },
    ProgramId: { type: 'INT', nullable: true },
    
    // 批次信息
    BatchId: { type: 'VARCHAR(100)', nullable: true, index: true },
    BatchSize: { type: 'INT', nullable: true },
    BatchCount: { type: 'INT', nullable: true },
    BatchStatus: { type: 'VARCHAR(20)', nullable: true },
    
    // 螺栓信息 (PowerMACS)
    BoltNumber: { type: 'INT', nullable: true },
    BoltName: { type: 'VARCHAR(100)', nullable: true },
    
    // 拧紧结果
    TighteningStatus: { type: 'VARCHAR(20)', nullable: false, index: true }, // OK, NOK, OK_REPAIRED
    Torque: { type: 'DECIMAL(10,3)', nullable: false },
    Angle: { type: 'DECIMAL(10,2)', nullable: false },
    TargetTorque: { type: 'DECIMAL(10,3)', nullable: false },
    TargetAngle: { type: 'DECIMAL(10,2)', nullable: false },
    
    // 限值
    TorqueLowerLimit: { type: 'DECIMAL(10,3)', nullable: true },
    TorqueUpperLimit: { type: 'DECIMAL(10,3)', nullable: true },
    AngleLowerLimit: { type: 'DECIMAL(10,2)', nullable: true },
    AngleUpperLimit: { type: 'DECIMAL(10,2)', nullable: true },
    
    // 状态
    TorqueStatus: { type: 'VARCHAR(10)', nullable: true }, // OK, LOW, HIGH
    AngleStatus: { type: 'VARCHAR(10)', nullable: true },
    RundownAngleStatus: { type: 'VARCHAR(10)', nullable: true },
    
    // 下降角度 (Rundown Angle)
    RundownAngle: { type: 'DECIMAL(10,2)', nullable: true },
    
    // 时间信息
    TighteningTime: { type: 'DECIMAL(10,3)', nullable: true }, // 拧紧耗时(秒)
    ResultTime: { type: 'DATETIME', nullable: false },
    LastChangeTime: { type: 'DATETIME', nullable: true },
    Timestamp: { type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP', index: true },
    
    // NOK原因
    NokReason: { type: 'VARCHAR(500)', nullable: true },
    DetailedStatus: { type: 'VARCHAR(500)', nullable: true },
    
    // 扩展字段
    CustomData1: { type: 'VARCHAR(200)', nullable: true },
    CustomData2: { type: 'VARCHAR(200)', nullable: true },
    CustomData3: { type: 'VARCHAR(200)', nullable: true }
  },
  indexes: [
    { name: 'idx_timestamp', columns: ['Timestamp'] },
    { name: 'idx_result_status', columns: ['TighteningStatus', 'Timestamp'] },
    { name: 'idx_vin_timestamp', columns: ['VinNumber', 'Timestamp'] },
    { name: 'idx_pset_timestamp', columns: ['PsetId', 'Timestamp'] }
  ]
}

/**
 * 拧紧曲线表 (TighteningCurves)
 * 
 * 存储拧紧过程曲线数据 (Trace Data)
 */
export const TighteningCurvesSchema = {
  tableName: 'TighteningCurves',
  columns: {
    CurveId: { type: 'BIGINT', primaryKey: true, autoIncrement: true },
    ResultId: { type: 'BIGINT', nullable: false, foreignKey: 'TighteningResults.ResultId' },
    ConnectionId: { type: 'VARCHAR(100)', nullable: false },
    
    // 曲线数据 (JSON或BLOB格式)
    TorqueCurve: { type: 'TEXT', nullable: true }, // JSON数组: [{angle: 0, torque: 0}, ...]
    AngleCurve: { type: 'TEXT', nullable: true },
    TimeCurve: { type: 'TEXT', nullable: true },
    
    // 原始Trace数据 (Open Protocol MID 0110)
    RawTraceData: { type: 'TEXT', nullable: true },
    
    // 采样信息
    SampleRate: { type: 'INT', nullable: true }, // Hz
    SampleCount: { type: 'INT', nullable: true },
    
    Timestamp: { type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' }
  },
  indexes: [
    { name: 'idx_result_id', columns: ['ResultId'] }
  ]
}

/**
 * 控制器事件表 (ControllerEvents)
 */
export const ControllerEventsSchema = {
  tableName: 'ControllerEvents',
  columns: {
    EventId: { type: 'BIGINT', primaryKey: true, autoIncrement: true },
    ConnectionId: { type: 'VARCHAR(100)', nullable: false },
    UnitName: { type: 'VARCHAR(100)', nullable: false },
    
    // 事件信息
    EventLevel: { type: 'VARCHAR(20)', nullable: false, index: true }, // info, warning, error, critical
    EventType: { type: 'VARCHAR(50)', nullable: false },
    EventCode: { type: 'VARCHAR(50)', nullable: false },
    EventDescription: { type: 'VARCHAR(500)', nullable: false },
    
    // 关联信息
    ResultId: { type: 'BIGINT', nullable: true, foreignKey: 'TighteningResults.ResultId' },
    PsetId: { type: 'INT', nullable: true },
    
    // 确认状态
    Acknowledged: { type: 'BIT', nullable: false, default: 0 },
    AcknowledgedBy: { type: 'VARCHAR(100)', nullable: true },
    AcknowledgedTime: { type: 'DATETIME', nullable: true },
    
    Timestamp: { type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP', index: true }
  },
  indexes: [
    { name: 'idx_event_level_timestamp', columns: ['EventLevel', 'Timestamp'] },
    { name: 'idx_unit_timestamp', columns: ['UnitName', 'Timestamp'] }
  ]
}

/**
 * 程序版本表 (ProgramVersions)
 */
export const ProgramVersionsSchema = {
  tableName: 'ProgramVersions',
  columns: {
    VersionId: { type: 'BIGINT', primaryKey: true, autoIncrement: true },
    PsetId: { type: 'INT', nullable: false, index: true },
    ProgramName: { type: 'VARCHAR(200)', nullable: false },
    
    // 版本信息
    VersionNumber: { type: 'VARCHAR(50)', nullable: false },
    VersionDate: { type: 'DATETIME', nullable: false },
    
    // 参数设置
    TargetTorque: { type: 'DECIMAL(10,3)', nullable: false },
    TargetAngle: { type: 'DECIMAL(10,2)', nullable: false },
    TorqueLowerLimit: { type: 'DECIMAL(10,3)', nullable: false },
    TorqueUpperLimit: { type: 'DECIMAL(10,3)', nullable: false },
    AngleLowerLimit: { type: 'DECIMAL(10,2)', nullable: false },
    AngleUpperLimit: { type: 'DECIMAL(10,2)', nullable: false },
    
    // 策略
    Strategy: { type: 'VARCHAR(50)', nullable: true },
    
    // 变更信息
    ChangedBy: { type: 'VARCHAR(100)', nullable: true },
    ChangeReason: { type: 'VARCHAR(500)', nullable: true },
    
    Timestamp: { type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' }
  }
}

/**
 * 工具信息表 (Tools)
 */
export const ToolsSchema = {
  tableName: 'Tools',
  columns: {
    ToolId: { type: 'BIGINT', primaryKey: true, autoIncrement: true },
    ToolSerialNumber: { type: 'VARCHAR(100)', nullable: false, unique: true },
    ToolName: { type: 'VARCHAR(200)', nullable: false },
    ToolType: { type: 'VARCHAR(100)', nullable: false },
    
    // 制造信息
    Manufacturer: { type: 'VARCHAR(100)', nullable: true },
    Model: { type: 'VARCHAR(100)', nullable: true },
    ManufactureDate: { type: 'DATE', nullable: true },
    
    // 校准信息
    LastCalibrationDate: { type: 'DATE', nullable: true },
    NextCalibrationDate: { type: 'DATE', nullable: true },
    CalibrationInterval: { type: 'INT', nullable: true }, // 天数
    
    // 维护信息
    TotalTightenings: { type: 'BIGINT', nullable: false, default: 0 },
    LastServiceDate: { type: 'DATE', nullable: true },
    NextServiceDate: { type: 'DATE', nullable: true },
    
    // 状态
    Status: { type: 'VARCHAR(50)', nullable: false, default: 'Active' }, // Active, Maintenance, Retired
    
    Timestamp: { type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' }
  }
}

/**
 * 工具统计表 (ToolStatistics)
 */
export const ToolStatisticsSchema = {
  tableName: 'ToolStatistics',
  columns: {
    StatId: { type: 'BIGINT', primaryKey: true, autoIncrement: true },
    ToolId: { type: 'BIGINT', nullable: false, foreignKey: 'Tools.ToolId' },
    
    // 统计日期
    StatDate: { type: 'DATE', nullable: false, index: true },
    
    // 使用统计
    TotalTightenings: { type: 'INT', nullable: false },
    OkCount: { type: 'INT', nullable: false },
    NokCount: { type: 'INT', nullable: false },
    
    // 扭矩统计
    AvgTorque: { type: 'DECIMAL(10,3)', nullable: true },
    MinTorque: { type: 'DECIMAL(10,3)', nullable: true },
    MaxTorque: { type: 'DECIMAL(10,3)', nullable: true },
    
    // 运行时间
    TotalRunTime: { type: 'DECIMAL(10,2)', nullable: true }, // 小时
    
    Timestamp: { type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' }
  },
  indexes: [
    { name: 'idx_tool_date', columns: ['ToolId', 'StatDate'] }
  ]
}

/**
 * 工厂结构表 (PlantStructure)
 */
export const PlantStructureSchema = {
  tableName: 'PlantStructure',
  columns: {
    NodeId: { type: 'VARCHAR(100)', primaryKey: true },
    NodeName: { type: 'VARCHAR(200)', nullable: false },
    NodeType: { type: 'VARCHAR(50)', nullable: false }, // plant, line, station
    
    // 层级关系
    ParentNodeId: { type: 'VARCHAR(100)', nullable: true },
    NodeLevel: { type: 'INT', nullable: false },
    NodePath: { type: 'VARCHAR(500)', nullable: true },
    
    // 单元信息
    UnitName: { type: 'VARCHAR(100)', nullable: true },
    UnitType: { type: 'VARCHAR(50)', nullable: true },
    
    // 状态
    Status: { type: 'VARCHAR(50)', nullable: false, default: 'Active' },
    
    Timestamp: { type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' }
  }
}

/**
 * SQL Server 数据库创建脚本
 */
export const generateSqlServerScript = () => {
  return `
-- ToolsNet 8 数据库创建脚本 (SQL Server)
-- 版本: 2.0.0
-- 日期: ${new Date().toISOString()}

USE master;
GO

-- 创建数据库
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ToolsNet8')
BEGIN
    CREATE DATABASE ToolsNet8;
END
GO

USE ToolsNet8;
GO

-- 1. 拧紧结果表
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TighteningResults')
BEGIN
    CREATE TABLE TighteningResults (
        ResultId BIGINT IDENTITY(1,1) PRIMARY KEY,
        ConnectionId VARCHAR(100) NOT NULL,
        UnitName VARCHAR(100) NOT NULL,
        CellId VARCHAR(50),
        ChannelId VARCHAR(50),
        VinNumber VARCHAR(50),
        Identifier VARCHAR(100),
        JobId INT NOT NULL,
        PsetId INT NOT NULL,
        ProgramName VARCHAR(200),
        ProgramId INT,
        BatchId VARCHAR(100),
        BatchSize INT,
        BatchCount INT,
        BatchStatus VARCHAR(20),
        BoltNumber INT,
        BoltName VARCHAR(100),
        TighteningStatus VARCHAR(20) NOT NULL,
        Torque DECIMAL(10,3) NOT NULL,
        Angle DECIMAL(10,2) NOT NULL,
        TargetTorque DECIMAL(10,3) NOT NULL,
        TargetAngle DECIMAL(10,2) NOT NULL,
        TorqueLowerLimit DECIMAL(10,3),
        TorqueUpperLimit DECIMAL(10,3),
        AngleLowerLimit DECIMAL(10,2),
        AngleUpperLimit DECIMAL(10,2),
        TorqueStatus VARCHAR(10),
        AngleStatus VARCHAR(10),
        RundownAngleStatus VARCHAR(10),
        RundownAngle DECIMAL(10,2),
        TighteningTime DECIMAL(10,3),
        ResultTime DATETIME NOT NULL,
        LastChangeTime DATETIME,
        Timestamp DATETIME DEFAULT GETDATE() NOT NULL,
        NokReason VARCHAR(500),
        DetailedStatus VARCHAR(500),
        CustomData1 VARCHAR(200),
        CustomData2 VARCHAR(200),
        CustomData3 VARCHAR(200),
        
        INDEX idx_timestamp (Timestamp),
        INDEX idx_result_status (TighteningStatus, Timestamp),
        INDEX idx_vin_timestamp (VinNumber, Timestamp),
        INDEX idx_pset_timestamp (PsetId, Timestamp)
    );
END
GO

-- 2. 拧紧曲线表
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TighteningCurves')
BEGIN
    CREATE TABLE TighteningCurves (
        CurveId BIGINT IDENTITY(1,1) PRIMARY KEY,
        ResultId BIGINT NOT NULL,
        ConnectionId VARCHAR(100) NOT NULL,
        TorqueCurve TEXT,
        AngleCurve TEXT,
        TimeCurve TEXT,
        RawTraceData TEXT,
        SampleRate INT,
        SampleCount INT,
        Timestamp DATETIME DEFAULT GETDATE() NOT NULL,
        
        FOREIGN KEY (ResultId) REFERENCES TighteningResults(ResultId),
        INDEX idx_result_id (ResultId)
    );
END
GO

-- 3. 控制器事件表
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ControllerEvents')
BEGIN
    CREATE TABLE ControllerEvents (
        EventId BIGINT IDENTITY(1,1) PRIMARY KEY,
        ConnectionId VARCHAR(100) NOT NULL,
        UnitName VARCHAR(100) NOT NULL,
        EventLevel VARCHAR(20) NOT NULL,
        EventType VARCHAR(50) NOT NULL,
        EventCode VARCHAR(50) NOT NULL,
        EventDescription VARCHAR(500) NOT NULL,
        ResultId BIGINT,
        PsetId INT,
        Acknowledged BIT DEFAULT 0 NOT NULL,
        AcknowledgedBy VARCHAR(100),
        AcknowledgedTime DATETIME,
        Timestamp DATETIME DEFAULT GETDATE() NOT NULL,
        
        INDEX idx_event_level_timestamp (EventLevel, Timestamp),
        INDEX idx_unit_timestamp (UnitName, Timestamp)
    );
END
GO

-- 4. 程序版本表
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ProgramVersions')
BEGIN
    CREATE TABLE ProgramVersions (
        VersionId BIGINT IDENTITY(1,1) PRIMARY KEY,
        PsetId INT NOT NULL,
        ProgramName VARCHAR(200) NOT NULL,
        VersionNumber VARCHAR(50) NOT NULL,
        VersionDate DATETIME NOT NULL,
        TargetTorque DECIMAL(10,3) NOT NULL,
        TargetAngle DECIMAL(10,2) NOT NULL,
        TorqueLowerLimit DECIMAL(10,3) NOT NULL,
        TorqueUpperLimit DECIMAL(10,3) NOT NULL,
        AngleLowerLimit DECIMAL(10,2) NOT NULL,
        AngleUpperLimit DECIMAL(10,2) NOT NULL,
        Strategy VARCHAR(50),
        ChangedBy VARCHAR(100),
        ChangeReason VARCHAR(500),
        Timestamp DATETIME DEFAULT GETDATE() NOT NULL,
        
        INDEX idx_pset (PsetId)
    );
END
GO

-- 5. 工具信息表
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tools')
BEGIN
    CREATE TABLE Tools (
        ToolId BIGINT IDENTITY(1,1) PRIMARY KEY,
        ToolSerialNumber VARCHAR(100) NOT NULL UNIQUE,
        ToolName VARCHAR(200) NOT NULL,
        ToolType VARCHAR(100) NOT NULL,
        Manufacturer VARCHAR(100),
        Model VARCHAR(100),
        ManufactureDate DATE,
        LastCalibrationDate DATE,
        NextCalibrationDate DATE,
        CalibrationInterval INT,
        TotalTightenings BIGINT DEFAULT 0 NOT NULL,
        LastServiceDate DATE,
        NextServiceDate DATE,
        Status VARCHAR(50) DEFAULT 'Active' NOT NULL,
        Timestamp DATETIME DEFAULT GETDATE() NOT NULL
    );
END
GO

-- 6. 工具统计表
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ToolStatistics')
BEGIN
    CREATE TABLE ToolStatistics (
        StatId BIGINT IDENTITY(1,1) PRIMARY KEY,
        ToolId BIGINT NOT NULL,
        StatDate DATE NOT NULL,
        TotalTightenings INT NOT NULL,
        OkCount INT NOT NULL,
        NokCount INT NOT NULL,
        AvgTorque DECIMAL(10,3),
        MinTorque DECIMAL(10,3),
        MaxTorque DECIMAL(10,3),
        TotalRunTime DECIMAL(10,2),
        Timestamp DATETIME DEFAULT GETDATE() NOT NULL,
        
        FOREIGN KEY (ToolId) REFERENCES Tools(ToolId),
        INDEX idx_tool_date (ToolId, StatDate)
    );
END
GO

-- 7. 工厂结构表
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PlantStructure')
BEGIN
    CREATE TABLE PlantStructure (
        NodeId VARCHAR(100) PRIMARY KEY,
        NodeName VARCHAR(200) NOT NULL,
        NodeType VARCHAR(50) NOT NULL,
        ParentNodeId VARCHAR(100),
        NodeLevel INT NOT NULL,
        NodePath VARCHAR(500),
        UnitName VARCHAR(100),
        UnitType VARCHAR(50),
        Status VARCHAR(50) DEFAULT 'Active' NOT NULL,
        Timestamp DATETIME DEFAULT GETDATE() NOT NULL
    );
END
GO

PRINT 'ToolsNet 8 数据库创建完成！';
GO
`
}
