import React, { useState } from 'react'
import { User } from '../types'
import { updateUserProfile, logout } from '../utils'

interface UserProfileProps {
  user: User
  onBack: () => void
  onLogout: () => void
  onUpdateUser: (user: User) => void
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onBack,
  onLogout,
  onUpdateUser,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState(user.bio)
  const [username, setUsername] = useState(user.username)

  const handleSave = () => {
    const updated = updateUserProfile({
      username,
      bio,
    })
    if (updated) {
      onUpdateUser(updated)
      setIsEditing(false)
    }
  }

  const handleLogout = () => {
    logout()
    onLogout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-pink-50 to-soft-pink/40 pb-12">
      {/* Back Button */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b-2 border-soft-pink/30 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-warm-pink-600 hover:text-warm-pink-700 font-semibold"
          >
            ← 返回
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="card-cute bg-white mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex gap-6 flex-1">
              {/* Avatar */}
              <div>
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-24 h-24 rounded-full border-4 border-soft-pink"
                />
              </div>
              {/* Basic Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-warm-pink-700 block mb-1">
                        用户名
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="input-cute w-full"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold text-warm-pink-700 mb-1">
                      {user.username} 💕
                    </h1>
                    <p className="text-gray-600 text-base">{user.email}</p>
                    <p className="text-gray-500 text-sm mt-2">
                      🎂 加入于 {user.joinDate}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary"
              >
                ✏️ 编辑
              </button>
            )}
          </div>

          {/* Bio / Motto */}
          <div className="bg-warm-pink-50 rounded-2xl p-4 mb-6">
            <label className="text-sm font-semibold text-warm-pink-700 block mb-2">
              💭 我的座右铭
            </label>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="写下你关于记账和生活的想法吧～"
                className="input-cute w-full resize-none h-20"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed min-h-20">
                {bio || '🌟 还没有设置座右铭呢，快来编辑添加吧！'}
              </p>
            )}
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="btn-primary flex-1"
              >
                ✨ 保存
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setBio(user.bio)
                  setUsername(user.username)
                }}
                className="btn-secondary flex-1"
              >
                取消
              </button>
            </div>
          )}
        </div>

        {/* Statistics Card */}
        <div className="card-cute bg-gradient-to-br from-warm-pink-50 to-soft-pink/20 mb-6">
          <h2 className="text-xl font-bold text-warm-pink-700 mb-4">📊 我的统计</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-warm-pink-600">∞</p>
              <p className="text-sm text-gray-600">记录数</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600">∞</p>
              <p className="text-sm text-gray-600">节约金额</p>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">✨</p>
              <p className="text-sm text-gray-600">理财等级</p>
            </div>
          </div>
        </div>

        {/* Account Card */}
        <div className="card-cute bg-white">
          <h2 className="text-xl font-bold text-warm-pink-700 mb-4">🔐 账户设置</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-semibold text-gray-800">邮箱地址</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <span className="text-green-600 text-lg">✓</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-semibold text-gray-800">账户状态</p>
                <p className="text-sm text-gray-600">活跃</p>
              </div>
              <span className="text-blue-600 text-lg">🟢</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="btn-secondary w-full mt-6"
          >
            🚪 注销并离开
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>📝 末末记账本 v2.0</p>
          <p className="mt-1">为每一笔消费记录，为每一个选择负责</p>
        </div>
      </div>
    </div>
  )
}
