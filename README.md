# 🚀 ONYANGO_JP Stellar Compass Portfolio

An immersive, cinematic 3D portfolio experience where users navigate through floating planets in deep space. Each planet represents a different section of the portfolio, creating a unique and memorable way to showcase professional work.

![ONYANGO_JP Portfolio](https://via.placeholder.com/800x400/00010F/00E5FF?text=ONYANGO_JP+Stellar+Compass)

## Features

### Immersive 3D Experience
- Navigate through a realistic space environment
- Interactive floating planets for each portfolio section
- Smooth camera controls with zoom, pan, and rotate
- Cinematic parallax layers with stars, nebula, and particles

### Stunning Visual Design
- **Color Palette**: Midnight black, Nebula purple, Electric blue, Soft white
- Glowing particle systems and atmospheric effects
- Custom shader materials for nebula backgrounds
- Holographic UI elements with scan line effects

### Interactive Planet System
- **About Planet**: Personal introduction and mission
- **Projects Planet**: Showcase of your work with live demos
- **Skills Planet**: Technical expertise and tools
- **Contact Planet**: Professional contact information

### Hologram Cards
- Futuristic card design with glowing borders
- Smooth animations and hover effects
- 3D perspective transforms
- Scan line overlays for authentic sci-fi feel

### Responsive & Optimized
- Works on desktop, tablet, and mobile devices
- Performance optimized with lazy loading
- Smooth 60fps animations
- Progressive enhancement

## Tech Stack

### Core Technologies
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Three.js** - 3D graphics and WebGL rendering

## 🚀 Deployment

### **Cloudflare Pages (Recommended)**
1. Push to GitHub repository
2. Connect repository to Cloudflare Pages
3. Build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `18.x` or higher

### **Manual GitHub Setup**
```bash
# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/onyango-jp-portfolio.git
git branch -M main
git push -u origin main
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
