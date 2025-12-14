/**
 * ToolsNet Telegram Parser
 * 
 * 完整实现 ToolsNet 电报协议标准
 * 支持所有标准电报类型 (01-13)
 * 
 * 版本: 1.0.0
 * 日期: 2025-12-14
 */

/**
 * 电报类型常量
 */
export const TELEGRAM_TYPES = {
  SYSTEM_DESCRIPTION: '01',
  STATION_DESCRIPTION: '02',
  RESULT: '04',
  ACKNOWLEDGE: '05',
  KEEP_ALIVE: '06',
  PIM_INFO_REQUEST: '07',
  PIM_INFORMATION: '08',
  ERROR_EVENT: '09',
  ERROR_EVENT_ACK: '10',
  PIM_VERIFICATION: '12',
  GRAPH: '13'
}

/**
 * ToolsNet 电报解析器类
 */
export class ToolsNetTelegramParser {
  
  /**
   * 解析通用电报格式
   * 格式: LLLL + Data
   * LLLL: 4位ASCII数字，表示后续数据长度 (0001-9999)
   */
  static parseTelegram(telegram) {
    if (!telegram || telegram.length < 4) {
      throw new Error('Invalid telegram: too short')
    }
    
    // 提取长度
    const lengthStr = telegram.substring(0, 4)
    const dataLength = parseInt(lengthStr)
    
    if (isNaN(dataLength) || dataLength < 1 || dataLength > 9999) {
      throw new Error(`Invalid telegram length: ${lengthStr}`)
    }
    
    // 提取数据部分
    const data = telegram.substring(4, 4 + dataLength)
    
    if (data.length !== dataLength) {
      throw new Error(`Telegram length mismatch: expected ${dataLength}, got ${data.length}`)
    }
    
    // 识别电报类型（前2个字节）
    const telegramId = data.substring(0, 2)
    
    return {
      length: dataLength,
      telegramId,
      data,
      rawTelegram: telegram
    }
  }
  
  /**
   * 构建通用电报格式
   */
  static buildTelegram(data) {
    const length = data.length.toString().padStart(4, '0')
    return length + data
  }
  
  /**
   * 解析结果电报 (Type 04)
   * 支持非 Atlas Copco 控制器格式
   */
  static parseResultTelegram(data) {
    try {
      let pos = 0
      
      // 基础信息
      const telegramId = data.substring(pos, pos + 2); pos += 2
      const identifier = data.substring(pos, pos + 5); pos += 5
      const generalInfoLength = parseInt(data.substring(pos, pos + 2)); pos += 2
      
      // 通用信息部分
      const systemType = data.substring(pos, pos + 4).trim(); pos += 4
      const systemNumber = data.substring(pos, pos + 4).trim(); pos += 4
      const stationNumber = data.substring(pos, pos + 4).trim(); pos += 4
      const timestamp = data.substring(pos, pos + 14); pos += 14
      const rundownSequenceNumber = data.substring(pos, pos + 5).trim(); pos += 5
      const vinNumber = data.substring(pos, pos + 25).trim(); pos += 25
      const numberOfSpindles = parseInt(data.substring(pos, pos + 4)); pos += 4
      const spindleInfoLength = parseInt(data.substring(pos, pos + 2)); pos += 2
      const numberOfAdditionalVINs = parseInt(data.substring(pos, pos + 2)); pos += 2
      const vinFieldLength = parseInt(data.substring(pos, pos + 2)); pos += 2
      const numberOfAdditionalParams = parseInt(data.substring(pos, pos + 3)); pos += 3
      const paramFieldLength = parseInt(data.substring(pos, pos + 2)); pos += 2
      
      // 解析时间戳
      const year = timestamp.substring(0, 4)
      const month = timestamp.substring(4, 6)
      const day = timestamp.substring(6, 8)
      const hour = timestamp.substring(8, 10)
      const minute = timestamp.substring(10, 12)
      const second = timestamp.substring(12, 14)
      const formattedTimestamp = `${year}-${month}-${day} ${hour}:${minute}:${second}`
      
      // Spindle信息数组
      const spindles = []
      for (let i = 0; i < numberOfSpindles; i++) {
        const spindleData = data.substring(pos, pos + spindleInfoLength)
        spindles.push(this.parseSpindleInfo(spindleData))
        pos += spindleInfoLength
      }
      
      // Additional VIN数组
      const additionalVINs = []
      for (let i = 0; i < numberOfAdditionalVINs; i++) {
        const vinData = data.substring(pos, pos + vinFieldLength)
        additionalVINs.push(this.parseAdditionalVIN(vinData))
        pos += vinFieldLength
      }
      
      // Parameter信息数组
      const parameters = []
      for (let i = 0; i < numberOfAdditionalParams; i++) {
        const paramData = data.substring(pos, pos + paramFieldLength)
        parameters.push(this.parseParameterInfo(paramData))
        pos += paramFieldLength
      }
      
      return {
        telegramId,
        identifier,
        generalInfoLength,
        systemType,
        systemNumber,
        stationNumber,
        timestamp: formattedTimestamp,
        rundownSequenceNumber,
        vinNumber,
        numberOfSpindles,
        spindleInfoLength,
        numberOfAdditionalVINs,
        vinFieldLength,
        numberOfAdditionalParams,
        paramFieldLength,
        spindles,
        additionalVINs,
        parameters,
        rawData: data
      }
    } catch (error) {
      throw new Error(`Failed to parse Result telegram: ${error.message}`)
    }
  }
  
