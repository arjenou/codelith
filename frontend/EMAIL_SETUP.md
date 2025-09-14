# 邮件服务设置指南

## 🚀 快速设置 Resend 邮件服务

### 1. 注册 Resend 账户
1. 访问 [resend.com](https://resend.com)
2. 注册免费账户（每月免费 3000 封邮件）
3. 验证邮箱地址

### 2. 获取 API 密钥
1. 登录 Resend 控制台
2. 点击 "API Keys" 
3. 点击 "Create API Key"
4. 复制生成的密钥（格式类似：`re_AbCdEf12_34567890abcdefghijklmnop`）

### 3. 设置发送域名（可选）
**选项 A: 使用 Resend 提供的测试域名**
- 无需设置，但邮件可能被标记为垃圾邮件
- 发送方显示为：`onboarding@resend.dev`

**选项 B: 使用你的域名（推荐）**
1. 在 Resend 控制台添加域名 `codelith.co.jp`
2. 按照说明添加 DNS 记录
3. 验证域名后可使用 `contact@codelith.co.jp` 发送

### 4. 更新代码
在 `/api/send-email.js` 中替换：

```javascript
// 第 61 行：替换为真实的 API 密钥
'Authorization': 'Bearer re_your_real_api_key_here',

// 第 65 行：使用验证过的域名（如果设置了）
from: 'contact@codelith.co.jp', // 或 'onboarding@resend.dev'
```

### 5. 重新部署
```bash
git add .
git commit -m "Update Resend API key"
git push origin main
```

## 📧 邮件功能说明

### 当前配置：
- **发送方**: `contact@codelith.co.jp` (需要域名验证)
- **接收方**: `wangyunjie1101@gmail.com` (你的邮箱)
- **回复地址**: 客户填写的邮箱地址
- **不会给客户发送自动回复**

### 邮件内容包含：
- ✅ 客户姓名、邮箱、电话
- ✅ 询问主题和内容
- ✅ 提交时间（日本时间）
- ✅ 美观的 HTML 格式
- ✅ 点击邮箱地址可直接回复

### 备用方案：
如果 Resend API 失败，所有内容仍会记录到 Vercel 日志中，确保不丢失任何询问。

## 🔧 故障排除

**如果邮件发送失败**：
1. 检查 API 密钥是否正确
2. 确认域名是否已验证
3. 查看 Vercel 函数日志获取详细错误信息
4. 临时查看日志中的备用内容

**免费额度**：
- Resend: 3000封/月
- 对于联系表单来说完全足够

---

设置完成后，你就能收到格式美观的邮件通知了！🎌
