/**
 * AI自动报价系统
 * 智能生成PDF报价单
 */

import jsPDF from 'jspdf'
import 'jspdf-autotable'

export class QuotationGenerator {
  constructor() {
    this.company = {
      name: '广州市明升伟业机电有限公司',
      nameEn: 'Guangzhou Mingsheng Weiye Electromechanical Co., Ltd.',
      address: '广州市天河区珠江新城',
      phone: '400-123-4567',
      email: 'sales@mingsheng.com',
      website: 'www.mingsheng.com',
      logo: '/logo.png'
    }

    // 价格数据库（模拟）
    this.priceDatabase = new Map()
  }

  /**
   * 生成报价单
   * @param {Object} params - 报价参数
   * @returns {Blob} PDF文件
   */
  async generateQuotation(params) {
    const {
      customer,
      products,
      paymentTerms = '30% T/T预付，70%发货前',
      deliveryTerms = 'FOB Shanghai',
      validityDays = 30,
      language = 'zh-CN'
    } = params

    // 计算价格
    const quotationData = await this.calculatePrices(products)

    // 生成PDF
    const pdf = this.createPDF(quotationData, customer, paymentTerms, deliveryTerms, validityDays, language)

    return pdf.output('blob')
  }

  /**
   * 计算产品价格
   */
  async calculatePrices(products) {
    const quotationItems = []
    let subtotal = 0

    for (const product of products) {
      const price = await this.getProductPrice(product)
      const quantity = product.quantity || 1
      const lineTotal = price * quantity
      
      quotationItems.push({
        model: product.model || product.name,
        description: product.description,
        quantity: quantity,
        unit: product.unit || 'pcs',
        unitPrice: price,
        lineTotal: lineTotal,
        leadTime: product.leadTime || '4-6周',
        specs: product.specs || []
      })

      subtotal += lineTotal
    }

    // 计算折扣
    const discount = this.calculateDiscount(subtotal, products.length)
    const totalAfterDiscount = subtotal * (1 - discount)

    // 税费（如适用）
    const taxRate = 0
    const tax = totalAfterDiscount * taxRate

    const total = totalAfterDiscount + tax

    return {
      items: quotationItems,
      subtotal,
      discount,
      discountAmount: subtotal * discount,
      tax,
      taxRate,
      total,
      currency: 'CNY'
    }
  }

  /**
   * 获取产品价格
   */
  async getProductPrice(product) {
    // 从数据库获取基础价格
    let basePrice = this.priceDatabase.get(product.id) || product.basePrice || 10000

    // 根据参数调整价格
    if (product.customization) {
      basePrice *= 1.15 // 定制化加价15%
    }

    if (product.urgentDelivery) {
      basePrice *= 1.1 // 紧急交付加价10%
    }

    if (product.warranty && product.warranty > 1) {
      basePrice *= (1 + (product.warranty - 1) * 0.05) // 延保每年加5%
    }

    return Math.round(basePrice)
  }

  /**
   * 计算批量折扣
   */
  calculateDiscount(subtotal, itemCount) {
    if (subtotal >= 500000) return 0.10 // 50万以上10%折扣
    if (subtotal >= 200000) return 0.08 // 20万以上8%折扣
    if (subtotal >= 100000) return 0.05 // 10万以上5%折扣
    if (itemCount >= 10) return 0.03    // 10件以上3%折扣
    return 0
  }

  /**
   * 创建PDF文档
   */
  createPDF(quotationData, customer, paymentTerms, deliveryTerms, validityDays, language) {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    let yPos = 20

    // 设置字体（支持中文）
    // doc.addFont('path/to/chinese-font.ttf', 'chinese', 'normal')
    // doc.setFont('chinese')

    // 标题
    doc.setFontSize(20)
    doc.setTextColor(51, 51, 51)
    const title = language === 'zh-CN' ? '商业报价单' : 'QUOTATION'
    doc.text(title, pageWidth / 2, yPos, { align: 'center' })
    yPos += 15

    // 公司信息
    doc.setFontSize(10)
    doc.setTextColor(102, 102, 102)
    doc.text(language === 'zh-CN' ? this.company.name : this.company.nameEn, 14, yPos)
    yPos += 5
    doc.text(`Tel: ${this.company.phone} | Email: ${this.company.email}`, 14, yPos)
    yPos += 10

    // 分隔线
    doc.setDrawColor(200, 200, 200)
    doc.line(14, yPos, pageWidth - 14, yPos)
    yPos += 10

    // 客户信息和报价信息并排
    const leftCol = 14
    const rightCol = pageWidth / 2 + 10

    doc.setFontSize(10)
    doc.setTextColor(51, 51, 51)
    
    // 左列：客户信息
    doc.text(language === 'zh-CN' ? '客户信息：' : 'Customer:', leftCol, yPos)
    yPos += 6
    doc.text(customer.company || 'N/A', leftCol, yPos)
    yPos += 5
    doc.text(`${customer.contact || ''} - ${customer.email || ''}`, leftCol, yPos)
    yPos += 5
    doc.text(`Country: ${customer.country || 'N/A'}`, leftCol, yPos)

    // 右列：报价信息
    const quotationNo = `QT-${Date.now().toString().substr(-8)}`
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + validityDays)

