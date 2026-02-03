# SeeYourself

> 🎨 Visualize your emotional world through an interactive 3D experience

A web-based emotion visualization tool that transforms text into a beautiful universe of colored memory spheres.

## ✨ Features

- 🎨 **Emotion-Color Mapping** - Each emotion has a unique, vibrant color
- 🧠 **Personality Analysis** - Maps personality dimensions to emotional expression
- 🌌 **3D Visualization** - Three immersive layout modes:
  - **Timeline** - Spiral journey through your emotional history
  - **Humanoid** - Memories mapped to body regions (head, heart, limbs)
  - **Sense of Self** - Core memories feed into your central identity
- 💾 **Persistent Memory** - Your memories are saved locally and never leave your device
- 🎭 **Mixed Emotions** - Advanced visualization for complex emotional states

## 🚀 Quick Start

### Main App

```bash
cd app
npm install
npm run dev
```

Visit `http://localhost:3000`

### Personal Website

```bash
cd personal-website
python3 -m http.server 8000
```

Visit `http://localhost:8000`

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **3D Graphics**: Three.js + React Three Fiber
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with Glassmorphism
- **Storage**: Browser LocalStorage (100% private)

## 📁 Project Structure

```
seeyourself/
├── app/                    # Main React application
│   ├── components/         # React components
│   ├── utils/              # Utilities and helpers
│   └── types.ts            # TypeScript definitions
│
└── personal-website/       # Landing page
    ├── index.html
    ├── style.css
    └── script.js
```

## 🎨 Emotion Color System

- **Joy** - `#FFD700` Golden yellow
- **Sadness** - `#4A90E2` Deep blue
- **Anxiety** - `#FF6B35` Vibrant orange
- **Envy** - `#00D9B5` Cyan-green
- **Embarrassment** - `#FF9ECD` Soft pink
- **Anger** - `#E63946` Intense red
- **Fear** - `#9B59B6` Purple

## 🔒 Privacy

- ✅ All data stored locally in your browser
- ✅ No server communication (optional LLM analysis uses your own API key)
- ✅ No tracking or analytics
- ✅ Your memories never leave your device

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

## 🙏 Credits

- **Three.js** - 3D graphics library
- **React** - UI framework
- **React Three Fiber** - React renderer for Three.js

---

**Made with 💛💙🧡💚💗 by Ayang**

For questions or feedback, visit the [GitHub repository](https://github.com/blue1y2s/See_yourself).
