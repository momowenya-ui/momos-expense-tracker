import { Resend } from 'resend'

// ============= 邮件模板函数 =============

function getWelcomeEmailTemplate(username: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #fffbf7 0%, #ffe0f0 100%); margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 8px 24px rgba(255, 152, 120, 0.15); overflow: hidden; }
          .header { background: linear-gradient(to right, #fb9878, #ffc9e3); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 32px; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; }
          .content { padding: 40px; }
          .content h2 { color: #e97047; margin-top: 0; }
          .content p { color: #666; line-height: 1.8; font-size: 16px; }
          .feature { background: #fef9f5; border-left: 4px solid #fb9878; padding: 15px; margin: 15px 0; border-radius: 8px; }
          .feature-title { font-weight: bold; color: #e97047; }
          .cta-button { display: inline-block; background: #fb9878; color: white; padding: 12px 30px; border-radius: 20px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .footer { background: #fef0eb; padding: 20px; text-align: center; color: #999; font-size: 14px; border-top: 1px solid #fdd9cc; }
          .emoji { font-size: 20px; margin-right: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💕 欢迎加入末末记账本！</h1>
            <p>一个温暖可爱的消费日记</p>
          </div>
          
          <div class="content">
            <h2>嗨，${username}～</h2>
            
            <p>恭喜你成功注册了末末记账本！这是属于你的专属记账空间。</p>
            
            <div class="feature">
              <span class="emoji">📝</span>
              <span class="feature-title">开始记录</span>
              <p>像写日记一样随性地记录每一笔消费，记下每个决定的瞬间。</p>
            </div>
            
            <div class="feature">
              <span class="emoji">📊</span>
              <span class="feature-title">智能分析</span>
              <p>每周自动生成报告，查看消费趋势，发现消费习惯。</p>
            </div>
            
            <div class="feature">
              <span class="emoji">💡</span>
              <span class="feature-title">个性化建议</span>
              <p>根据你的消费数据，获得贴心的理财建议。</p>
            </div>
            
            <div class="feature">
              <span class="emoji">🔐</span>
              <span class="feature-title">隐私保护</span>
              <p>所有数据存储在你的浏览器，完全属于你自己。</p>
            </div>
            
            <p style="margin-top: 30px;">
              <a href="https://momos-expense-tracker.vercel.app" class="cta-button">
                ✨ 立即开始记账
              </a>
            </p>
            
            <p>
              💝 <strong>小贴士：</strong> 建议从今天开始记录，坚持一周就能看到有趣的数据分析。开始吧！
            </p>
          </div>
          
          <div class="footer">
            <p>📧 这是一封自动发送的邮件，请不要直接回复</p>
            <p>© 2026 末末记账本 | 用心记录每一笔，生活更有计划</p>
          </div>
        </div>
      </body>
    </html>
  `
}

function getWeeklyReportEmailTemplate(
  username: string,
  weekData: {
    weekStart: string
    weekEnd: string
    totalExpense: number
    totalIncome: number
    balance: number
    topCategory: { emoji: string; name: string; amount: number } | null
  }
): string {
  const balanceColor = weekData.balance >= 0 ? '#4ade80' : '#fb9878'
  const topCategoryText = weekData.topCategory
    ? `你本周在<strong>${weekData.topCategory.emoji} ${weekData.topCategory.name}</strong>上花费最多，共 <strong>¥${weekData.topCategory.amount.toFixed(2)}</strong>`
    : '你本周还没有记录消费'

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #fffbf7 0%, #ffe0f0 100%); margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 8px 24px rgba(255, 152, 120, 0.15); overflow: hidden; }
          .header { background: linear-gradient(to right, #fb9878, #ffc9e3); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 32px; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; }
          .content { padding: 40px; }
          .stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 20px 0; }
          .stat-box { background: #fef9f5; padding: 15px; border-radius: 12px; text-align: center; border: 2px solid #fdd9cc; }
          .stat-label { color: #999; font-size: 14px; margin-bottom: 5px; }
          .stat-value { font-size: 24px; font-weight: bold; color: #e97047; }
          .stat-value.balance { color: ${balanceColor}; }
          .insight { background: #ffe4e1; border-left: 4px solid #fb9878; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .insight-title { font-weight: bold; color: #e97047; margin-bottom: 10px; }
          .cta-button { display: inline-block; background: #fb9878; color: white; padding: 12px 30px; border-radius: 20px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .footer { background: #fef0eb; padding: 20px; text-align: center; color: #999; font-size: 14px; border-top: 1px solid #fdd9cc; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 周报告</h1>
            <p>${weekData.weekStart} 至 ${weekData.weekEnd}</p>
          </div>
          
          <div class="content">
            <h2>嗨，${username}～</h2>
            <p>这是你上周的消费汇总报告，一起来看看吧！</p>
            
            <div class="stats">
              <div class="stat-box">
                <div class="stat-label">📉 本周支出</div>
                <div class="stat-value">¥${weekData.totalExpense.toFixed(2)}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">📈 本周收入</div>
                <div class="stat-value" style="color: #4ade80;">¥${weekData.totalIncome.toFixed(2)}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">💰 周结余</div>
                <div class="stat-value balance">¥${weekData.balance.toFixed(2)}</div>
              </div>
            </div>
            
            <div class="insight">
              <div class="insight-title">💡 本周洞察</div>
              <p>${topCategoryText}</p>
              <p style="margin-bottom: 0;">${
                weekData.balance >= 0
                  ? '👍 很棒！你本周收支平衡，继续保持这个好习惯！'
                  : '⚠️ 本周支出超过收入，下周要更加合理安排消费哦～'
              }</p>
            </div>
            
            <p style="text-align: center;">
              <a href="https://momos-expense-tracker.vercel.app" class="cta-button">
                📱 查看详细报告
              </a>
            </p>
          </div>
          
          <div class="footer">
            <p>📧 这是你的每周自动邮件报告</p>
            <p>© 2026 末末记账本 | 为每一笔消费记录，为每一个选择负责</p>
          </div>
        </div>
      </body>
    </html>
  `
}

function getMonthlyReportEmailTemplate(
  username: string,
  monthData: {
    month: string
    totalExpense: number
    totalIncome: number
    balance: number
    topCategory: { emoji: string; name: string; amount: number } | null
    transactionCount: number
  }
): string {
  const balanceColor = monthData.balance >= 0 ? '#4ade80' : '#fb9878'
  const topCategoryText = monthData.topCategory
    ? `感谢你记录了 ${monthData.transactionCount} 笔交易。其中，你在<strong>${monthData.topCategory.emoji} ${monthData.topCategory.name}</strong>上花费最多，共 <strong>¥${monthData.topCategory.amount.toFixed(2)}</strong>`
    : `感谢你记录了 ${monthData.transactionCount} 笔交易`

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #fffbf7 0%, #ffe0f0 100%); margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 8px 24px rgba(255, 152, 120, 0.15); overflow: hidden; }
          .header { background: linear-gradient(to right, #fb9878, #ffc9e3); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 32px; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; }
          .content { padding: 40px; }
          .stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 20px 0; }
          .stat-box { background: #fef9f5; padding: 15px; border-radius: 12px; text-align: center; border: 2px solid #fdd9cc; }
          .stat-label { color: #999; font-size: 14px; margin-bottom: 5px; }
          .stat-value { font-size: 24px; font-weight: bold; color: #e97047; }
          .stat-value.balance { color: ${balanceColor}; }
          .insight { background: #fff0f6; border-left: 4px solid #ffc9e3; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .insight-title { font-weight: bold; color: #e97047; margin-bottom: 10px; }
          .insight p { margin: 10px 0; color: #666; }
          .cta-button { display: inline-block; background: #fb9878; color: white; padding: 12px 30px; border-radius: 20px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .footer { background: #fef0eb; padding: 20px; text-align: center; color: #999; font-size: 14px; border-top: 1px solid #fdd9cc; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📈 月报告</h1>
            <p>${monthData.month}</p>
          </div>
          
          <div class="content">
            <h2>嗨，${username}～</h2>
            <p>这是你本月的消费总结，让我们一起品味这个月的经济生活！</p>
            
            <div class="stats">
              <div class="stat-box">
                <div class="stat-label">📉 本月支出</div>
                <div class="stat-value">¥${monthData.totalExpense.toFixed(2)}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">📈 本月收入</div>
                <div class="stat-value" style="color: #4ade80;">¥${monthData.totalIncome.toFixed(2)}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">💰 月结余</div>
                <div class="stat-value balance">¥${monthData.balance.toFixed(2)}</div>
              </div>
            </div>
            
            <div class="insight">
              <div class="insight-title">💡 月度总结</div>
              <p>${topCategoryText}</p>
              <p>${
                monthData.balance >= 0
                  ? '🌟 很棒！你本月开源节流，理财意识很强！'
                  : '💭 记账很认真呢！继续调整，下月会更好！'
              }</p>
              <p style="margin-bottom: 0;">希望末末记账本能帮助你养成更好的消费习惯～</p>
            </div>
            
            <p style="text-align: center;">
              <a href="https://momos-expense-tracker.vercel.app" class="cta-button">
                📱 查看完整数据
              </a>
            </p>
          </div>
          
          <div class="footer">
            <p>📧 这是你的每月自动邮件报告</p>
            <p>© 2026 末末记账本 | 用心记录，用心生活</p>
          </div>
        </div>
      </body>
    </html>
  `
}

// ============= API 处理器 =============

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // ✅ Initialize Resend HERE on the server-side
  const resend = new Resend(process.env.RESEND_API_KEY)

  const { type, email, username, weekData, monthData } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    let result

    switch (type) {
      case 'welcome':
        result = await resend.emails.send({
          from: 'noreply@momos-expense-tracker.com',
          to: email,
          subject: '🎉 欢迎加入末末记账本家族！',
          html: getWelcomeEmailTemplate(username),
        })
        break

      case 'weekly':
        if (!weekData) {
          return res.status(400).json({ error: 'weekData is required for weekly email' })
        }
        result = await resend.emails.send({
          from: 'noreply@momos-expense-tracker.com',
          to: email,
          subject: `📊 末末记账本周报 - ${weekData.weekStart} 至 ${weekData.weekEnd}`,
          html: getWeeklyReportEmailTemplate(username, weekData),
        })
        break

      case 'monthly':
        if (!monthData) {
          return res.status(400).json({ error: 'monthData is required for monthly email' })
        }
        result = await resend.emails.send({
          from: 'noreply@momos-expense-tracker.com',
          to: email,
          subject: `📈 末末记账本月报 - ${monthData.month}`,
          html: getMonthlyReportEmailTemplate(username, monthData),
        })
        break

      default:
        return res.status(400).json({ error: 'Invalid email type' })
    }

    console.log(`[${type}] Email sent to ${email}:`, result)
    return res.status(200).json({
      success: true,
      message: `${type} email sent successfully`,
      result,
    })
  } catch (error) {
    console.error('[send-email] Error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    })
  }
}
