export type TransactionType = 'expense' | 'income'

export interface User {
  id: string
  email: string
  username: string
  avatar: string
  bio: string
  joinDate: string
}

export interface AuthState {
  isLoggedIn: boolean
  user: User | null
}

export interface Transaction {
  id: string
  date: string
  categoryId: string
  category: string
  amount: number
  type: TransactionType
  note: string
  emoji: string
}

export interface Category {
  id: string
  name: string
  emoji: string
  color: string
}

export interface DailySummary {
  date: string
  expenses: number
  income: number
  transactions: Transaction[]
}

export interface WeeklySummary {
  weekStart: string
  weekEnd: string
  totalExpense: number
  totalIncome: number
  balance: number
  dailyBreakdown: DailySummary[]
  categoryBreakdown: CategoryBreakdown[]
}

export interface CategoryBreakdown {
  category: string
  emoji: string
  amount: number
  percentage: number
  count: number
}
