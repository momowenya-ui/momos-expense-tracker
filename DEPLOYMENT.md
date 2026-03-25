# 末末记账本 - Vercel 部署指南

恭喜！你的末末记账本已经准备好上线了！🎉

## 📋 快速部署步骤（5分钟即可上线）

### 方案 A：最快速（推荐使用 GitHub）

#### 1️⃣ **如果还没有 GitHub 账户**
- 访问 [github.com](https://github.com) 注册账户
- 验证邮箱

#### 2️⃣ **上传项目到 GitHub**

在你的项目根目录运行：

```bash
# 初始化 git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "初始化末末记账本项目"

# 添加远程仓库（替换 USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/USERNAME/momos-expense-tracker.git

# 推送到 GitHub（主分支）
git branch -M main
git push -u origin main
```

#### 3️⃣ **连接 Vercel 部署**

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账户登陆（点击 "Continue with GitHub"）
3. 授权 Vercel 访问你的 GitHub 账户
4. 点击 "Import Project"
5. 选择你的 `momos-expense-tracker` 仓库
6. 点击 "Import"
7. Vercel 会自动检测项目配置，点击 "Deploy"
8. 等待部署完成（通常 1-2 分钟）

✅ **完成！** 你会获得一个独特的 Vercel URL，可以分享给任何人！

---

### 方案 B：不使用 GitHub（Vercel CLI 直接部署）

#### 1️⃣ **安装 Vercel CLI**

```bash
npm i -g vercel
```

#### 2️⃣ **登陆 Vercel**

```bash
vercel login
```

浏览器会打开，使用邮箱或 GitHub/GitLab/Bitbucket 账户登陆

#### 3️⃣ **部署项目**

在项目根目录运行：

```bash
vercel
```

按照提示：
- 选择 "Y" 创建新项目
- 输入项目名称（例如：momos-expense-tracker）
- 其他选项都选择默认值

✅ **完成！** 部署链接会在终端显示 🎉

---

## 🎯 部署后的建议

### 1. **自定义域名**（可选，但推荐）

如果你想用自己的域名（比如 `momos.yourname.com`）：

1. 在 Vercel Dashboard 找到你的项目
2. 进入 "Settings" → "Domains"
3. 添加你的域名
4. 按照提示修改 DNS 记录

### 2. **自动更新**

如果使用 GitHub + Vercel：
- 每次你推送代码到 GitHub，Vercel 会自动重新部署
- 非常适合持续开发和更新

### 3. **环境变量**（如有需要）

当前应用没有环境变量需配置，所有数据存储在浏览器本地

### 4. **性能优化**

你的构建输出已经很小 (~162KB gzip)，Vercel 会自动优化并通过 CDN 全球加速

---

## 📱 部署后的功能检查清单

部署成功后，请检查以下功能是否正常：

- [ ] 访问应用，看到登陆页面
- [ ] 注册新账户
- [ ] 登陆已有账户
- [ ] 添加消费记录
- [ ] 查看周报告和月报告
- [ ] 编辑个人信息
- [ ] 注销并重新登陆
- [ ] 在不同设备/浏览器上测试

---

## 🆘 常见问题

### Q: 部署失败怎么办？
**A:** 
1. 检查 Vercel Dashboard 的 "Deployments" 标签看错误日志
2. 确保 package.json 中的构建命令正确
3. 试试在本地 `npm run build` 看是否能成功

### Q: 数据会丢失吗？
**A:** 不会！所有数据存储在用户浏览器的 LocalStorage，与服务器无关。每个用户的数据都独立保存。

### Q: 如何更新已部署的应用？
**A:** 
- GitHub 方案：推送代码到 GitHub，Vercel 自动部署
- CLI 方案：项目目录运行 `vercel` 命令重新部署

### Q: Vercel 免费吗？
**A:** 是的！免费额度足以支持个人应用。具体参考 [Vercel 定价](https://vercel.com/pricing)

### Q: 如何和朋友分享应用？
**A:** 直接分享 Vercel 给你的 URL（例如：`https://momos-expense-tracker.vercel.app`）

---

## 📊 部署架构

```
你的电脑 (Local)
    ↓
GitHub 仓库 (GitHub)
    ↓
Vercel 部署 (CDN 全球加速)
    ↓
用户浏览器 ← 数据存储在 LocalStorage
```

---

## 🎉 恭喜！

你的 **末末记账本** 现在已经是一个真正的在线应用了！

🌍 **全球可访问**
⚡ **快速加载**
💾 **数据安全**（存储在浏览器）
♾️ **免费托管**

---

**需要帮助？** 查看 [Vercel 文档](https://vercel.com/docs) 或 [GitHub 帮助](https://docs.github.com/)

祝你的末末记账本运营愉快！💕
