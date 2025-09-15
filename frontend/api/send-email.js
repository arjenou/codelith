// Vercel API 路由：发送邮件 (使用成功验证的 Gmail SMTP 方案)
let nodemailer;
let transporter;

// 安全加载 nodemailer
try {
  nodemailer = require('nodemailer');
  
  // 创建邮件传输器 - 使用正确的 SMTP 服务器信息
  transporter = nodemailer.createTransport({
    host: 'mail1027.onamae.ne.jp', // 从截图中获取的 SMTP 服务器
    port: 587, // SSL接続なし の場合
    secure: false, // 587 端口不使用 SSL
    auth: {
      user: 'info@codelith.co.jp',
      pass: 'infocodelith123!'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  console.log('Nodemailer loaded successfully');
} catch (loadError) {
  console.error('Failed to load nodemailer:', loadError);
}

module.exports = async function handler(req, res) {
  // 全局错误处理
  try {
    // 设置 CORS 头和内容类型
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // 只允许 POST 请求
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('API endpoint called, method:', req.method);
    // 检查 nodemailer 是否成功加载
    if (!nodemailer || !transporter) {
      console.error('Nodemailer not available');
      return res.status(500).json({ 
        error: 'メールサービスが利用できません。しばらく時間をおいて再度お試しください。' 
      });
    }

    const { name, email, phone, subject, message } = req.body;

    console.log('Received form data:', { name, email, phone, subject, message });

    // 验证必填字段
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'お名前、メールアドレス、メッセージ内容は必須項目です。' 
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: '有効なメールアドレスを入力してください。' 
      });
    }

    // 邮件内容（基于成功的模板）
    const mailOptions = {
      from: 'info@codelith.co.jp', // 使用公司邮箱发送
      to: 'info@codelith.co.jp', // 发送到公司邮箱
      replyTo: email, // 回复地址设置为填写表格的人的邮箱
      subject: `【株式会社Codelith】新しいお問い合わせ - ${name}様`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h3 style="margin: 0; font-size: 24px;">株式会社Codelith</h3>
            <p style="margin: 5px 0 0 0; font-size: 16px;">新しいお問い合わせ - ${name}様より</p>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #4f46e5; margin-top: 0;">お客様情報</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">お名前:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">メールアドレス:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">電話番号:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${phone}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">件名:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${subject}</td>
              </tr>
            </table>
            
            ${message ? `
            <h3 style="color: #4f46e5; margin-top: 30px;">お問い合わせ内容</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #4f46e5;">
              <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            ` : ''}
            
            <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
              <p style="margin: 0; font-size: 14px; color: #666;">
                <strong>送信日時:</strong> ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>このメールは株式会社Codelithのウェブサイトから自動送信されました。</p>
            <p>お客様への返信は上記メールアドレスへお送りください。</p>
          </div>
        </div>
      `
    };

    // 发送邮件
    try {
      const info = await transporter.sendMail(mailOptions);
      
      console.log('メール送信成功:', info.messageId);
      
      return res.status(200).json({ 
        success: true, 
        message: 'お問い合わせを送信いたしました。24時間以内にご返信いたします。',
        messageId: info.messageId 
      });
    } catch (mailError) {
      console.error('メール送信失敗:', mailError);
      console.error('Mail error details:', {
        code: mailError.code,
        command: mailError.command,
        response: mailError.response
      });
      
      return res.status(500).json({ 
        error: 'メールの送信に失敗しました。しばらく時間をおいて再度お試しください。',
        details: mailError.message
      });
    }
    
  } catch (globalError) {
    console.error('Global error in API handler:', globalError);
    
    // 确保总是返回 JSON 响应
    try {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ 
        error: 'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。',
        details: globalError.message 
      });
    } catch (responseError) {
      console.error('Failed to send error response:', responseError);
      // 如果连 JSON 响应都发送不了，至少记录错误
      return res.status(500).end('Internal Server Error');
    }
  }
}
