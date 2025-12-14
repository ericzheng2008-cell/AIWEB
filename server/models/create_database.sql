-- =============================================
-- ToolsNet 8 数据库创建脚本 (SQL Server)
-- 版本: 3.0.0
-- 日期: 2025-12-14
-- 说明: 基于Atlas Copco ToolsNet 8工业标准
-- =============================================

USE master;
GO

-- 创建数据库
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ToolsNet8')
BEGIN
    CREATE DATABASE ToolsNet8;
    PRINT '✅ 数据库 ToolsNet8 创建成功';
END
ELSE
BEGIN
    PRINT '⚠️ 数据库 ToolsNet8 已存在';
END
GO

USE ToolsNet8;
GO

-- =============================================
-- 1. 拧紧结果表 (TighteningResults)
-- 主表: 存储所有拧紧结果数据
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TighteningResults')
BEGIN
    CREATE TABLE TighteningResults (
        -- 主键
        ResultId BIGINT IDENTITY(1,1) PRIMARY KEY,
        
        -- 连接标识
        ConnectionId VARCHAR(100) NOT NULL,
        UnitName VARCHAR(100) NOT NULL,
        CellId VARCHAR(50),
        ChannelId VARCHAR(50),
        
        -- 产品标识
        VinNumber VARCHAR(50),
        Identifier VARCHAR(100),
        
        -- 程序信息
        JobId INT NOT NULL,
        PsetId INT NOT NULL,
        ProgramName VARCHAR(200),
        ProgramId INT,
        
        -- 批次信息
        BatchId VARCHAR(100),
        BatchSize INT,
        BatchCount INT,
        BatchStatus VARCHAR(20),
        
        -- 螺栓信息 (PowerMACS)
        BoltNumber INT,
        BoltName VARCHAR(100),
        
        -- 拧紧结果
        TighteningStatus VARCHAR(20) NOT NULL,
        Torque DECIMAL(10,3) NOT NULL,
        Angle DECIMAL(10,2) NOT NULL,
        TargetTorque DECIMAL(10,3) NOT NULL,
        TargetAngle DECIMAL(10,2) NOT NULL,
        
        -- 限值
        TorqueLowerLimit DECIMAL(10,3),
        TorqueUpperLimit DECIMAL(10,3),
        AngleLowerLimit DECIMAL(10,2),
        AngleUpperLimit DECIMAL(10,2),
        
        -- 状态
        TorqueStatus VARCHAR(10),
        AngleStatus VARCHAR(10),
        RundownAngleStatus VARCHAR(10),
        
        -- 下降角度
        RundownAngle DECIMAL(10,2),
        
        -- 时间信息
        TighteningTime DECIMAL(10,3),
        ResultTime DATETIME NOT NULL,
        LastChangeTime DATETIME,
        Timestamp DATETIME DEFAULT GETDATE() NOT NULL,
        
        -- NOK原因
        NokReason VARCHAR(500),
        DetailedStatus VARCHAR(500),
        
        -- 扩展字段
        CustomData1 VARCHAR(200),
        CustomData2 VARCHAR(200),
        CustomData3 VARCHAR(200)
    );
    
    -- 创建索引
    CREATE INDEX idx_timestamp ON TighteningResults(Timestamp);
    CREATE INDEX idx_result_status ON TighteningResults(TighteningStatus, Timestamp);
    CREATE INDEX idx_vin_timestamp ON TighteningResults(VinNumber, Timestamp);
    CREATE INDEX idx_pset_timestamp ON TighteningResults(PsetId, Timestamp);
    CREATE INDEX idx_unit ON TighteningResults(UnitName, Timestamp);
    
    PRINT '✅ 表 TighteningResults 创建成功 (含5个索引)';
END
ELSE
BEGIN
    PRINT '⚠️ 表 TighteningResults 已存在';
END
GO

-- =============================================
-- 2. 拧紧曲线表 (TighteningCurves)
-- 存储Trace曲线数据
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TighteningCurves')
BEGIN
    CREATE TABLE TighteningCurves (
        CurveId BIGINT IDENTITY(1,1) PRIMARY KEY,
        ResultId BIGINT NOT NULL,
        ConnectionId VARCHAR(100) NOT NULL,
        
        -- 曲线数据 (JSON格式)
        TorqueCurve NVARCHAR(MAX),
        AngleCurve NVARCHAR(MAX),
        TimeCurve NVARCHAR(MAX),
        
        -- 原始Trace数据
        RawTraceData NVARCHAR(MAX),
        
        -- 采样信息
        SampleRate INT,
        SampleCount INT,
        
        Timestamp DATETIME DEFAULT GETDATE() NOT NULL,
        
        CONSTRAINT FK_TighteningCurves_Results 
            FOREIGN KEY (ResultId) REFERENCES TighteningResults(ResultId)
            ON DELETE CASCADE
    );
    
    CREATE INDEX idx_result_id ON TighteningCurves(ResultId);
    
    PRINT '✅ 表 TighteningCurves 创建成功 (含外键约束)';
