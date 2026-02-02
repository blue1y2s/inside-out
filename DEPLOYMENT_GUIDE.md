# 🚀 GitHub Pages 部署指南 - 最后一步

## ✅ 已完成的步骤

1. ✅ Git 仓库初始化
2. ✅ 代码已推送到 GitHub: <https://github.com/blue1y2s/inside-out>
3. ✅ 所有文件都已上传

## 🎯 最后一步：配置 GitHub Pages（2 分钟）

### 步骤 1: 打开 GitHub Pages 设置

在浏览器中打开这个链接（需要登录你的 GitHub 账号）：

```
https://github.com/blue1y2s/inside-out/settings/pages
```

或者手动操作：

1. 访问 <https://github.com/blue1y2s/inside-out>
2. 点击顶部的 **Settings** 标签
3. 左侧菜单找到 **Pages**

---

### 步骤 2: 配置部署源

在 **Build and deployment** 部分：

1. **Source**: 选择 `Deploy from a branch`

2. **Branch**:
   - 第一个下拉框选择：`main`
   - 第二个下拉框选择：`/ (root)`

3. 点击 **Save** 按钮

---

### 步骤 3: 等待部署完成

1. 保存后，页面会刷新
2. 等待 1-2 分钟，GitHub 会自动构建你的网站
3. 刷新页面，顶部会出现一个绿色的提示框，显示：

   ```
   Your site is live at https://blue1y2s.github.io/inside-out/
   ```

---

## 🌐 你的网站地址

部署完成后，你的网站会在这两个地址可用：

### 主页（个人网站）

```
https://blue1y2s.github.io/inside-out/personal-website/
```

### App Demo（3D 情绪球体应用）

```
https://blue1y2s.github.io/inside-out/app/
```

---

## 🎨 访问建议

推荐先访问个人网站主页：

```
https://blue1y2s.github.io/inside-out/personal-website/
```

这是你精心设计的 Inside Out 主题展示页面，包含：

- ✨ 动态背景球体
- 🎨 情绪色彩展示
- 🚀 项目介绍
- 🔗 Demo 链接

---

## 🔧 如果遇到问题

### 问题 1: 页面显示 404

**原因**: GitHub Pages 还在构建中  
**解决**: 等待 2-3 分钟后刷新

### 问题 2: 样式没有加载

**原因**: 资源路径问题  
**解决**: 检查 `personal-website/index.html` 中的路径是否使用相对路径

### 问题 3: 想要更新网站

**步骤**:

```bash
cd /Users/troy/Desktop/personal_visual
# 修改文件后
git add .
git commit -m "Update website"
git push
```

等待 1-2 分钟，GitHub Pages 会自动更新

---

## 🎉 完成后

1. 访问你的网站
2. 测试所有链接和动画
3. 分享给朋友：`https://blue1y2s.github.io/inside-out/personal-website/`

---

## 💡 下一步优化（可选）

### 1. 自定义域名

如果你想要自己的域名（如 `troy.com`）：

- 在域名注册商（如 Namecheap、GoDaddy）购买域名
- 在 GitHub Pages 设置中添加自定义域名
- 配置 DNS 记录

### 2. 添加 Google Analytics

在 `personal-website/index.html` 的 `<head>` 中添加：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA_ID');
</script>
```

### 3. SEO 优化

已经包含在你的网站中：

- ✅ Meta description
- ✅ Open Graph tags
- ✅ 语义化 HTML
- ✅ 响应式设计

---

## 📱 分享建议

分享时可以这样说：

> "看看我的情绪可视化项目！🎨  
> 灵感来自 Pixar 的 Inside Out，将情绪变成彩色的 3D 球体宇宙。  
> 👉 <https://blue1y2s.github.io/inside-out/personal-website/>"

---

**现在就去配置 GitHub Pages 吧！2 分钟后你的网站就上线了！** 🚀