  /**
   * 解析Spindle信息
   */
  static parseSpindleInfo(data) {
    let pos = 0
    
    const spindleNumber = data.substring(pos, pos + 4).trim(); pos += 4
    const spindleSerialNumber = data.substring(pos, pos + 10).trim(); pos += 10
    const programNumber = data.substring(pos, pos + 4).trim(); pos += 4
    const overallStatus = data.substring(pos, pos + 1); pos += 1 // 0=OK, 1=NOK
    const torqueLowLimit = parseFloat(data.substring(pos, pos + 8)); pos += 8
    const finalTorque = parseFloat(data.substring(pos, pos + 8)); pos += 8
    const torqueStatus = data.substring(pos, pos + 1); pos += 1 // 0=OK, 1=NOK, 2=Low, 3=High
    const torqueHighLimit = parseFloat(data.substring(pos, pos + 8)); pos += 8
    const angleLowLimit = parseFloat(data.substring(pos, pos + 8)); pos += 8
    const finalAngle = parseFloat(data.substring(pos, pos + 8)); pos += 8
    const angleStatus = data.substring(pos, pos + 1); pos += 1 // 0=OK, 1=NOK, 2=Low, 3=High
    const angleHighLimit = parseFloat(data.substring(pos, pos + 8)); pos += 8
    const timeStatus = data.substring(pos, pos + 1); pos += 1 // 0=OK, 1=NOK, 2=Low, 3=High
    
    // 可选字段（如果长度足够）
    let batchSize, batchCount, batchStatus
    if (data.length >= pos + 9) {
      batchSize = data.substring(pos, pos + 4).trim(); pos += 4
      batchCount = data.substring(pos, pos + 4).trim(); pos += 4
      batchStatus = data.substring(pos, pos + 1); pos += 1 // 0=No batch, 1=Batch OK, 2=Batch NOK
    }
    
    return {
      spindleNumber,
      spindleSerialNumber,
      programNumber,
      overallStatus: parseInt(overallStatus),
      overallStatusText: overallStatus === '0' ? 'OK' : 'NOK',
      torque: {
        lowLimit: torqueLowLimit,
        value: finalTorque,
        highLimit: torqueHighLimit,
        status: parseInt(torqueStatus),
        statusText: ['OK', 'NOK', 'Low', 'High'][parseInt(torqueStatus)]
      },
      angle: {
        lowLimit: angleLowLimit,
        value: finalAngle,
        highLimit: angleHighLimit,
        status: parseInt(angleStatus),
        statusText: ['OK', 'NOK', 'Low', 'High'][parseInt(angleStatus)]
      },
      timeStatus: parseInt(timeStatus),
      timeStatusText: ['OK', 'NOK', 'Low', 'High'][parseInt(timeStatus)],
      batch: batchSize ? {
        size: batchSize,
        count: batchCount,
        status: parseInt(batchStatus),
        statusText: ['No batch', 'Batch OK', 'Batch NOK'][parseInt(batchStatus)]
      } : null
    }
  }
  
  /**
   * 解析Additional VIN信息
   */
  static parseAdditionalVIN(data) {
    const vinIdentifier = data.substring(0, 4).trim()
    const vinNumber = data.substring(4, 29).trim()
    
    return {
      identifier: vinIdentifier,
      vinNumber
    }
  }
  
