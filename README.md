# hackintosh.web 🍎

> A web-native macOS experience — pixel-faithful, zero hardware required.

## 🌐 Live Demo

**[https://gaminghackintosh.github.io/hackintosh.web/](https://gaminghackintosh.github.io/hackintosh.web/)**

## 🌿 Repository Branches

| Branch | Purpose |
|---|---|
| `main` | Project overview & documentation |
| `code-root` | Main development branch |
| `gh-pages` | Production build deployed via GitHub Actions |

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat)](LICENSE)
[![Author](https://img.shields.io/badge/author-gaminghackintosh-purple?style=flat&logo=github)](https://github.com/gaminghackintosh)

---

## What is this?

**hackintosh.web** is an open-source macOS desktop environment that runs entirely in the browser. Built with React 18, it recreates the look, feel, and behavior of macOS — draggable windows, a magnifying Dock, a live Menu Bar, and real working apps — without touching a single line of Swift.

![hackintosh.web preview](assets/img/desktop.png)

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
| Safari browser (iframe) | Do you seriously think that’s even possible? 😉 |
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


## 📁 Project Structure

You really thought this project had only 5 folders?

Good luck.

The actual structure is already evolving into a small operating system, and documenting every file here would probably require its own README.

If you're brave enough:

```bash
git checkout code-root
```

Then enter the rabbit hole yourself.

Or just open the repository and start scrolling until existential dread kicks in.

Current known ecosystem includes:
- draggable window manager
- fake Terminal emulator
- Finder clone
- Notes app
- Dock physics
- live Menu Bar
- wallpaper renderer
- app registry
- custom icon pipeline
- several questionable architectural decisions at 3 AM

Happy exploring.

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
git log     — real commit history
clear       — clear screen
```

---

## 🤝 Contributing

PRs are welcome! If you want to add a new app or improve an existing one:

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-app`
3. Add your app under `src/apps/`
4. Register it in `src/constants/apps.js`
5. Open a PR

---


**Made with ☕ and too many hours by [@ghost](https://github.com/gaminghackintosh)**

<pre>
                                     , 
                                    ;o\ 
                                    ;Ob`. 
                                   ;OOOOb`. 
                                  ;OOOOOY" ) 
                                 ;OOOO' ,%%) 
                             \  /OOO ,%%%%,%\ 
                              |:  ,%%%%%%;%%/ 
                              ||,%%%%%%%%%%/ 
                              ;|%%%%%%%%%'/`-'"`. 
                             /: %%%%%%%%'/ c$$$$.`. 
                `.______     \ \%%%%%%%'/.$$YF"Y$: ) 
              _________ "`.\`\o \`%%' ,',$F,.   $F ) 
     ___,--""'dOOO;,:%%`-._ o_,O_   ,',"',d88)  '  ) 
  -"'. YOOOOOOO';%%%%%%%%%;`-O   )_     ,X888F   _/ 
      \ YOOOO',%%%%%%%%%%Y    \__;`),-.  `""F  ,' 
       \ `" ,%%%%%%%%%%,' _,-   \-' \_ `------' 
        \_ %%%%',%%%%%_,-' ,;    ( _,-\ 
          `-.__`%%',-' .c$$'     |\-_,-\ 
               `""; ,$$$',md8oY  : `\_,') 
                 ( ,$$$F `88888  ;   `--' 
                  \`$$(    `""' / 
                   \`"$$c'   _,' 
                    `.____,-' 
</pre>
