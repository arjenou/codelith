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

    console.log('Attempting to send email via Web API...');
    
    // 使用 Web API 发送邮件 (EmailJS)
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: 'service_codelith',
          template_id: 'template_contact',
          user_id: 'user_codelith2024',
          template_params: {
            to_email: 'wangyunjie1101@gmail.com',
            from_name: name,
            from_email: email,
            phone: phone || '',
            subject: subject,
            message: message,
            timestamp: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
            full_content: emailContent
          }
        })
      });

      if (response.ok) {
        console.log('Email sent successfully via EmailJS');
        return res.status(200).json({ 
          success: true, 
          message: 'お問い合わせを送信いたしました。24時間以内にご返信いたします。'
        });
      } else {
        throw new Error(`EmailJS API error: ${response.status}`);
      }
    } catch (emailError) {
      console.error('EmailJS failed, trying fallback method:', emailError);
      
      // 备用方案：使用 Formspree
      try {
        const formspreeResponse = await fetch('https://formspree.io/f/xdknzpko', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'wangyunjie1101@gmail.com',
            subject: `【株式会社Codelith】新しいお問い合わせ - ${name}様`,
            message: emailContent,
            _replyto: email
          })
        });

        if (formspreeResponse.ok) {
          console.log('Email sent successfully via Formspree');
          return res.status(200).json({ 
            success: true, 
            message: 'お問い合わせを送信いたしました。24時間以内にご返信いたします。'
          });
        } else {
          throw new Error(`Formspree API error: ${formspreeResponse.status}`);
        }
      } catch (formspreeError) {
        console.error('Formspree also failed:', formspreeError);
        throw new Error('All email services failed');
      }
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