  /**
   * 解析Parameter信息
   */
  static parseParameterInfo(data) {
    let pos = 0
    
    const spindleNumber = data.substring(pos, pos + 4).trim(); pos += 4
    const programNumber = data.substring(pos, pos + 4).trim(); pos += 4
    const parameterId = data.substring(pos, pos + 5).trim(); pos += 5
    const parameterName = data.substring(pos, pos + 25).trim(); pos += 25
    const value = data.substring(pos, pos + 25).trim(); pos += 25
    const type = data.substring(pos, pos + 1); pos += 1 // 0=string, 1=integer, 2=real
    const unit = data.substring(pos, pos + 6).trim(); pos += 6
    const stepNo = data.substring(pos, pos + 2).trim(); pos += 2
    
    // 根据类型解析值
    let parsedValue = value
    if (type === '1') {
      parsedValue = parseInt(value)
    } else if (type === '2') {
      parsedValue = parseFloat(value)
    }
    
    return {
      spindleNumber,
      programNumber,
      parameterId,
      parameterName,
      value: parsedValue,
      rawValue: value,
      type: parseInt(type),
      typeText: ['String', 'Integer', 'Real'][parseInt(type)],
      unit,
      stepNo
    }
  }
  
  /**
   * 解析错误事件电报 (Type 09)
   */
  static parseErrorEventTelegram(data) {
    let pos = 0
    
    const telegramId = data.substring(pos, pos + 2); pos += 2
    const identifier = data.substring(pos, pos + 5); pos += 5
    const systemType = data.substring(pos, pos + 4).trim(); pos += 4
    const systemNumber = data.substring(pos, pos + 4).trim(); pos += 4
    const stationNumber = data.substring(pos, pos + 4).trim(); pos += 4
    const timestamp = data.substring(pos, pos + 14); pos += 14
    const eventSequenceNumber = data.substring(pos, pos + 5).trim(); pos += 5
    const errorCode = data.substring(pos, pos + 5).trim(); pos += 5
    const eventLevel = data.substring(pos, pos + 3).trim(); pos += 3
    const numberOfEventParams = parseInt(data.substring(pos, pos + 2)); pos += 2
    
    // 解析事件参数
    const eventParameters = []
    for (let i = 0; i < numberOfEventParams; i++) {
      const paramId = data.substring(pos, pos + 3).trim(); pos += 3
      const paramType = data.substring(pos, pos + 1); pos += 1
      const paramValue = data.substring(pos, pos + 20).trim(); pos += 20
      
      eventParameters.push({
        id: paramId,
        type: paramType,
        value: paramValue
      })
    }
    
    return {
      telegramId,
      identifier,
      systemType,
      systemNumber,
      stationNumber,
      timestamp: this.formatTimestamp(timestamp),
      eventSequenceNumber,
      errorCode,
      eventLevel,
      numberOfEventParams,
      eventParameters,
      rawData: data
    }
  }
  
  /**
   * 解析PIM信息电报 (Type 08)
   */
  static parsePIMInformationTelegram(data) {
    let pos = 0
    
    const telegramId = data.substring(pos, pos + 2); pos += 2
    const identifier = data.substring(pos, pos + 5); pos += 5
    const resultSequenceNumber = data.substring(pos, pos + 5).trim(); pos += 5
    const eventSequenceNumber = data.substring(pos, pos + 5).trim(); pos += 5
    const tnIpAddress = data.substring(pos, pos + 15).trim(); pos += 15
    const tnPortNumber = data.substring(pos, pos + 5).trim(); pos += 5
    
    return {
      telegramId,
      identifier,
      resultSequenceNumber,
      eventSequenceNumber,
      toolsNetIpAddress: tnIpAddress,
      toolsNetPortNumber: tnPortNumber,
      rawData: data
    }
  }
  
  /**
   * 解析系统描述电报 (Type 01)
   */
  static parseSystemDescriptionTelegram(data) {
    let pos = 0
    
    const telegramId = data.substring(pos, pos + 2); pos += 2
    const identifier = data.substring(pos, pos + 5); pos += 5
    const systemType = data.substring(pos, pos + 4).trim(); pos += 4
    const systemNumber = data.substring(pos, pos + 4).trim(); pos += 4
    const ipAddress = data.substring(pos, pos + 15).trim(); pos += 15
    const systemName = data.substring(pos, pos + 25).trim(); pos += 25
    const spare = data.substring(pos, pos + 2); pos += 2
    
    return {
      telegramId,
      identifier,
      systemType,
      systemNumber,
      ipAddress,
      systemName,
      rawData: data
    }
  }
  
