import { Transaction, Category, WeeklySummary, CategoryBreakdown, DailySummary, User, AuthState } from './types'

// 默认分类
export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '餐饮', emoji: '🍜', color: '#fb9878' },
  { id: '2', name: '交通', emoji: '🚗', color: '#f5845f' },
  { id: '3', name: '购物', emoji: '🛍️', color: '#e97047' },
  { id: '4', name: '娱乐', emoji: '🎬', color: '#c65a38' },
  { id: '5', name: '生活', emoji: '🏠', color: '#a3482d' },
  { id: '6', name: '学习', emoji: '📚', color: '#fcc4b0' },
  { id: '7', name: '医疗', emoji: '⚕️', color: '#fdd9cc' },
  { id: '8', name: '工作', emoji: '💼', color: '#fbae94' },
]

// LocalStorage 工具函数
const STORAGE_KEY = 'momos_expense_tracker_data'
const USER_STORAGE_KEY = 'momos_user_auth'
const USERS_DB_KEY = 'momos_users_database'

// ========== 用户认证管理 ==========

// 生成头像背景色
export const generateAvatarColor = (email: string): string => {
  const colors = [
    '#FFB6C1', // lightpink
    '#FFB347', // peachpuff
    '#DDA0DD', // plum
    '#B0E0E6', // powderblue
    '#F0E68C', // khaki
    '#FFE4E1', // mistyrose
    '#F5DEB3', // wheat
  ]
  const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

// 生成用户头像
export const generateAvatar = (email: string): string => {
  const initial = email.charAt(0).toUpperCase()
  const bgColor = generateAvatarColor(email).replace('#', '')
  return `https://ui-avatars.com/api/?name=${initial}&background=${bgColor}&color=fff&bold=true&size=128&rounded=true`
}

// 新增用户
export const registerUser = (email: string, username: string): User | null => {
  if (!email || !email.includes('@')) {
    return null
  }

  const users = getUsersDatabase()
  if (users.some(u => u.email === email)) {
    return null // 邮箱已存在
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    username: username || email.split('@')[0],
    avatar: generateAvatar(email),
    bio: '',
    joinDate: new Date().toISOString().split('T')[0],
  }

  users.push(newUser)
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users))
  setCurrentUser(newUser)
  return newUser
}

// 邮箱登陆
export const loginWithEmail = (email: string): User | null => {
  if (!email || !email.includes('@')) {
    return null
  }

  const users = getUsersDatabase()
  const user = users.find(u => u.email === email)

  if (user) {
    setCurrentUser(user)
    return user
  }

  return null
}

// 获取用户数据库
const getUsersDatabase = (): User[] => {
  try {
    const data = localStorage.getItem(USERS_DB_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// 获取当前登陆的用户
export const getCurrentUser = (): User | null => {
  try {
    const data = localStorage.getItem(USER_STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

// 设置当前登陆的用户
export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(USER_STORAGE_KEY)
  }
}

// 注销用户
export const logout = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY)
}

// 更新用户信息
export const updateUserProfile = (updates: Partial<User>): User | null => {
  const user = getCurrentUser()
  if (!user) return null

  const users = getUsersDatabase()
  const index = users.findIndex(u => u.id === user.id)
  if (index === -1) return null

  const updatedUser = { ...users[index], ...updates, id: users[index].id }
  users[index] = updatedUser
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users))
  setCurrentUser(updatedUser)
  return updatedUser
}

// ========== 交易管理 ==========

export const getStorageData = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const saveStorageData = (transactions: Transaction[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
}

export const addTransaction = (transaction: Omit<Transaction, 'id'>): Transaction => {
  const transactions = getStorageData()
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
  }
  transactions.push(newTransaction)
  saveStorageData(transactions)
  return newTransaction
}

export const deleteTransaction = (id: string): void => {
  const transactions = getStorageData().filter(t => t.id !== id)
  saveStorageData(transactions)
}

export const updateTransaction = (id: string, updates: Partial<Transaction>): void => {
  const transactions = getStorageData()
  const index = transactions.findIndex(t => t.id === id)
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updates }
    saveStorageData(transactions)
  }
}

// 获取当周的起始日期
export const getWeekStartDate = (date: Date = new Date()): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

// 格式化日期
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

