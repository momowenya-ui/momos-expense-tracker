import React, { useState, useEffect } from 'react'
import { Transaction, User } from './types'
import { getStorageData, deleteTransaction, getWeeklySummary, getMonthlySummary, getCurrentUser, logout } from './utils'
import { Login } from './components/Login'
import { UserProfile } from './components/UserProfile'
import { AddTransactionModal } from './components/AddTransactionModal'
import { DailyRecord } from './components/DailyRecord'
import { Report } from './components/Report'

type Tab = 'home' | 'week' | 'month'
type View = 'app' | 'profile'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [view, setView] = useState<View>('app')

  useEffect(() => {
    // Load user from storage
    const currentUser = getCurrentUser()
    setUser(currentUser)

    // Load data from storage
    const data = getStorageData()
    setTransactions(data)
  }, [])

  const handleLoginSuccess = (newUser: User) => {
    setUser(newUser)
  }

  const handleAddTransaction = () => {
    setIsModalOpen(false)
    // Reload data after adding
    const data = getStorageData()
    setTransactions(data)
  }

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id)
    const data = getStorageData()
    setTransactions(data)
  }

  const handleLogout = () => {
    setUser(null)
    setView('app')
  }

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser)
  }

  // If not logged in, show login page
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  // If viewing profile, show profile page
  if (view === 'profile') {
    return (
      <UserProfile
        user={user}
        onBack={() => setView('app')}
        onLogout={handleLogout}
        onUpdateUser={handleUpdateUser}
      />
    )
  }

  // Group transactions by date (newest first)
  const groupedByDate = new Map<string, Transaction[]>()
  transactions.forEach(t => {
    if (!groupedByDate.has(t.date)) {
      groupedByDate.set(t.date, [])
    }
    groupedByDate.get(t.date)!.push(t)
  })

  const sortedDates = Array.from(groupedByDate.keys()).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime()
  })

  const weeklySummary = getWeeklySummary()
  const monthlySummary = getMonthlySummary()

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-warm-pink-400 to-soft-pink/80 backdrop-blur text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <span className="text-4xl">💕</span> 末末记账本
              </h1>
              <p className="text-pink-100 text-sm">
                嗨，{user.username}～用心记录每一笔，生活更加有计划
              </p>
            </div>
            <button
              onClick={() => setView('profile')}
              className="flex flex-col items-center gap-2 hover:opacity-80 transition"
            >
              <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full border-2 border-white" />
              <span className="text-xs whitespace-nowrap">👤 我的</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-20 z-30 bg-white/80 backdrop-blur border-b-2 border-soft-pink/30 shadow-md">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-0">
            {[
              { id: 'home' as Tab, label: '📝 今日记录', icon: '📝' },
              { id: 'week' as Tab, label: '📊 周报告', icon: '📊' },
              { id: 'month' as Tab, label: '📈 月报告', icon: '📈' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-4 font-semibold transition border-b-4 ${
                  activeTab === tab.id
                    ? 'border-warm-pink-500 text-warm-pink-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div>
            {sortedDates.length === 0 ? (
              <div className="card-cute text-center py-12">
                <div className="text-5xl mb-4">📓</div>
                <h2 className="text-2xl font-bold text-warm-pink-700 mb-2">还没开始记账呀～</h2>
                <p className="text-gray-600 mb-6">就像写日记一样，记录你每一笔消费，让生活更有趣！</p>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                  ✨ 开始记录
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-warm-pink-700">📝 我的记录</h2>
                  <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                    ➕ 新增记录
                  </button>
                </div>

                {sortedDates.map(date => (
                  <DailyRecord
                    key={date}
                    date={date}
                    transactions={groupedByDate.get(date) || []}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'week' && (
          <Report summary={weeklySummary} title="本周报告" userEmail={user.email} username={user.username} isMonthly={false} />
        )}

        {activeTab === 'month' && (
          <Report summary={monthlySummary} title="本月报告" userEmail={user.email} username={user.username} isMonthly={true} />
        )}
      </div>

      {/* Floating Action Button */}
      {activeTab === 'home' && sortedDates.length > 0 && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-warm-pink-500 to-warm-pink-600 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition flex items-center justify-center text-3xl hover:from-warm-pink-600 hover:to-warm-pink-700"
        >
          ➕
        </button>
      )}

      {/* Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          handleAddTransaction()
        }}
      />
    </div>
  )
}
