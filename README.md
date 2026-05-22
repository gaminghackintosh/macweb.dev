# hackintosh.web 🍎

> A web-native macOS experience — pixel-faithful, zero hardware required.

## 🌐 Live Demo

**[https://gaminghackintosh.github.io/hackintosh.web/](https://gaminghackintosh.github.io/hackintosh.web/)**

## 🌿 Ветки репозитория

| Ветка | Назначение |
|---|---|
| `main` | Описание проекта, документация |
| `code-root` | Исходный код (разработка и коммиты) |
| `gh-pages` | Собранный сайт (деплой через GitHub Actions) |

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat)](LICENSE)
[![Author](https://img.shields.io/badge/author-gaminghackintosh-purple?style=flat&logo=github)](https://github.com/gaminghackintosh)

---

## What is this?

**hackintosh.web** is an open-source macOS desktop environment that runs entirely in the browser. Built with React 18, it recreates the look, feel, and behavior of macOS — draggable windows, a magnifying Dock, a live Menu Bar, and real working apps — without touching a single line of Swift.

![hackintosh.web preview](./docs/preview.png)

---

## ✨ Features

| Feature | Status |
|---|---|
| Menu Bar with live clock | ✅ Done |
| Dock with spring magnification | ✅ Done |
| Draggable windows (traffic lights) | ✅ Done |
| Finder — file browser with sidebar | ✅ Done |
| Terminal — working shell emulator | ✅ Done |
| Notes — editable markdown-ish notes | ✅ Done |
| Desktop icons | ✅ Done |
| Safari browser (iframe) | 🔲 Planned |
| Spotlight search (⌘ Space) | 🔲 Planned |
| Mission Control | 🔲 Planned |
| Notifications Center | 🔲 Planned |
| Calendar | 🔲 Planned |
| Dark / Light wallpaper toggle | 🔲 Planned |
| App Store (installable widgets) | 🔲 Planned |

---

## 🛠 Tech Stack

- **React 18** — component model & hooks
- **Vite 5** — lightning-fast dev server
- **CSS-in-JS (inline styles)** — zero external CSS dependencies
- **No UI libraries** — 100% custom components

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/gaminghackintosh/hackintosh.web.git
cd hackintosh.web

# Install
npm install

# Dev server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) — you're in.

---

## 📁 Project Structure

```
hackintosh.web/
├── src/
│   ├── components/
│   │   ├── MenuBar.jsx        # Top menu bar + live clock
│   │   ├── Dock.jsx           # Dock with magnification
│   │   ├── AppWindow.jsx      # Draggable window shell
│   │   └── Desktop.jsx        # Wallpaper + desktop icons
│   ├── apps/
│   │   ├── Finder.jsx         # File browser
│   │   ├── Terminal.jsx       # Shell emulator
│   │   ├── Notes.jsx          # Text editor
│   │   └── Safari.jsx         # Browser (coming soon)
│   ├── hooks/
│   │   └── useWindowManager.js
│   ├── constants/
│   │   └── apps.js            # App definitions & icons
│   └── App.jsx                # Root entry
├── public/
│   └── wallpapers/
├── docs/
│   └── preview.png
├── README.md
└── package.json
```

---

## 🎮 Terminal Commands

The built-in Terminal supports:

```
help        — list available commands
ls          — list directory
pwd         — working directory
whoami      — current user
uname       — system info
date        — current date & time
echo [text] — print text
cat readme.md — print this file
neofetch    — system info with ASCII art
git log     — fake commit history
clear       — clear screen
```

---

## 🗺 Roadmap

### v1.0 — Foundation *(current)*
- [x] Desktop environment shell
- [x] Window management
- [x] Dock + Menu Bar
- [x] Finder, Terminal, Notes

### v1.5 — Power User
- [ ] Spotlight search
- [ ] Safari with iframe browsing
- [ ] Resizable windows
- [ ] Window snap / tiling

### v2.0 — Full OS
- [ ] Multi-user login screen
- [ ] App Store with installable widgets
- [ ] File system persistence (localStorage)
- [ ] Mission Control
- [ ] AirDrop simulator

---

## 🤝 Contributing

PRs are welcome! If you want to add a new app or improve an existing one:

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-app`
3. Add your app under `src/apps/`
4. Register it in `src/constants/apps.js`
5. Open a PR

---

## 📄 License

MIT © [gaminghackintosh](https://github.com/gaminghackintosh)

---

<p align="center">
  Made with ☕ and too many hours by <a href="https://github.com/gaminghackintosh">gaminghackintosh</a>
</p>
