#!/bin/bash

# 末末记账本 - 快速部署脚本

echo "🎉 欢迎使用末末记账本部署脚本！"
echo ""
echo "请选择部署方式："
echo "1) 使用 GitHub + Vercel（最推荐）"
echo "2) 使用 Vercel CLI 直接部署"
echo "3) 只查看部署指南"
echo ""
read -p "请输入选择 (1-3): " choice

case $choice in
  1)
    echo ""
    echo "📝 GitHub + Vercel 部署步骤："
    echo ""
    echo "1️⃣ 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "初始化末末记账本项目"
    echo ""
    echo "✅ 本地 Git 仓库已准备好！"
    echo ""
    echo "2️⃣ 接下来请："
    echo "   a) 创建 GitHub 仓库：https://github.com/new"
    echo "   b) 运行这个命令推送代码："
    echo "      git remote add origin https://github.com/YOUR_USERNAME/momos-expense-tracker.git"
    echo "      git branch -M main"
    echo "      git push -u origin main"
    echo ""
    echo "3️⃣ 然后访问 https://vercel.com 导入 GitHub 项目"
    echo ""
    echo "📚 详细步骤请查看 DEPLOYMENT.md"
    ;;
  2)
    echo ""
    echo "🚀 Vercel CLI 部署..."
    echo ""
    command -v vercel &> /dev/null
    if [ $? -eq 0 ]; then
      echo "Vercel CLI 已安装，开始部署..."
      vercel
    else
      echo "⚠️  Vercel CLI 未安装"
      echo ""
      echo "请先安装:"
      echo "  npm i -g vercel"
      echo ""
      echo "然后运行:"
      echo "  vercel login"
      echo "  vercel"
    fi
    ;;
  3)
    echo ""
    echo "📖 部署指南内容："
    echo ""
    if [ -f "DEPLOYMENT.md" ]; then
      cat DEPLOYMENT.md
    else
      echo "DEPLOYMENT.md 文件未找到"
    fi
    ;;
  *)
    echo "❌ 无效的选择"
    ;;
esac

echo ""
echo "💕 祝部署愉快！"