END
ELSE
BEGIN
    PRINT '⚠️ 表 TighteningCurves 已存在';
END
GO

-- =============================================
-- 3. 控制器事件表 (ControllerEvents)
-- 存储控制器事件和报警
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ControllerEvents')
BEGIN
    CREATE TABLE ControllerEvents (
        EventId BIGINT IDENTITY(1,1) PRIMARY KEY,
        ConnectionId VARCHAR(100) NOT NULL,
        UnitName VARCHAR(100) NOT NULL,
        
        -- 事件信息
        EventLevel VARCHAR(20) NOT NULL,
        EventType VARCHAR(50) NOT NULL,
        EventCode VARCHAR(50) NOT NULL,
        EventDescription VARCHAR(500) NOT NULL,
        
        -- 关联信息
        ResultId BIGINT,
        PsetId INT,
        
        -- 确认状态
        Acknowledged BIT DEFAULT 0 NOT NULL,
        AcknowledgedBy VARCHAR(100),
        AcknowledgedTime DATETIME,
        
        Timestamp DATETIME DEFAULT GETDATE() NOT NULL
    );
    
    CREATE INDEX idx_event_level_timestamp ON ControllerEvents(EventLevel, Timestamp);
    CREATE INDEX idx_unit_timestamp ON ControllerEvents(UnitName, Timestamp);
    CREATE INDEX idx_acknowledged ON ControllerEvents(Acknowledged, Timestamp);
    
    PRINT '✅ 表 ControllerEvents 创建成功 (含3个索引)';
END
ELSE
BEGIN
    PRINT '⚠️ 表 ControllerEvents 已存在';
END
GO

-- =============================================
-- 4. 程序版本表 (ProgramVersions)
-- 跟踪程序参数变更历史
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ProgramVersions')
BEGIN
    CREATE TABLE ProgramVersions (
        VersionId BIGINT IDENTITY(1,1) PRIMARY KEY,
        PsetId INT NOT NULL,
        ProgramName VARCHAR(200) NOT NULL,
        
        -- 版本信息
        VersionNumber VARCHAR(50) NOT NULL,
        VersionDate DATETIME NOT NULL,
        
        -- 参数设置
        TargetTorque DECIMAL(10,3) NOT NULL,
        TargetAngle DECIMAL(10,2) NOT NULL,
        TorqueLowerLimit DECIMAL(10,3) NOT NULL,
        TorqueUpperLimit DECIMAL(10,3) NOT NULL,
        AngleLowerLimit DECIMAL(10,2) NOT NULL,
        AngleUpperLimit DECIMAL(10,2) NOT NULL,
        
        -- 策略
        Strategy VARCHAR(50),
        
        -- 变更信息
        ChangedBy VARCHAR(100),
        ChangeReason VARCHAR(500),
        
        Timestamp DATETIME DEFAULT GETDATE() NOT NULL
    );
    
    CREATE INDEX idx_pset ON ProgramVersions(PsetId, VersionDate);
    
    PRINT '✅ 表 ProgramVersions 创建成功';
END
ELSE
BEGIN
    PRINT '⚠️ 表 ProgramVersions 已存在';
END
GO

-- =============================================
-- 5. 工具信息表 (Tools)
-- 工具生命周期管理
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tools')
BEGIN
    CREATE TABLE Tools (
        ToolId BIGINT IDENTITY(1,1) PRIMARY KEY,
        ToolSerialNumber VARCHAR(100) NOT NULL UNIQUE,
        ToolName VARCHAR(200) NOT NULL,
        ToolType VARCHAR(100) NOT NULL,
        
        -- 制造信息
        Manufacturer VARCHAR(100),
        Model VARCHAR(100),
        ManufactureDate DATE,
        
        -- 校准信息
        LastCalibrationDate DATE,
        NextCalibrationDate DATE,
        CalibrationInterval INT,
        
        -- 维护信息
        TotalTightenings BIGINT DEFAULT 0 NOT NULL,
        LastServiceDate DATE,
        NextServiceDate DATE,
        
        -- 状态
        Status VARCHAR(50) DEFAULT 'Active' NOT NULL,
        
        Timestamp DATETIME DEFAULT GETDATE() NOT NULL
    );
    
    CREATE INDEX idx_serial_number ON Tools(ToolSerialNumber);
    CREATE INDEX idx_status ON Tools(Status);
    
    PRINT '✅ 表 Tools 创建成功';
