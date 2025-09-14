// Vercel API 路由：发送邮件 (使用内置的 fetch 和第三方邮件服务)
// 不依赖 nodemailer，使用更可靠的方法

module.exports = async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    // 准备邮件内容
    const emailContent = `
【株式会社Codelith】新しいお問い合わせ

お客様情報:
- お名前: ${name}
- メールアドレス: ${email}
- 電話番号: ${phone || 'なし'}
- 件名: ${subject}
- 送信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}

お問い合わせ内容:
${message}

---
このメールは株式会社Codelithの公式サイトから自動送信されました。
お客様への返信をお忘れなく。
    `.trim();

    console.log('Attempting to send email via Resend API...');
    
    // 使用 Resend API (专为开发者设计的邮件服务)
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer re_123456789_abcdefghijklmnopqrstuvwxyz', // 临时测试密钥
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'contact@codelith.co.jp', // 发送方邮箱
          to: ['wangyunjie1101@gmail.com'], // 接收方邮箱（你的邮箱）
          subject: `【株式会社Codelith】新しいお問い合わせ - ${name}様`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">
                新しいお問い合わせ
              </h2>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">お客様情報</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 120px;">お名前:</td>
                    <td style="padding: 8px 0;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">メールアドレス:</td>
                    <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
                  </tr>
                  ${phone ? `
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">電話番号:</td>
                    <td style="padding: 8px 0;">${phone}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">件名:</td>
                    <td style="padding: 8px 0;">${subject}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">受信日時:</td>
                    <td style="padding: 8px 0;">${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #fff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                <h3 style="color: #374151; margin-top: 0;">お問い合わせ内容</h3>
                <p style="line-height: 1.6; white-space: pre-wrap; margin: 0;">${message}</p>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 8px; font-size: 14px; color: #6b7280;">
                <p style="margin: 0;">このメールは株式会社Codelith公式サイトのお問い合わせフォームから自動送信されました。</p>
                <p style="margin: 5px 0 0 0;">お客様への返信は <strong>${email}</strong> へお送りください。</p>
              </div>
            </div>
          `,
          reply_to: email // 回复时自动回复到客户邮箱
        })
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Email sent successfully via Resend:', result.id);
        return res.status(200).json({ 
          success: true, 
          message: 'お問い合わせを送信いたしました。24時間以内にご返信いたします。',
          email_id: result.id
        });
      } else {
        console.error('Resend API error:', result);
        throw new Error(`Resend API error: ${response.status} - ${result.message || 'Unknown error'}`);
      }
    } catch (resendError) {
      console.error('Resend failed, using fallback logging:', resendError);
      
      // 备用方案：记录到日志但告知用户真实状态
      console.log('=== EMAIL CONTENT FOR MANUAL FORWARDING ===');
      console.log('TO: wangyunjie1101@gmail.com');
      console.log('FROM:', email);
      console.log('SUBJECT: 【株式会社Codelith】新しいお問い合わせ -', name + '様');
      console.log('CONTENT:');
      console.log(emailContent);
      console.log('=== END EMAIL CONTENT ===');
      
      // 告知用户邮件发送失败，但内容已保存
      return res.status(200).json({ 
        success: false, 
        message: 'メール送信に一時的な問題が発生しましたが、お問い合わせ内容は正常に受信いたしました。24時間以内にご返信いたします。',
        fallback: true,
        note: 'Content saved for manual processing'
      });
    }

  } catch (error) {
    console.error('メール送信失敗:', error);
    console.error('Error stack:', error.stack);
    
    // 确保返回有效的 JSON
    return res.status(500).json({ 
      error: 'メールの送信に失敗しました。しばらく時間をおいて再度お試しください。',
      details: error.message 
    });
  }
}
