# Vercel 部署和邮件配置指南

## 📧 邮件发送功能设置

### 1. Gmail 应用密码设置

为了安全地使用 Gmail 发送邮件，你需要生成一个应用密码：

1. 访问 [Google 账户设置](https://myaccount.google.com/)
2. 点击左侧菜单中的"安全性"
3. 在"登录 Google"部分，确保已启用"两步验证"
4. 启用两步验证后，点击"应用密码"
5. 选择"邮件"和"其他(自定义名称)"，输入"Codelith Website"
6. 复制生成的16位应用密码（格式类似：abcd efgh ijkl mnop）

### 2. Vercel 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

1. 访问你的 Vercel 项目仪表板
2. 点击项目名称进入项目详情
3. 点击"Settings"标签
4. 点击左侧菜单中的"Environment Variables"
5. 添加以下变量：

```
GMAIL_USER = 你的完整Gmail地址 (例如: your-email@gmail.com)
GMAIL_PASS = 刚才生成的16位应用密码
NODE_ENV = production
```

⚠️ **重要提示**：
- `GMAIL_PASS` 使用的是应用密码，不是你的 Gmail 登录密码
- 应用密码格式通常是 16 位字符，可能包含空格
- 在 Vercel 中输入时，可以包含或不包含空格都可以

### 3. 部署步骤

1. **提交代码到 Git 仓库**：
   ```bash
   git add .
   git commit -m "Add email functionality"
   git push origin main
   ```

2. **连接到 Vercel**：
   - 访问 [Vercel](https://vercel.com)
   - 导入你的 GitHub 仓库
   - 或者使用 Vercel CLI：
     ```bash
     npm i -g vercel
     vercel --prod
     ```

3. **配置环境变量**（如上所述）

4. **重新部署**：
   - 在 Vercel 仪表板中点击"Redeploy"
   - 或推送新的提交触发自动部署

### 4. 测试邮件功能

部署完成后：

1. 访问你的网站联系页面
2. 填写并提交联系表单
3. 检查 `wangyunjie1101@gmail.com` 是否收到邮件
4. 如果没有收到邮件，检查：
   - Vercel 函数日志（在 Vercel 仪表板的 Functions 标签中）
   - Gmail 的垃圾邮件文件夹
   - 环境变量是否正确设置

### 5. 故障排除

**常见问题**：

1. **"Invalid login" 错误**：
   - 确认 GMAIL_USER 是完整的邮箱地址
   - 确认 GMAIL_PASS 是应用密码，不是普通密码
   - 确认已启用两步验证

2. **"Less secure app access" 错误**：
   - 使用应用密码而不是普通密码即可解决

3. **函数超时**：
   - 检查网络连接
   - 确认 Gmail SMTP 服务可访问

4. **邮件未收到**：
   - 检查垃圾邮件文件夹
   - 确认收件邮箱地址正确
   - 检查 Vercel 函数日志

### 6. 安全注意事项

- 永远不要在代码中硬编码密码或敏感信息
- 使用 Vercel 环境变量来存储敏感配置
- 定期更换应用密码
- 监控邮件发送日志，防止滥用

### 7. 文件结构

```
/
├── api/
│   └── send-email.js          # 邮件发送 API 端点
├── contact.html               # 联系表单页面
├── package.json               # 项目依赖
├── vercel.json               # Vercel 配置
└── env.example               # 环境变量示例
```

## 🚀 部署完成！

设置完成后，你的联系表单将能够：
- 接收用户提交的表单数据
- 自动发送格式化的邮件到 `wangyunjie1101@gmail.com`
- 提供用户友好的成功/错误反馈
- 在本地存储备份（以防邮件发送失败）

如果遇到任何问题，请检查 Vercel 函数日志获取详细错误信息。