  /**
   * 解析工位描述电报 (Type 02)
   */
  static parseStationDescriptionTelegram(data) {
    let pos = 0
    
    const telegramId = data.substring(pos, pos + 2); pos += 2
    const identifier = data.substring(pos, pos + 5); pos += 5
    const systemType = data.substring(pos, pos + 4).trim(); pos += 4
    const systemNumber = data.substring(pos, pos + 4).trim(); pos += 4
    const stationNumber = data.substring(pos, pos + 4).trim(); pos += 4
    const ipAddress = data.substring(pos, pos + 15).trim(); pos += 15
    const stationName = data.substring(pos, pos + 25).trim(); pos += 25
    const numberOfSpindles = parseInt(data.substring(pos, pos + 4)); pos += 4
    
    // 解析Spindle信息
    const spindles = []
    for (let i = 0; i < numberOfSpindles; i++) {
      const spindleNumber = data.substring(pos, pos + 4).trim(); pos += 4
      const spindleName = data.substring(pos, pos + 25).trim(); pos += 25
      const numberOfPrograms = parseInt(data.substring(pos, pos + 4)); pos += 4
      
      const programs = []
      for (let j = 0; j < numberOfPrograms; j++) {
        const programNumber = data.substring(pos, pos + 4).trim(); pos += 4
        const programName = data.substring(pos, pos + 25).trim(); pos += 25
        programs.push({ programNumber, programName })
      }
      
      spindles.push({
        spindleNumber,
        spindleName,
        numberOfPrograms,
        programs
      })
    }
    
    return {
      telegramId,
      identifier,
      systemType,
      systemNumber,
      stationNumber,
      ipAddress,
      stationName,
      numberOfSpindles,
      spindles,
      rawData: data
    }
  }
  
  /**
   * 解析曲线电报 (Type 13)
   */
  static parseGraphTelegram(data) {
    let pos = 0
    
    const telegramId = data.substring(pos, pos + 2); pos += 2
    const identifier = data.substring(pos, pos + 5); pos += 5
    const generalInfoLength = parseInt(data.substring(pos, pos + 3)); pos += 3
    const systemType = data.substring(pos, pos + 4).trim(); pos += 4
    const systemNumber = data.substring(pos, pos + 4).trim(); pos += 4
    const stationNumber = data.substring(pos, pos + 4).trim(); pos += 4
    const spindleNumber = data.substring(pos, pos + 4).trim(); pos += 4
    const programNumber = data.substring(pos, pos + 4).trim(); pos += 4
    const timestamp = data.substring(pos, pos + 14); pos += 14
    const rundownSequenceNumber = data.substring(pos, pos + 5).trim(); pos += 5
    const graphType = data.substring(pos, pos + 1); pos += 1 // 0=Torque Trace, 1=Angle Trace
    const bitShift = parseInt(data.substring(pos, pos + 10)); pos += 10
    const scaleFactorDom = parseInt(data.substring(pos, pos + 10)); pos += 10
    const scaleFactorNom = parseInt(data.substring(pos, pos + 10)); pos += 10
    const minLimit = parseFloat(data.substring(pos, pos + 8)); pos += 8
    const maxLimit = parseFloat(data.substring(pos, pos + 8)); pos += 8
    const angleOffset = parseFloat(data.substring(pos, pos + 8)); pos += 8
    const sampleTime = parseFloat(data.substring(pos, pos + 8)); pos += 8
    const traceDataLength = parseInt(data.substring(pos, pos + 4)); pos += 4
    
    // Trace Data 是打包的16位有符号整数数组
    const traceData = data.substring(pos, pos + traceDataLength)
    
    // 计算缩放因子
    const scaleFactor = Math.pow(2, bitShift) * scaleFactorDom / scaleFactorNom
    
    return {
      telegramId,
      identifier,
      generalInfoLength,
      systemType,
      systemNumber,
      stationNumber,
      spindleNumber,
      programNumber,
      timestamp: this.formatTimestamp(timestamp),
      rundownSequenceNumber,
      graphType: parseInt(graphType),
      graphTypeText: graphType === '0' ? 'Torque Trace' : 'Angle Trace',
      bitShift,
      scaleFactorDom,
      scaleFactorNom,
      scaleFactor,
      minLimit,
      maxLimit,
      angleOffset,
      sampleTime,
      traceDataLength,
      traceData, // 原始二进制数据
      rawData: data
    }
  }
  