    yPos = yPos - 16
    doc.text(language === 'zh-CN' ? '报价单号：' : 'Quotation No:', rightCol, yPos)
    doc.text(quotationNo, rightCol + 40, yPos)
    yPos += 6
    doc.text(language === 'zh-CN' ? '日期：' : 'Date:', rightCol, yPos)
    doc.text(new Date().toLocaleDateString(), rightCol + 40, yPos)
    yPos += 5
    doc.text(language === 'zh-CN' ? '有效期至：' : 'Valid Until:', rightCol, yPos)
    doc.text(validUntil.toLocaleDateString(), rightCol + 40, yPos)

    yPos += 15

    // 产品明细表
    const tableColumn = language === 'zh-CN' 
      ? ['型号', '数量', '单位', '单价(¥)', '小计(¥)', '交期']
      : ['Model', 'Qty', 'Unit', 'Unit Price', 'Total', 'Lead Time']

    const tableRows = quotationData.items.map(item => [
      item.model,
      item.quantity,
      item.unit,
      item.unitPrice.toLocaleString(),
      item.lineTotal.toLocaleString(),
      item.leadTime
    ])

    doc.autoTable({
      startY: yPos,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' },
        5: { cellWidth: 30, halign: 'center' }
      }
    })

    yPos = doc.lastAutoTable.finalY + 10

    // 价格汇总
    const summaryX = pageWidth - 80
    doc.setFontSize(10)

    // 小计
    doc.text(language === 'zh-CN' ? '小计：' : 'Subtotal:', summaryX, yPos)
    doc.text(`¥${quotationData.subtotal.toLocaleString()}`, summaryX + 40, yPos, { align: 'right' })
    yPos += 6

    // 折扣
    if (quotationData.discount > 0) {
      doc.text(language === 'zh-CN' ? '折扣：' : 'Discount:', summaryX, yPos)
      doc.text(`-¥${quotationData.discountAmount.toLocaleString()} (${(quotationData.discount * 100).toFixed(0)}%)`, summaryX + 40, yPos, { align: 'right' })
      yPos += 6
    }

    // 总计
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text(language === 'zh-CN' ? '总计：' : 'TOTAL:', summaryX, yPos)
    doc.text(`¥${quotationData.total.toLocaleString()}`, summaryX + 40, yPos, { align: 'right' })
    yPos += 10

    // 条款说明
    doc.setFontSize(9)
    doc.setFont(undefined, 'normal')
    doc.setTextColor(102, 102, 102)
    
    doc.text(language === 'zh-CN' ? '付款方式：' : 'Payment Terms:', 14, yPos)
    doc.text(paymentTerms, 14, yPos + 5)
    yPos += 12

    doc.text(language === 'zh-CN' ? '交货条款：' : 'Delivery Terms:', 14, yPos)
    doc.text(deliveryTerms, 14, yPos + 5)
    yPos += 12

    doc.text(language === 'zh-CN' ? '认证：' : 'Certifications:', 14, yPos)
    doc.text('CE / UL / ISO9001', 14, yPos + 5)
    yPos += 15

    // 页脚
    const footerY = pageHeight - 20
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(language === 'zh-CN' 
      ? '本报价单由AI系统自动生成，如有疑问请联系销售团队'
      : 'This quotation is automatically generated by AI system. Please contact our sales team for any questions.',
      pageWidth / 2, footerY, { align: 'center' })

    return doc
  }

  /**
   * 发送报价单邮件
   */
  async sendQuotationEmail(customer, pdfBlob, quotationNo) {
    const formData = new FormData()
    formData.append('to', customer.email)
    formData.append('subject', `Quotation ${quotationNo} from Mingsheng`)
    formData.append('pdf', pdfBlob, `quotation_${quotationNo}.pdf`)

    // TODO: 调用邮件发送API
    console.log('Sending quotation email to:', customer.email)
    
    return {
      success: true,
      quotationNo,
      sentAt: new Date().toISOString()
    }
  }

  /**
   * 同步到CRM系统
   */
  async syncToCRM(quotationData, customer) {
    // TODO: 调用CRM API
    console.log('Syncing to CRM:', { quotationData, customer })
    
    return {
      success: true,
      crmId: `CRM-${Date.now()}`,
      syncedAt: new Date().toISOString()
    }
  }
}

export default QuotationGenerator
