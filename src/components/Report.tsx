import React, { useState } from 'react'
import { WeeklySummary } from '../types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { sendWeeklyReportEmailAsync, sendMonthlyReportEmailAsync } from '../utils'

interface ReportProps {
  summary: WeeklySummary
  title: string
  userEmail?: string
  username?: string
  isMonthly?: boolean
}

const COLORS = ['#f99878', '#f5845f', '#e97047', '#c65a38', '#a3482d', '#fcc4b0', '#fdd9cc', '#fbae94']

export const Report: React.FC<ReportProps> = ({ summary, title, userEmail, username, isMonthly }) => {
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSendEmail = async () => {
    if (!userEmail || !username) {
      alert('请先登陆')
      return
    }

    setSendingEmail(true)

    try {
      const topCategory = summary.categoryBreakdown[0] || null
      let success = false

      if (isMonthly) {
        const monthStr = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
        success = await sendMonthlyReportEmailAsync(userEmail, username, {
          month: monthStr,
          totalExpense: summary.totalExpense,
          totalIncome: summary.totalIncome,
          balance: summary.balance,
          topCategory: topCategory
            ? { emoji: topCategory.emoji, name: topCategory.category, amount: topCategory.amount }
            : null,
          transactionCount: summary.dailyBreakdown.reduce((sum, d) => sum + d.transactions.length, 0),
        })
      } else {
        success = await sendWeeklyReportEmailAsync(userEmail, username, {
          weekStart: summary.weekStart,
          weekEnd: summary.weekEnd,
          totalExpense: summary.totalExpense,
          totalIncome: summary.totalIncome,
          balance: summary.balance,
          topCategory: topCategory
            ? { emoji: topCategory.emoji, name: topCategory.category, amount: topCategory.amount }
            : null,
        })
      }

      if (success) {
        setEmailSent(true)
        setTimeout(() => setEmailSent(false), 3000)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('邮件发送失败，请重试')
    } finally {
      setSendingEmail(false)
    }
  }

  const chartData = summary.dailyBreakdown.map(daily => ({
    date: daily.date.split('-')[2],
    支出: daily.expenses,
    收入: daily.income,
  }))

  const pieData = summary.categoryBreakdown.map(cat => ({
    name: `${cat.emoji} ${cat.category}`,
    value: parseFloat(cat.amount.toFixed(2)),
  }))

  const getAdvice = () => {
    const avgDaily = summary.totalExpense / summary.dailyBreakdown.length || 0
    const tips = []

    if (summary.totalIncome === 0) {
      tips.push('💡 你这周似乎还没有记录收入呢，别忘了记录哦！')
    }

    if (summary.totalExpense > summary.totalIncome && summary.totalIncome > 0) {
      tips.push('⚠️ 你这周的支出超过了收入，下周要更加节制哦！')
    }

    if (summary.categoryBreakdown.length > 0) {
      const top = summary.categoryBreakdown[0]
      tips.push(`📊 你这周在${top.emoji} ${top.category}上花费最多 ¥${top.amount.toFixed(2)}，占比 ${top.percentage}%`)

      if (top.percentage > 50) {
        tips.push(`⚠️ 在 ${top.category} 上支出占比过高，建议平衡一下其他开支呢～`)
      }
    }

    if (avgDaily > 100) {
      tips.push(`⚠️ 你的日均支出为 ¥${avgDaily.toFixed(2)}，有点高哦，可以试试控制一下～`)
    } else if (avgDaily > 50) {
      tips.push(`👍 你的日均支出 ¥${avgDaily.toFixed(2)}，保持得不错呢！`)
    } else {
      tips.push(`🌟 你的消费很理性，日均支出仅 ¥${avgDaily.toFixed(2)}，棒极了！`)
    }

    return tips.length > 0 ? tips : ['💝 保持良好的消费习惯，继续加油！']
  }

  return (
    <div className="space-y-6">
      <div className="card-cute">
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-soft-pink/30">
          <div>
            <h2 className="text-2xl font-bold text-warm-pink-700 mb-2">📊 {title}</h2>
            <p className="text-sm text-gray-500">
              {summary.weekStart} 至 {summary.weekEnd}
            </p>
          </div>
          {userEmail && username && (
            <div className="relative">
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail}
                className={`btn-secondary whitespace-nowrap ${sendingEmail ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {sendingEmail ? '📧 发送中...' : '📧 邮件'}
              </button>
              {emailSent && (
                <div className="absolute top-full right-0 mt-2 bg-green-500 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
                  ✅ 邮件已发送！
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-warm-pink-50 rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">总支出</p>
            <p className="text-2xl font-bold text-warm-pink-600">¥{summary.totalExpense.toFixed(2)}</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">总收入</p>
            <p className="text-2xl font-bold text-green-600">¥{summary.totalIncome.toFixed(2)}</p>
          </div>
          <div className={`rounded-2xl p-4 text-center ${summary.balance >= 0 ? 'bg-blue-50' : 'bg-red-50'}`}>
            <p className="text-sm text-gray-600 mb-1">结余</p>
            <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              ¥{summary.balance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Daily Chart */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">📈 日消费趋势</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffc9e3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '2px solid #ffc9e3' }} />
                <Legend />
                <Bar dataKey="支出" fill="#fb9878" radius={[8, 8, 0, 0]} />
                <Bar dataKey="收入" fill="#4ade80" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400">暂无数据</p>
          )}
        </div>

        {/* Category Breakdown */}
        {summary.categoryBreakdown.length > 0 && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-4">🍰 分类占比</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-4">📋 分类详情</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {summary.categoryBreakdown.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-warm-pink-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cat.emoji}</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-800">{cat.category}</p>
                        <p className="text-xs text-gray-500">{cat.count} 笔</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-warm-pink-600">¥{cat.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{cat.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advice Section */}
      <div className="card-cute bg-gradient-to-br from-soft-pink/20 to-warm-pink-100/20">
        <h3 className="text-lg font-bold text-warm-pink-700 mb-4">💭 智能建议</h3>
        <div className="space-y-2">
          {getAdvice().map((tip, idx) => (
            <p key={idx} className="text-gray-700 text-sm leading-relaxed">
              {tip}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