  /**
   * 构建确认电报 (Type 05)
   */
  static buildAcknowledgeTelegram(identifier, errorCode = '000') {
    const timestamp = this.getCurrentTimestamp()
    const data = '05' + identifier + timestamp + errorCode
    return this.buildTelegram(data)
  }
  
  /**
   * 构建错误事件确认电报 (Type 10)
   */
  static buildErrorEventAckTelegram(identifier, systemType, systemNumber, stationNumber, errorCode) {
    const timestamp = this.getCurrentTimestamp()
    const data = '10' + 
                 identifier + 
                 systemType.padStart(4, '0') + 
                 systemNumber.padStart(4, '0') + 
                 stationNumber.padStart(4, '0') + 
                 timestamp + 
                 errorCode.padStart(5, '0')
    return this.buildTelegram(data)
  }
  
  /**
   * 构建Keep-Alive电报 (Type 06)
   */
  static buildKeepAliveTelegram(identifier = '00001') {
    const data = '06' + identifier
    return this.buildTelegram(data)
  }
  
  /**
   * 构建PIM验证电报 (Type 12)
   */
  static buildPIMVerificationTelegram(identifier = '00001') {
    const data = '12' + identifier
    return this.buildTelegram(data)
  }
  
  /**
   * 构建PIM信息请求电报 (Type 07)
   */
  static buildPIMInfoRequestTelegram(identifier, systemType, systemNumber, stationNumber) {
    const data = '07' + 
                 identifier + 
                 systemType.padStart(4, '0') + 
                 systemNumber.padStart(4, '0') + 
                 stationNumber.padStart(4, '0')
    return this.buildTelegram(data)
  }
  
  /**
   * 格式化时间戳
   * 格式: yyyymmddhhnnss
   */
  static formatTimestamp(timestamp) {
    if (timestamp.length !== 14) return timestamp
    
    const year = timestamp.substring(0, 4)
    const month = timestamp.substring(4, 6)
    const day = timestamp.substring(6, 8)
    const hour = timestamp.substring(8, 10)
    const minute = timestamp.substring(10, 12)
    const second = timestamp.substring(12, 14)
    
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
  
  /**
   * 获取当前时间戳
   * 格式: yyyymmddhhnnss
   */
  static getCurrentTimestamp() {
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const hour = now.getHours().toString().padStart(2, '0')
    const minute = now.getMinutes().toString().padStart(2, '0')
    const second = now.getSeconds().toString().padStart(2, '0')
    
    return `${year}${month}${day}${hour}${minute}${second}`
  }
  
  /**
   * 解析电报并返回结构化数据
   * 根据电报类型自动选择相应的解析器
   */
  static parse(telegram) {
    const parsed = this.parseTelegram(telegram)
    const { telegramId, data } = parsed
    
    switch (telegramId) {
      case TELEGRAM_TYPES.RESULT:
        return {
          ...parsed,
          type: 'Result',
          content: this.parseResultTelegram(data)
        }
      
      case TELEGRAM_TYPES.ERROR_EVENT:
        return {
          ...parsed,
          type: 'ErrorEvent',
          content: this.parseErrorEventTelegram(data)
        }
      
      case TELEGRAM_TYPES.PIM_INFORMATION:
        return {
          ...parsed,
          type: 'PIMInformation',
          content: this.parsePIMInformationTelegram(data)
        }
      
      case TELEGRAM_TYPES.SYSTEM_DESCRIPTION:
        return {
          ...parsed,
          type: 'SystemDescription',
          content: this.parseSystemDescriptionTelegram(data)
        }
      
      case TELEGRAM_TYPES.STATION_DESCRIPTION:
        return {
          ...parsed,
          type: 'StationDescription',
          content: this.parseStationDescriptionTelegram(data)
        }
      
      case TELEGRAM_TYPES.GRAPH:
        return {
          ...parsed,
          type: 'Graph',
          content: this.parseGraphTelegram(data)
        }
      
      case TELEGRAM_TYPES.ACKNOWLEDGE:
        return {
          ...parsed,
          type: 'Acknowledge',
          content: { message: 'Acknowledge received' }
        }
      
      case TELEGRAM_TYPES.KEEP_ALIVE:
        return {
          ...parsed,
          type: 'KeepAlive',
          content: { message: 'Keep alive' }
        }
      
      default:
        return {
          ...parsed,
          type: 'Unknown',
          content: { message: `Unknown telegram type: ${telegramId}` }
        }
    }
  }
}

export default ToolsNetTelegramParser
