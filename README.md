# StickerCanvas

A zero-friction, no-signup web application that allows users to visualize laptop stickers before applying them in real life.

## Features

- **Zero Friction**: No signup, no onboarding - straight to the canvas
- **Upload Custom Laptops**: Use pre-loaded templates or upload your own laptop image
- **Sticker Management**: Upload, arrange, scale, rotate, and layer stickers
- **Background Removal**: Automatic AI-powered background removal using RMBG-1.4
- **Randomize Layout**: One-click randomization of sticker positions
- **Export**: High-quality PNG, JPEG, or WebP export at multiple resolutions
- **Dark Theme**: Premium dark UI with glassmorphic effects

## Tech Stack

- **React 18** + Vite
- **Tailwind CSS** for styling
- **Fabric.js** for canvas manipulation
- **@imgly/background-removal** for AI background removal
- **Zustand** for state management
- **Lucide React** for icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `S` | Add sticker |
| `L` | Change laptop |
| `R` | Randomize layout |
| `G` | Toggle snap |
| `Shift+G` | Toggle grid |
| `Delete/Backspace` | Delete selected |
| `Ctrl+D` | Duplicate selected |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+A` | Select all |
| `Escape` | Deselect |
| `[` / `]` | Send backward/forward |
| `Shift+[` / `Shift+]` | Send to back/front |
| `+` / `-` | Zoom in/out |
| `0` | Reset zoom |
| `Arrow keys` | Nudge (1px) |
| `Shift+Arrow` | Nudge (10px) |

## Project Structure

```
src/
├── components/
│   ├── Canvas/          # Fabric.js canvas components
│   ├── Panels/          # Floating panels (Laptop, Sticker, Export)
│   ├── ToolRail/        # Left toolbar
│   ├── TopBar/          # Top navigation
│   ├── Notifications/   # Toast notifications
│   └── UI/              # Reusable UI components
├── hooks/               # Custom React hooks
├── store/               # Zustand state management
└── styles/              # Global CSS styles
```

## License

MIT