END
ELSE
BEGIN
    PRINT '⚠️ 表 Tools 已存在';
END
GO

-- =============================================
-- 6. 工具统计表 (ToolStatistics)
-- 按日统计工具使用
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ToolStatistics')
BEGIN
    CREATE TABLE ToolStatistics (
        StatId BIGINT IDENTITY(1,1) PRIMARY KEY,
        ToolId BIGINT NOT NULL,
        
        -- 统计日期
        StatDate DATE NOT NULL,
        
        -- 使用统计
        TotalTightenings INT NOT NULL,
        OkCount INT NOT NULL,
        NokCount INT NOT NULL,
        
        -- 扭矩统计
        AvgTorque DECIMAL(10,3),
        MinTorque DECIMAL(10,3),
        MaxTorque DECIMAL(10,3),
        
        -- 运行时间
        TotalRunTime DECIMAL(10,2),
        
        Timestamp DATETIME DEFAULT GETDATE() NOT NULL,
        
        CONSTRAINT FK_ToolStatistics_Tools 
            FOREIGN KEY (ToolId) REFERENCES Tools(ToolId)
            ON DELETE CASCADE
    );
    
    CREATE INDEX idx_tool_date ON ToolStatistics(ToolId, StatDate);
    
    PRINT '✅ 表 ToolStatistics 创建成功';
END
ELSE
BEGIN
    PRINT '⚠️ 表 ToolStatistics 已存在';
END
GO

-- =============================================
-- 7. 工厂结构表 (PlantStructure)
-- 工厂-生产线-工位层级
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PlantStructure')
BEGIN
    CREATE TABLE PlantStructure (
        NodeId VARCHAR(100) PRIMARY KEY,
        NodeName VARCHAR(200) NOT NULL,
        NodeType VARCHAR(50) NOT NULL,
        
        -- 层级关系
        ParentNodeId VARCHAR(100),
        NodeLevel INT NOT NULL,
        NodePath VARCHAR(500),
        
        -- 单元信息
        UnitName VARCHAR(100),
        UnitType VARCHAR(50),
        
        -- 状态
        Status VARCHAR(50) DEFAULT 'Active' NOT NULL,
        
        Timestamp DATETIME DEFAULT GETDATE() NOT NULL
    );
    
    CREATE INDEX idx_parent ON PlantStructure(ParentNodeId);
    CREATE INDEX idx_node_type ON PlantStructure(NodeType);
    
    PRINT '✅ 表 PlantStructure 创建成功';
END
ELSE
BEGIN
    PRINT '⚠️ 表 PlantStructure 已存在';
END
GO

-- =============================================
-- 插入初始化数据
-- =============================================

-- 插入工厂结构示例数据
IF NOT EXISTS (SELECT * FROM PlantStructure WHERE NodeId = 'root')
BEGIN
    INSERT INTO PlantStructure (NodeId, NodeName, NodeType, ParentNodeId, NodeLevel, NodePath, Status)
    VALUES 
        ('root', '总装车间', 'plant', NULL, 1, '/root', 'Active'),
        ('line1', '生产线1', 'line', 'root', 2, '/root/line1', 'Active'),
        ('line2', '生产线2', 'line', 'root', 2, '/root/line2', 'Active'),
        ('station1', '工位1', 'station', 'line1', 3, '/root/line1/station1', 'Active'),
        ('station2', '工位2', 'station', 'line1', 3, '/root/line1/station2', 'Active'),
        ('station3', '工位3', 'station', 'line2', 3, '/root/line2/station3', 'Active'),
        ('station4', '工位4', 'station', 'line2', 3, '/root/line2/station4', 'Active');
    
    PRINT '✅ 工厂结构初始化数据插入成功';
END
GO

