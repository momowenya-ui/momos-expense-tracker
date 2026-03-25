import React from 'react'
import { Transaction } from '../types'
import { formatDate } from '../utils'

interface DailyRecordProps {
  date: string
  transactions: Transaction[]
  onDeleteTransaction: (id: string) => void
}

export const DailyRecord: React.FC<DailyRecordProps> = ({
  date,
  transactions,
  onDeleteTransaction,
}) => {
  const dateObj = new Date(date)
  const dayName = dateObj.toLocaleDateString('zh-CN', {
    weekday: 'long',
    month: '2-digit',
    day: '2-digit',
  })

  const expenses = transactions.filter(t => t.type === 'expense')
  const incomes = transactions.filter(t => t.type === 'income')
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0)
  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense

  return (
    <div className="card-cute mb-6">
      <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-soft-pink/30">
        <div>
          <h3 className="text-lg font-bold text-warm-pink-700">{dayName}</h3>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-500">支出</p>
              <p className="text-lg font-bold text-warm-pink-600">¥{totalExpense.toFixed(2)}</p>
            </div>
            {totalIncome > 0 && (
              <div>
                <p className="text-xs text-gray-500">收入</p>
                <p className="text-lg font-bold text-green-600">¥{totalIncome.toFixed(2)}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">结余</p>
              <p className={`text-lg font-bold ${balance >= 0 ? 'text-green-500' : 'text-warm-pink-600'}`}>
                ¥{balance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-warm-pink-300 text-lg">还没有记录呢 💭</p>
          <p className="text-gray-400 text-sm">试试添加你的第一笔账目吧～</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map(t => (
            <div
              key={t.id}
              className="flex items-center justify-between p-3 bg-warm-pink-50 rounded-2xl hover:bg-warm-pink-100 transition group"
            >
              <div className="flex-1 flex items-center gap-3">
                <div className="text-2xl">{t.emoji}</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{t.category}</p>
                  {t.note && <p className="text-sm text-gray-500">{t.note}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className={`text-lg font-bold ${t.type === 'expense' ? 'text-warm-pink-600' : 'text-green-600'}`}>
                    {t.type === 'expense' ? '-' : '+'}¥{t.amount.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteTransaction(t.id)}
                  className="opacity-0 group-hover:opacity-100 transition text-red-400 hover:text-red-600"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
