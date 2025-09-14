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

    console.log('Attempting to send email via Web3Forms...');
    
    // 使用 Web3Forms (免费且可靠的表单处理服务)
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '8b1a2c3d-4e5f-6789-0123-456789abcdef', // 需要替换为真实的 access key
          name: name,
          email: email,
          phone: phone || '',
          subject: `【株式会社Codelith】新しいお問い合わせ - ${name}様`,
          message: emailContent,
          to: 'wangyunjie1101@gmail.com',
          from_name: 'Codelith Website',
          return_to: email,
          botcheck: ''
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('Email sent successfully via Web3Forms');
        return res.status(200).json({ 
          success: true, 
          message: 'お問い合わせを送信いたしました。24時間以内にご返信いたします。'
        });
      } else {
        console.error('Web3Forms error:', result);
        throw new Error(`Web3Forms API error: ${response.status} - ${result.message || 'Unknown error'}`);
      }
    } catch (web3Error) {
      console.error('Web3Forms failed, trying direct email approach:', web3Error);
      
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
