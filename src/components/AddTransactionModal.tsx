import React, { useState } from 'react'
import { TransactionType } from '../types'
import { DEFAULT_CATEGORIES, addTransaction, formatDate } from '../utils'

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose }) => {
  const [type, setType] = useState<TransactionType>('expense')
  const [categoryId, setCategoryId] = useState(DEFAULT_CATEGORIES[0].id)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(formatDate(new Date()))

  const selectedCategory = DEFAULT_CATEGORIES.find(c => c.id === categoryId)!

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('请输入有效的金额')
      return
    }

    addTransaction({
      date,
      categoryId,
      category: selectedCategory.name,
      emoji: selectedCategory.emoji,
      amount: Number(amount),
      type,
      note,
    })

    // Reset form
    setAmount('')
    setNote('')
    setType('expense')
    setCategoryId(DEFAULT_CATEGORIES[0].id)
    setDate(formatDate(new Date()))
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="card-cute w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-warm-pink-700 mb-6 flex items-center gap-2">
          <span className="text-3xl">✨</span> 记录一笔
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-3 rounded-2xl font-semibold transition ${
                type === 'expense'
                  ? 'bg-warm-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              💸 支出
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-3 rounded-2xl font-semibold transition ${
                type === 'income'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              💰 收入
            </button>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-warm-pink-700 mb-2">📅 日期</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="input-cute w-full"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-warm-pink-700 mb-2">
              🏷️ 分类
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DEFAULT_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`p-3 rounded-2xl text-center transition ${
                    categoryId === cat.id
                      ? 'ring-2 ring-warm-pink-500 bg-soft-pink/40'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.emoji}</div>
                  <div className="text-xs font-semibold text-gray-700">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-warm-pink-700 mb-2">
              💵 金额
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="input-cute w-full text-lg"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-semibold text-warm-pink-700 mb-2">
              📝 备注 (可选)
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="写下今天的小碎碎念..."
              className="input-cute w-full resize-none h-24"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              取消
            </button>
            <button type="submit" className="btn-primary flex-1">
              ✨ 保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
