/**
 * ToolsNet Telegram 示例数据
 * 
 * 用于测试和演示电报解析器
 */

/**
 * 示例1: 结果电报 (Type 04)
 * 包含1个Spindle，无Additional VIN，无Parameter
 */
export const EXAMPLE_RESULT_TELEGRAM_1 = 
  '0159' + // 长度: 159字节
  '04' +   // 电报类型: 04 (Result)
  '00001' + // Identifier
  '79' +   // General info length: 79
  '0001' + // System type
  '0001' + // System number
  '0001' + // Station number
  '20251214103045' + // Timestamp
  '00123' + // Rundown sequence number
  'WDD1234567890123456789' + // VIN (25 chars)
  '0001' + // Number of spindles: 1
  '70' +   // Spindle info length: 70
  '00' +   // Number of additional VINs: 0
  '00' +   // VIN field length
  '000' +  // Number of additional params: 0
  '00' +   // Param field length
  // Spindle Info (70 bytes)
  '0001' + // Spindle number
  'SN12345678' + // Spindle serial number (10 chars)
  '0001' + // Program number
  '0' +    // Overall status: 0=OK
  '0015.50' + // Torque low limit
  '0020.35' + // Final torque
  '0' +    // Torque status: 0=OK
  '0025.00' + // Torque high limit
  '0350.0' + // Angle low limit (8 chars, right-aligned)
  '0385.5' + // Final angle (8 chars)
  '0' +    // Angle status: 0=OK
  '0420.0' + // Angle high limit (8 chars)
  '0' +    // Time status: 0=OK
  '0010' + // Batch size
  '0005' + // Batch count
  '1'      // Batch status: 1=Batch OK

/**
 * 示例2: 结果电报 - 包含NOK状态
 */
export const EXAMPLE_RESULT_TELEGRAM_NOK = 
  '0159' +
  '04' +
  '00002' +
  '79' +
  '0001' +
  '0001' +
  '0002' +
  '20251214103145' +
  '00124' +
  'WDD9876543210987654321' +
  '0001' +
  '70' +
  '00' +
  '00' +
  '000' +
  '00' +
  '0001' +
  'SN12345678' +
  '0002' +
  '1' +    // Overall status: 1=NOK
  '0015.50' +
  '0014.25' + // Final torque (低于下限)
  '2' +    // Torque status: 2=Low
  '0025.00' +
  '0350.0' +
  '0390.5' +
  '0' +
  '0420.0' +
  '0' +
  '0010' +
  '0005' +
  '2'      // Batch status: 2=Batch NOK

/**
 * 示例3: 错误事件电报 (Type 09)
 */
export const EXAMPLE_ERROR_EVENT_TELEGRAM = 
  '0078' + // 长度: 78字节
  '09' +   // 电报类型: 09 (Error Event)
  '00003' + // Identifier
  '0001' + // System type
  '0001' + // System number
  '0001' + // Station number
  '20251214103245' + // Timestamp
  '00025' + // Event sequence number
  '00123' + // Error code
  '002' +  // Event level
  '01' +   // Number of event parameters: 1
  '001' +  // Parameter ID
  '0' +    // Parameter type
  'Torque sensor error' + ' '.repeat(20 - 'Torque sensor error'.length) // Parameter value (20 chars)

/**
 * 示例4: PIM信息电报 (Type 08)
 */
export const EXAMPLE_PIM_INFO_TELEGRAM = 
  '0037' + // 长度: 37字节
  '08' +   // 电报类型: 08 (PIM Information)
  '00004' + // Identifier
  '00150' + // Result sequence number
  '00025' + // Event sequence number
  '192.168.1.100 ' + // TN IP address (15 chars)
  '10111'   // TN Port number

/**
 * 示例5: 系统描述电报 (Type 01)
 */
export const EXAMPLE_SYSTEM_DESC_TELEGRAM = 
  '0052' + // 长度: 52字节
  '01' +   // 电报类型: 01 (System Description)
  '00005' + // Identifier
  '0001' + // System type
  '0001' + // System number
  '192.168.1.101 ' + // IP address (15 chars)
  'PowerFocus 6000      ' + // System name (25 chars, padded)
  '  '     // Spare (2 chars)

/**
 * 示例6: 工位描述电报 (Type 02)
 * 包含2个Spindle，每个Spindle 2个Program
 */
