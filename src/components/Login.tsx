import React, { useState } from 'react'
import { registerUser, loginWithEmail, sendWelcomeEmailAsync } from '../utils'
import { User } from '../types'

interface LoginProps {
  onLoginSuccess: (user: User) => void
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!validateEmail(email)) {
      setError('请输入有效的邮箱地址')
      setLoading(false)
      return
    }

    const user = loginWithEmail(email)
    if (user) {
      onLoginSuccess(user)
    } else {
      setError('邮箱未注册，请先注册')
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!validateEmail(email)) {
      setError('请输入有效的邮箱地址')
      setLoading(false)
      return
    }

    if (!username.trim()) {
      setError('请输入用户名')
      setLoading(false)
      return
    }

    const user = registerUser(email, username)
    if (user) {
      // 异步发送欢迎邮件，不阻塞用户进入应用
      sendWelcomeEmailAsync(email, username).then(success => {
        if (success) {
          console.log('✅ 欢迎邮件已发送！')
        } else {
          console.log('⚠️ 欢迎邮件发送失败，但账户创建成功')
        }
      })

      // 立即进入应用
      onLoginSuccess(user)
    } else {
      setError('邮箱已被注册，请使用其他邮箱')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-pink-50 to-soft-pink/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-warm-pink-600 mb-2 flex items-center justify-center gap-3">
            <span className="text-6xl">💕</span>
            末末记账本
          </h1>
          <p className="text-gray-600">温暖的消费小日记，让生活更有计划</p>
        </div>

        {/* Card */}
        <div className="card-cute bg-white">
          {/* Tab */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => {
                setMode('login')
                setError('')
              }}
              className={`flex-1 py-2 rounded-full font-semibold transition ${
                mode === 'login'
                  ? 'bg-white text-warm-pink-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🔑 登陆
            </button>
            <button
              onClick={() => {
                setMode('register')
                setError('')
              }}
              className={`flex-1 py-2 rounded-full font-semibold transition ${
                mode === 'register'
                  ? 'bg-white text-warm-pink-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ✨ 注册
            </button>
          </div>

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-warm-pink-700 mb-2">
                📧 邮箱地址
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="你的邮箱地址"
                className="input-cute w-full"
                required
              />
            </div>

            {/* Username (Register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-semibold text-warm-pink-700 mb-2">
                  👤 用户名
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="取个可爱的昵称吧～"
                  className="input-cute w-full"
                  required
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? '加载中...' : mode === 'login' ? '🔓 登陆' : '✨ 创建账户'}
            </button>
          </form>

          {/* Tips */}
          <div className="mt-6 pt-6 border-t-2 border-soft-pink/30 text-center">
            <p className="text-sm text-gray-600 mb-2">
              {mode === 'login' ? '还没有账户？' : '已有账户？'}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login')
                  setError('')
                  setEmail('')
                  setUsername('')
                }}
                className="text-warm-pink-600 font-semibold hover:text-warm-pink-700 ml-1"
              >
                {mode === 'login' ? '立即注册' : '返回登陆'}
              </button>
            </p>
            <p className="text-xs text-gray-500 mt-4">
              💡 提示：你可以用任意邮箱地址注册，无需邮箱验证
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>🌟 末末记账本 v2.0 | 让消费变成一种温暖的习惯</p>
        </div>
      </div>
    </div>
  )
}
