// Vercel API 路由：发送邮件
const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    // 验证必填字段
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'お名前、メールアドレス、メッセージ内容は必須項目です' });
    }

    // 创建邮件传输器 (使用 Gmail SMTP)
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: 'wangyunjie1101@gmail.com', // 发送邮件的 Gmail 账户
        pass: 'ibfkmjwbuwwxcefn'        // Gmail 应用密码
      }
    });

    // 邮件选项
    const mailOptions = {
      from: 'wangyunjie1101@gmail.com',
      to: 'wangyunjie1101@gmail.com', // 接收邮件的邮箱
      subject: `【株式会社Codelith】新しいお問い合わせ: ${subject}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #4f46e5; margin-bottom: 20px; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">
              新しいお問い合わせメッセージ
            </h2>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #374151; margin-bottom: 15px;">お客様情報</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold; width: 100px;">お名前:</td>
                  <td style="padding: 8px 0; color: #111827;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">メールアドレス:</td>
                  <td style="padding: 8px 0; color: #111827;">${email}</td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">電話番号:</td>
                  <td style="padding: 8px 0; color: #111827;">${phone}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">件名:</td>
                  <td style="padding: 8px 0; color: #111827;">${subject}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">受信日時:</td>
                  <td style="padding: 8px 0; color: #111827;">${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</td>
                </tr>
              </table>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #374151; margin-bottom: 15px;">お問い合わせ内容</h3>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid #4f46e5;">
                <p style="color: #111827; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
              <p>このメールは株式会社Codelith公式サイトのお問い合わせフォームから送信されました</p>
              <p>お客様への返信をお忘れなく</p>
            </div>
          </div>
        </div>
      `
    };

    // 发送邮件
    await transporter.sendMail(mailOptions);

    // 返回成功响应
    res.status(200).json({ 
      success: true, 
      message: 'メールを送信いたしました。折り返しご連絡させていただきます。' 
    });

  } catch (error) {
    console.error('メール送信失敗:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    res.status(500).json({ 
      error: 'メール送信に失敗いたしました。しばらく時間をおいてから再度お試いいただくか、直接お電話にてお問い合わせください。',
      details: error.message
    });
  }
}