export const EXAMPLE_STATION_DESC_TELEGRAM = 
  '0199' + // 长度计算后填写
  '02' +   // 电报类型: 02 (Station Description)
  '00006' + // Identifier
  '0001' + // System type
  '0001' + // System number
  '0001' + // Station number
  '192.168.1.102 ' + // IP address (15 chars)
  'Station Line 1       ' + // Station name (25 chars)
  '0002' + // Number of spindles: 2
  // Spindle 1
  '0001' + // Spindle number
  'Spindle A            ' + // Spindle name (25 chars)
  '0002' + // Number of programs: 2
  '0001' + // Program 1 number
  'Tighten Bolt M8      ' + // Program 1 name (25 chars)
  '0002' + // Program 2 number
  'Tighten Bolt M10     ' + // Program 2 name (25 chars)
  // Spindle 2
  '0002' + // Spindle number
  'Spindle B            ' + // Spindle name (25 chars)
  '0002' + // Number of programs: 2
  '0001' + // Program 1 number
  'Tighten Nut M12      ' + // Program 1 name (25 chars)
  '0002' + // Program 2 number
  'Tighten Nut M14      '   // Program 2 name (25 chars)

/**
 * 示例7: Keep-Alive电报 (Type 06)
 */
export const EXAMPLE_KEEP_ALIVE_TELEGRAM = 
  '0007' + // 长度: 7字节
  '06' +   // 电报类型: 06 (Keep-Alive)
  '00007'  // Identifier

/**
 * 示例8: 确认电报 (Type 05)
 */
export const EXAMPLE_ACKNOWLEDGE_TELEGRAM = 
  '0024' + // 长度: 24字节
  '05' +   // 电报类型: 05 (Acknowledge)
  '00001' + // Identifier (对应被确认的电报)
  '20251214103345' + // Timestamp
  '000'    // Error code: 000=成功

/**
 * 示例9: PIM验证电报 (Type 12)
 */
export const EXAMPLE_PIM_VERIFICATION_TELEGRAM = 
  '0007' + // 长度: 7字节
  '12' +   // 电报类型: 12 (PIM Verification)
  '00008'  // Identifier

/**
 * 示例10: PIM信息请求电报 (Type 07)
 */
export const EXAMPLE_PIM_INFO_REQUEST_TELEGRAM = 
  '0019' + // 长度: 19字节
  '07' +   // 电报类型: 07 (PIM Info Request)
  '00009' + // Identifier
  '0001' + // System type
  '0001' + // System number
  '0001'   // Station number

/**
 * 示例11: 结果电报 - 包含Additional VINs和Parameters
 */
export const EXAMPLE_RESULT_TELEGRAM_FULL = 
  '0400' + // 长度: 400字节 (approximate)
  '04' +
  '00010' +
  '80' +   // General info length: 80
  '0001' +
  '0001' +
  '0001' +
  '20251214104500' +
  '00200' +
  'WDD1111222233334444555' +
  '0001' +
  '70' +
  '01' +   // Number of additional VINs: 1
  '29' +   // VIN field length: 29
  '002' +  // Number of additional params: 2
  '72' +   // Param field length: 72
  // Spindle Info
  '0001' +
  'SN98765432' +
  '0005' +
  '0' +
  '0018.00' +
  '0021.50' +
  '0' +
  '0024.00' +
  '0360.0' +
  '0388.2' +
  '0' +
  '0400.0' +
  '0' +
  '0005' +
  '0003' +
  '1' +
  // Additional VIN
  '0001' +
  'ENGINE123456789012345' +
  // Parameter 1
  '0001' +
  '0005' +
  '00001' +
  'Peak Torque          ' +
  '22.35                ' +
  '2' +
  'Nm    ' +
  '01' +
  // Parameter 2
  '0001' +
  '0005' +
  '00002' +
  'Peak Angle           ' +
  '395.8                ' +
  '2' +
  'Deg   ' +
  '01'

/**
 * 所有示例电报的集合
 */
export const ALL_EXAMPLES = {
  result1: EXAMPLE_RESULT_TELEGRAM_1,
  resultNOK: EXAMPLE_RESULT_TELEGRAM_NOK,
  resultFull: EXAMPLE_RESULT_TELEGRAM_FULL,
  errorEvent: EXAMPLE_ERROR_EVENT_TELEGRAM,
  pimInfo: EXAMPLE_PIM_INFO_TELEGRAM,
  systemDesc: EXAMPLE_SYSTEM_DESC_TELEGRAM,
  stationDesc: EXAMPLE_STATION_DESC_TELEGRAM,
  keepAlive: EXAMPLE_KEEP_ALIVE_TELEGRAM,
  acknowledge: EXAMPLE_ACKNOWLEDGE_TELEGRAM,
  pimVerification: EXAMPLE_PIM_VERIFICATION_TELEGRAM,
  pimInfoRequest: EXAMPLE_PIM_INFO_REQUEST_TELEGRAM
}

export default ALL_EXAMPLES