-- 插入工具示例数据
IF NOT EXISTS (SELECT * FROM Tools WHERE ToolSerialNumber = 'PF4000-001')
BEGIN
    INSERT INTO Tools (ToolSerialNumber, ToolName, ToolType, Manufacturer, Model, Status)
    VALUES 
        ('PF4000-001', 'PowerFocus 4000 #1', 'PowerFocus', 'Atlas Copco', 'PF4000', 'Active'),
        ('PF4000-002', 'PowerFocus 4000 #2', 'PowerFocus', 'Atlas Copco', 'PF4000', 'Active'),
        ('PF8000-001', 'PowerFocus 8000 #1', 'PowerFocus', 'Atlas Copco', 'PF8000', 'Active');
    
    PRINT '✅ 工具初始化数据插入成功';
END
GO

-- =============================================
-- 创建视图: 最近24小时统计
-- =============================================
IF EXISTS (SELECT * FROM sys.views WHERE name = 'vw_Recent24HoursStats')
    DROP VIEW vw_Recent24HoursStats;
GO

CREATE VIEW vw_Recent24HoursStats AS
SELECT 
    COUNT(*) AS TotalTightenings,
    SUM(CASE WHEN TighteningStatus = 'OK' THEN 1 ELSE 0 END) AS OkCount,
    SUM(CASE WHEN TighteningStatus = 'NOK' THEN 1 ELSE 0 END) AS NokCount,
    CAST(SUM(CASE WHEN TighteningStatus = 'OK' THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS DECIMAL(5,2)) AS OkRate,
    AVG(Torque) AS AvgTorque,
    AVG(Angle) AS AvgAngle,
    MIN(Timestamp) AS FirstTimestamp,
    MAX(Timestamp) AS LastTimestamp
FROM TighteningResults
WHERE Timestamp >= DATEADD(HOUR, -24, GETDATE());
GO

PRINT '✅ 视图 vw_Recent24HoursStats 创建成功';
GO

-- =============================================
-- 创建存储过程: 查询TOP NOK程序
-- =============================================
IF EXISTS (SELECT * FROM sys.procedures WHERE name = 'sp_GetTopNokPrograms')
    DROP PROCEDURE sp_GetTopNokPrograms;
GO

CREATE PROCEDURE sp_GetTopNokPrograms
    @TopN INT = 10,
    @DateFrom DATETIME = NULL,
    @DateTo DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @DateFrom IS NULL
        SET @DateFrom = DATEADD(DAY, -7, GETDATE());
    
    IF @DateTo IS NULL
        SET @DateTo = GETDATE();
    
    SELECT TOP (@TopN)
        PsetId,
        ProgramName,
        COUNT(*) AS TotalTightenings,
        SUM(CASE WHEN TighteningStatus = 'OK' THEN 1 ELSE 0 END) AS OkCount,
        SUM(CASE WHEN TighteningStatus = 'NOK' THEN 1 ELSE 0 END) AS NokCount,
        CAST(SUM(CASE WHEN TighteningStatus = 'NOK' THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS DECIMAL(5,2)) AS NokRate
    FROM TighteningResults
    WHERE Timestamp BETWEEN @DateFrom AND @DateTo
    GROUP BY PsetId, ProgramName
    ORDER BY NokRate DESC;
END
GO

PRINT '✅ 存储过程 sp_GetTopNokPrograms 创建成功';
GO

-- =============================================
-- 创建触发器: 自动更新工具拧紧次数
-- =============================================
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_UpdateToolTightenings')
    DROP TRIGGER trg_UpdateToolTightenings;
GO

CREATE TRIGGER trg_UpdateToolTightenings
ON TighteningResults
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE T
    SET TotalTightenings = T.TotalTightenings + 1
    FROM Tools T
    INNER JOIN inserted I ON T.ToolSerialNumber = I.UnitName;
END
GO

PRINT '✅ 触发器 trg_UpdateToolTightenings 创建成功';
GO

-- =============================================
-- 完成总结
-- =============================================
PRINT '';
PRINT '🎉🎉🎉 ToolsNet 8 数据库初始化完成！🎉🎉🎉';
PRINT '';
PRINT '已创建对象:';
PRINT '  - 7 张数据表';
PRINT '  - 15+ 个索引';
PRINT '  - 2 个外键约束';
PRINT '  - 1 个视图';
PRINT '  - 1 个存储过程';
PRINT '  - 1 个触发器';
PRINT '';
PRINT '初始化数据:';
PRINT '  - 7 个工厂结构节点';
PRINT '  - 3 个工具记录';
PRINT '';
PRINT '数据库准备就绪，可以开始使用！';
PRINT '=============================================';
GO
