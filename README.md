# SeeYourself

> 🎨 Discover and visualize your inner emotional world

A web-based emotion visualization tool that transforms your thoughts and feelings into a beautiful 3D universe of colored memory spheres.

## ✨ Features

### 🎨 Emotion-Color Mapping System

Each emotion is represented by a unique color:

- **Joy** - `#FFD700` - Golden yellow for achievements and positive moments
- **Sadness** - `#4A90E2` - Deep blue for reflection and melancholy
- **Anxiety** - `#FF6B35` - Vibrant orange for tension and worry
- **Envy** - `#00D9B5` - Cyan-green for comparison and desire
- **Embarrassment** - `#FF9ECD` - Soft pink for vulnerability and shyness
- **Anger** - `#E63946` - Intense red for strong negative emotions
- **Fear** - `#9B59B6` - Purple for uncertainty and caution

### 🧠 Personality Analysis

The app maps personality dimensions to dominant emotions:

- **Extraversion** - Influences Joy/Sadness expression
- **Emotionality** - Determines Anxiety/Fear intensity
- **Warmth** - Affects Joy/Embarrassment balance
- **Conscientiousness** - Related to Anxiety
- **Confidence** - Influences Fear/Embarrassment

### ✨ 3D Visualization Modes

Experience your emotions in three different layouts:

1. **Timeline View** - Memories arranged in a spiral, showing your emotional journey over time
2. **Humanoid View** - Memories distributed across a human form (head for thoughts, heart for feelings, limbs for actions)
3. **Sense of Self** - Core memories at the base feed into your "Self" structure at the top, connected by glowing belief strands

### 💾 Memory System

- **Persistent Storage** - Your memories are saved locally and persist across sessions
- **Memory Bank** - View and manage all your stored memories
- **Delete Function** - Remove individual memories you want to forget

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Modern web browser with WebGL support

### Running the Main App

```bash
cd app
npm install
npm run dev
```

Visit `http://localhost:3000`

### Running the Personal Website

```bash
cd personal-website
python3 -m http.server 8000
```

Visit `http://localhost:8000`

## 📁 Project Structure

```
seeyourself/
├── app/                          # Main application (React + Three.js)
│   ├── components/               # React components
│   │   ├── SceneOrchestrator.tsx # 3D scene management
│   │   ├── PersonaUniverse.tsx   # 3D visualization modes
│   │   ├── MemoryBankPanel.tsx   # Memory management UI
│   │   ├── BeliefStrands.tsx     # Sense of Self connections
│   │   └── ...
│   ├── utils/
│   │   ├── colorMap.ts           # Color mapping logic
│   │   ├── layout3d.ts           # 3D layout algorithms
│   │   └── memoryStorage.ts      # LocalStorage persistence
│   └── types.ts                  # TypeScript type definitions
│
├── personal-website/             # Landing page
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── reference/                    # Visual references
    └── color_palette.json        # Emotion color configuration
```

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **3D Graphics**: Three.js + React Three Fiber
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with Glassmorphism
- **State Management**: React Hooks
- **Storage**: Browser LocalStorage

## 🎨 Design Philosophy

### Visual Design

The project uses a carefully crafted emotion-color system where each color is not just decoration, but a visual language for understanding yourself.

### Interaction Design

- **Progressive Experience**: Smooth transitions from input → analysis → 3D universe
- **Emotion Legend**: Helps users understand color-emotion mappings
- **Multiple Perspectives**: Timeline, Humanoid, and Sense of Self views
- **Persistent Memories**: Your emotional journey is saved and grows over time

### Technical Implementation

1. **Color Mapping**: Based on text sentiment analysis and personality dimensions
2. **3D Rendering**: High-performance sphere rendering with Three.js
3. **Animation System**: Smooth scene transitions and sphere animations
4. **Responsive Design**: Adapts to desktop and mobile devices
5. **Memory Persistence**: Automatic save/load with localStorage

## 🚢 Deployment

### Build for Production

```bash
cd app
npm run build
```

The built files will be in `app/dist/`.

### Deploy to GitHub Pages

1. Update `vite.config.ts` with your repository base path
2. Build the project
3. Push the `dist` folder to your `gh-pages` branch

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🗺️ Roadmap

- [ ] Add more emotion blending effects
- [ ] Implement emotion journey data visualization charts
- [ ] Support exporting personal emotion reports
- [ ] Add multi-language support (Chinese/English)
- [ ] Voice input for memories
- [ ] Social sharing features

## 🙏 Acknowledgments

- **Three.js** - Powerful 3D graphics library
- **React** - Excellent UI framework
- **React Three Fiber** - React renderer for Three.js

## 📄 License

MIT License - Personal project for learning and demonstration purposes

---

**Made with 💛💙🧡💚💗 by Ayang**
