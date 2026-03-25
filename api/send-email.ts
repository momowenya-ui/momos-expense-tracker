import { sendWelcomeEmail, sendWeeklyReportEmail, sendMonthlyReportEmail } from '../../lib/email'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { type, email, username, weekData, monthData } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    let result

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(email, username)
        break

      case 'weekly':
        if (!weekData) {
          return res.status(400).json({ error: 'weekData is required for weekly email' })
        }
        result = await sendWeeklyReportEmail(email, username, weekData)
        break

      case 'monthly':
        if (!monthData) {
          return res.status(400).json({ error: 'monthData is required for monthly email' })
        }
        result = await sendMonthlyReportEmail(email, username, monthData)
        break

      default:
        return res.status(400).json({ error: 'Invalid email type' })
    }

    return res.status(200).json({
      success: true,
      message: `${type} email sent successfully`,
      result,
    })
  } catch (error) {
    console.error('Email sending error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    })
  }
}
