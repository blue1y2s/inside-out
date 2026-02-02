# Inside Out Emotion Visualization Project

> 🎨 Exploring the intersection of emotion, color, and personality through an Inside Out-inspired visualization

## 项目概述

这个项目受 Pixar 电影《Inside Out (头脑特工队)》启发，将情绪可视化为彩色的记忆球体。通过分析文本和人格维度，创建一个 3D 宇宙，其中每个球体都代表一个独特的情感时刻。

## 核心特性

### 🎨 情绪-颜色映射系统

基于 Inside Out 2 的视觉设计，我们创建了一套完整的情绪-颜色映射：

- **Joy (快乐)** - `#FFD700` - 金黄色，代表成就和积极时刻
- **Sadness (悲伤)** - `#4A90E2` - 深蓝色，代表反思和忧郁
- **Anxiety (焦虑)** - `#FF6B35` - 活力橙，代表紧张和高强度担忧
- **Envy (嫉妒)** - `#00D9B5` - 青绿色，代表比较和渴望
- **Embarrassment (尴尬)** - `#FF9ECD` - 柔粉色，代表脆弱和害羞
- **Anger (愤怒)** - `#E63946` - 强烈红，代表强烈负面情绪
- **Fear (恐惧)** - `#9B59B6` - 紫色，代表不确定和谨慎

### 🧠 人格分析

应用将人格维度映射到主导情绪：

- **Extraversion (外向性)** - 影响 Joy/Sadness 的表现
- **Emotionality (情绪性)** - 决定 Anxiety/Fear 的强度
- **Warmth (温暖度)** - 影响 Joy/Embarrassment 的平衡
- **Conscientiousness (尽责性)** - 与 Anxiety 相关
- **Confidence (自信度)** - 影响 Fear/Embarrassment

### ✨ 3D 可视化

使用 Three.js 创建沉浸式 3D 体验：

- 发光的记忆球体，每个都有独特的颜色
- 基于情绪的动态颜色过渡
- 人形布局（头部、心脏、四肢）对应不同类型的记忆
- 时间轴视图展示情感历程

## 技术栈

- **Frontend**: React + TypeScript
- **3D Graphics**: Three.js
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with Glassmorphism
- **Color System**: Inside Out Emotion Palette

## 项目结构

```
personal_visual/
├── app/                          # 主应用 (React + Three.js)
│   ├── components/               # React 组件
│   │   ├── SceneOrchestrator.tsx # 3D 场景管理
│   │   ├── EmotionLegend.tsx    # 情绪图例
│   │   └── ...
│   ├── utils/
│   │   ├── colorMap.ts          # Inside Out 颜色映射
│   │   ├── colorMapping.ts      # 人格-情绪映射
│   │   └── layout3d.ts          # 3D 布局算法
│   └── types.ts                 # TypeScript 类型定义
│
├── personal-website/            # 个人展示网站
│   ├── index.html              # 主页
│   ├── style.css               # Inside Out 主题样式
│   └── script.js               # 交互效果
│
├── reference/                   # 视觉参考资料
│   ├── color_palette.json      # 情绪颜色配置
│   ├── movie/                  # Inside Out 2 电影文件
│   └── extracted/              # 提取的视觉素材 (待生成)
│
└── scripts/
    └── extract_visuals.sh      # FFmpeg 视觉提取脚本
```

## 快速开始

### 运行主应用

```bash
cd app
npm install
npm run dev
```

访问 <http://localhost:3000>

### 运行个人网站

```bash
cd personal-website
python3 -m http.server 8000
```

访问 <http://localhost:8000>

## 设计理念

### 视觉设计

项目的视觉设计完全基于 Inside Out 的情绪色彩系统。每种颜色都不仅仅是装饰，而是一种理解自我的视觉语言。

### 交互设计

- **渐进式体验**: 从输入 → 分析 → 3D 宇宙的流畅过渡
- **情绪图例**: 帮助用户理解颜色-情绪的对应关系
- **多视角**: 提供时间轴和人形两种布局视角

### 技术实现

1. **颜色映射**: 基于文本情感分析和人格维度计算
2. **3D 渲染**: 使用 Three.js 实现高性能球体渲染
3. **动画系统**: 平滑的场景转换和球体动画
4. **响应式设计**: 适配桌面和移动设备

## 未来计划

- [ ] 使用 FFmpeg 从 Inside Out 2 提取更多视觉参考
- [ ] 添加更多情绪混合效果
- [ ] 实现情绪历程的数据可视化图表
- [ ] 支持导出个人情绪报告
- [ ] 添加多语言支持（中文/英文）

## 致谢

- **Pixar's Inside Out** - 视觉灵感来源
- **Three.js** - 强大的 3D 图形库
- **React** - 优秀的 UI 框架

## License

MIT License - 个人项目，仅供学习和展示使用

---

**Made with 💛💙🧡💚💗 by Troy**
