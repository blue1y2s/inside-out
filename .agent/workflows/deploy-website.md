---
description: Deploy personal website to the internet
---

# 部署个人网站到互联网

## 🎯 目标

将 `personal-website` 文件夹部署到互联网上，获得一个可以分享的网址。

---

## 方案 1: GitHub Pages（推荐 - 最稳定）

### 前提条件

- 有 GitHub 账号（没有的话去 github.com 注册一个）

### 步骤

#### 1. 初始化 Git 仓库（如果还没有）

```bash
cd /Users/troy/Desktop/personal_visual
git init
git add .
git commit -m "Initial commit: Inside Out personal website"
```

#### 2. 在 GitHub 创建仓库

- 访问 <https://github.com/new>
- 仓库名称：`personal-visual` 或 `inside-out-portfolio`
- 设置为 Public（公开）
- 不要勾选任何初始化选项
- 点击 "Create repository"

#### 3. 推送代码到 GitHub

```bash
# 替换 YOUR_USERNAME 为你的 GitHub 用户名
git remote add origin https://github.com/YOUR_USERNAME/personal-visual.git
git branch -M main
git push -u origin main
```

#### 4. 配置 GitHub Pages

- 在 GitHub 仓库页面，点击 "Settings"
- 左侧菜单找到 "Pages"
- Source 选择 "Deploy from a branch"
- Branch 选择 "main"，文件夹选择 "/personal-website"
- 点击 "Save"

#### 5. 等待部署完成

- 几分钟后，页面会显示你的网站地址
- 格式：`https://YOUR_USERNAME.github.io/personal-visual/`

---

## 方案 2: Vercel（推荐 - 最快速）

### 前提条件

- 有 GitHub 账号（用于登录 Vercel）

### 步骤

#### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 2. 登录 Vercel

```bash
cd /Users/troy/Desktop/personal_visual/personal-website
vercel login
```

- 会打开浏览器，用 GitHub 账号登录

#### 3. 部署网站

```bash
vercel
```

- 按提示操作：
  - Set up and deploy? → Yes
  - Which scope? → 选择你的账号
  - Link to existing project? → No
  - What's your project's name? → personal-visual
  - In which directory is your code located? → ./
  - Want to override the settings? → No

#### 4. 获取网址

- 部署完成后会显示网址
- 格式：`https://personal-visual-xxx.vercel.app`

#### 5. 后续更新

```bash
# 修改代码后，再次运行
vercel --prod
```

---

## 方案 3: Netlify（最简单 - 拖拽上传）

### 步骤

#### 1. 访问 Netlify

- 打开 <https://app.netlify.com/drop>

#### 2. 拖拽上传

- 直接把 `personal-website` 文件夹拖到页面上
- 等待上传完成

#### 3. 获取网址

- 上传完成后会自动生成一个网址
- 格式：`https://random-name-123.netlify.app`

#### 4. 自定义域名（可选）

- 点击 "Site settings" → "Change site name"
- 改成你喜欢的名字（如 `troy-inside-out`）
- 新网址：`https://troy-inside-out.netlify.app`

---

## 📝 部署后的检查清单

- [ ] 网站可以正常访问
- [ ] 所有样式正确加载
- [ ] JavaScript 动画正常工作
- [ ] 在手机上也能正常显示
- [ ] 分享链接给朋友测试

---

## 🎨 后续优化建议

### 1. 自定义域名（可选）

如果你想要自己的域名（如 `troy.com`）：

- 在 Namecheap、GoDaddy 或阿里云购买域名（约 $10-15/年）
- 在部署平台（GitHub Pages/Vercel/Netlify）配置自定义域名
- 添加 DNS 记录

### 2. 添加 SEO 优化

在 `index.html` 中添加：

```html
<meta name="description" content="Troy's Inside Out emotion visualization portfolio">
<meta property="og:title" content="Inside Out Emotion Visualization">
<meta property="og:description" content="Explore emotions through colorful 3D memory spheres">
<meta property="og:image" content="https://your-site.com/preview.png">
```

### 3. 添加 Google Analytics（可选）

- 创建 Google Analytics 账号
- 获取跟踪代码
- 添加到 `index.html` 的 `<head>` 中

---

## 🆘 常见问题

### Q: 我没有 GitHub 账号怎么办？

A: 去 <https://github.com> 注册一个，完全免费。

### Q: 部署后样式不对怎么办？

A: 检查 `index.html` 中的资源路径，确保使用相对路径。

### Q: 我想要自己的域名吗？

A: 不是必须的！免费域名（如 `.vercel.app`）已经很好用了。等项目成熟后再考虑购买。

### Q: 哪个方案最好？

A:

- 如果你熟悉 Git → **GitHub Pages**
- 如果你想要最快部署 → **Vercel**
- 如果你完全不懂技术 → **Netlify 拖拽上传**

---

## 🚀 推荐流程（最快 5 分钟）

1. **现在立即部署**: 使用 Vercel CLI（方案 2）
2. **长期稳定**: 后续迁移到 GitHub Pages（方案 1）
3. **购买域名**: 等网站成熟后再考虑

开始吧！🎉
