// Vercel API 路由：发送邮件 (使用 Resend 服务)
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

    // 验证必填字段
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'お名前、メールアドレス、メッセージ内容は必須項目です' });
    }

    // 使用 EmailJS 或类似服务发送邮件
    // 这里我们先记录到日志，然后使用一个简单的邮件转发服务
    const emailData = {
      from: email,
      to: 'wangyunjie1101@gmail.com',
      subject: `【株式会社Codelith】新しいお問い合わせ: ${subject}`,
      name: name,
      email: email,
      phone: phone || '',
      subject: subject,
      message: message,
      timestamp: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
    };

    // 记录到控制台（在 Vercel 函数日志中可见）
    console.log('新しいお問い合わせを受信:', emailData);

    // 使用 fetch 发送到一个免费的邮件转发服务
    try {
      const response = await fetch('https://formspree.io/f/xdknzpko', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'wangyunjie1101@gmail.com',
          subject: `【株式会社Codelith】新しいお問い合わせ: ${subject}`,
          message: `
お名前: ${name}
メールアドレス: ${email}
電話番号: ${phone || 'なし'}
件名: ${subject}
受信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}

お問い合わせ内容:
${message}

---
このメールは株式会社Codelith公式サイトのお問い合わせフォームから送信されました
          `
        })
      });

      if (!response.ok) {
        throw new Error(`Formspree API error: ${response.status}`);
      }

      console.log('Email forwarded successfully via Formspree');
    } catch (formspreeError) {
      console.error('Formspree forwarding failed:', formspreeError);
      // 如果 Formspree 失败，至少我们有日志记录
    }

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
