import { Resend } from 'resend'
import { getWelcomeEmailTemplate, getWeeklyReportEmailTemplate, getMonthlyReportEmailTemplate } from '../src/lib/email'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // ✅ Initialize Resend HERE on the server-side, not in src/ files
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
