@echo off
chcp 65001 >nul
cls

echo.
echo ================================
echo   查看联系人关系图谱功能
echo ================================
echo.
echo 正在打开浏览器...
echo.

start http://localhost:3003/mingsheng-aicrm

echo.
echo ✅ 已打开AICRM v3.0 - 联系人管理增强版
echo.
echo 📊 使用步骤：
echo.
echo 【方法1：查看关系图谱】
echo 1. 点击顶部导航"销售漏斗"
echo 2. 点击任一商机进入详情
echo 3. 在Header点击"联系人关系图谱(4)"按钮
echo 4. 查看三层组织架构（高层/中层/基层）
echo 5. 点击任一联系人卡片查看详情
echo.
echo 【方法2：新增联系人】
echo 1. 在商机详情中，展开任一阶段
echo 2. 点击"添加事件"按钮
echo 3. 事件类型选择"新增联系人"
echo 4. 填写15个字段的完整表单：
echo    - 基本信息：姓名、职位、部门、层级
echo    - 联系方式：电话、邮箱、微信
echo    - 决策分析：角色、决策权级别
echo    - 对接事务：11种可多选
echo    - 画像分析：兴趣、沟通偏好、态度
echo 5. 设置赢率影响（参考AI建议）
echo 6. 保存后自动添加到关系图谱
echo.
echo 💡 核心功能：
echo.
echo ✅ 15字段完整联系人信息
echo ✅ 三层组织架构可视化（高层/中层/基层）
echo ✅ 5种决策角色颜色标识（决策者/推动者/影响者/反对者/使用者）
echo ✅ 上下级汇报关系展示
echo ✅ 11种主要对接事务
echo ✅ 联系人360°详细档案
echo ✅ 互动历史自动追踪（最近5次）
echo ✅ AI智能赢率建议
echo ✅ 关联客户360°画像
echo.
echo 🎯 联系人决策角色：
echo.
echo 🔴 决策者（拍板人）    - 赢率影响 +10%~+15%
echo 🟢 推动者（内部支持）  - 赢率影响 +8%~+12%
echo 🟡 影响者（建议者）    - 赢率影响 +5%~+8%
echo ⚫ 反对者（阻碍者）    - 赢率影响 -15%~-8%
echo 🔵 使用者（最终用户）  - 赢率影响 +3%~+5%
echo.
echo 📋 主要对接事务（11种）：
echo.
echo ✅ 技术沟通         ✅ 生产现场
echo ✅ 设备管理         ✅ 仓库收货
echo ✅ 产品验收         ✅ 质检
echo ✅ 工具管理和标定   ✅ 采购报价
echo ✅ 询价             ✅ 签合同
echo ✅ 收发票
echo.
pause