// 获取周报告
export const getWeeklySummary = (startDate?: Date): WeeklySummary => {
  const start = getWeekStartDate(startDate)
  const weekEnd = new Date(start)
  weekEnd.setDate(weekEnd.getDate() + 6)

  const transactions = getStorageData()
  const weekTransactions = transactions.filter(t => {
    const tDate = new Date(t.date)
    return tDate >= start && tDate <= weekEnd
  })

  // 按日期分组
  const dailyBreakdown: DailySummary[] = []
  const dateMap = new Map<string, DailySummary>()

  weekTransactions.forEach(t => {
    if (!dateMap.has(t.date)) {
      dateMap.set(t.date, {
        date: t.date,
        expenses: 0,
        income: 0,
        transactions: [],
      })
    }
    const daily = dateMap.get(t.date)!
    if (t.type === 'expense') {
      daily.expenses += t.amount
    } else {
      daily.income += t.amount
    }
    daily.transactions.push(t)
  })

  // 按категории分组
  const categoryMap = new Map<string, { amount: number; emoji: string; count: number }>()
  weekTransactions.forEach(t => {
    if (t.type === 'expense') {
      if (!categoryMap.has(t.category)) {
        categoryMap.set(t.category, { amount: 0, emoji: t.emoji, count: 0 })
      }
      const cat = categoryMap.get(t.category)!
      cat.amount += t.amount
      cat.count += 1
    }
  })

  const totalExpense = Array.from(categoryMap.values()).reduce((sum, item) => sum + item.amount, 0)

  const categoryBreakdown: CategoryBreakdown[] = Array.from(categoryMap.entries()).map(
    ([category, data]) => ({
      category,
      emoji: data.emoji,
      amount: data.amount,
      percentage: totalExpense > 0 ? Math.round((data.amount / totalExpense) * 100) : 0,
      count: data.count,
    })
  )

  // 构建每日数据
  const allDates: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    allDates.push(formatDate(d))
  }

  const finalDailyBreakdown = allDates.map(
    date => dateMap.get(date) || { date, expenses: 0, income: 0, transactions: [] }
  )

  const totalIncome = Array.from(dateMap.values()).reduce((sum, daily) => sum + daily.income, 0)

  return {
    weekStart: formatDate(start),
    weekEnd: formatDate(weekEnd),
    totalExpense,
    totalIncome,
    balance: totalIncome - totalExpense,
    dailyBreakdown: finalDailyBreakdown,
    categoryBreakdown: categoryBreakdown.sort((a, b) => b.amount - a.amount),
  }
}

// 获取月报告
export const getMonthlySummary = (date: Date = new Date()): WeeklySummary => {
  const year = date.getFullYear()
  const month = date.getMonth()
  
  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 0)

  const transactions = getStorageData()
  const monthTransactions = transactions.filter(t => {
    const tDate = new Date(t.date)
    return tDate >= monthStart && tDate <= monthEnd
  })

  const dailyBreakdown: DailySummary[] = []
  const dateMap = new Map<string, DailySummary>()

  monthTransactions.forEach(t => {
    if (!dateMap.has(t.date)) {
      dateMap.set(t.date, {
        date: t.date,
        expenses: 0,
        income: 0,
        transactions: [],
      })
    }
    const daily = dateMap.get(t.date)!
    if (t.type === 'expense') {
      daily.expenses += t.amount
    } else {
      daily.income += t.amount
    }
    daily.transactions.push(t)
  })

  const categoryMap = new Map<string, { amount: number; emoji: string; count: number }>()
  monthTransactions.forEach(t => {
    if (t.type === 'expense') {
      if (!categoryMap.has(t.category)) {
        categoryMap.set(t.category, { amount: 0, emoji: t.emoji, count: 0 })
      }
      const cat = categoryMap.get(t.category)!
      cat.amount += t.amount
      cat.count += 1
    }
  })

  const totalExpense = Array.from(categoryMap.values()).reduce((sum, item) => sum + item.amount, 0)

  const categoryBreakdown: CategoryBreakdown[] = Array.from(categoryMap.entries()).map(
    ([category, data]) => ({
      category,
      emoji: data.emoji,
      amount: data.amount,
      percentage: totalExpense > 0 ? Math.round((data.amount / totalExpense) * 100) : 0,
      count: data.count,
    })
  )

  const totalIncome = Array.from(dateMap.values()).reduce((sum, daily) => sum + daily.income, 0)

  return {
    weekStart: formatDate(monthStart),
    weekEnd: formatDate(monthEnd),
    totalExpense,
    totalIncome,
    balance: totalIncome - totalExpense,
    dailyBreakdown: Array.from(dateMap.values()),
    categoryBreakdown: categoryBreakdown.sort((a, b) => b.amount - a.amount),
  }
}
