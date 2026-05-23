import { useState, useEffect, useRef } from "react";



// ═══════════════════════════════════════════════════════════
//  hackintosh.web — macOS-like React Desktop
//  github.com/gaminghackintosh
// ═══════════════════════════════════════════════════════════






// ===== IMPORTS ===== //
import FinderIcon from "./assets/icons/finder/finder.svg";
import FolderIcon from "./assets/icons/finder/Folder.png";
import FileIcon from "./assets/icons/finder/File.png";

import SafariIcon from "./assets/icons/apps/safari.webp";
import NotesIcon from "./assets/icons/apps/notes.webp";
import TerminalIcon from "./assets/icons/apps/terminal.webp";
import MusicIcon from "./assets/icons/apps/music.webp";
import SettingsIcon from "./assets/icons/apps/settings.webp";

import DesktopIcon from "./assets/icons/menu/desktop.png";
import DownloadsIcon from "./assets/icons/menu/downloads.png";
import ProjectsIcon from "./assets/icons/menu/projects.png";
import NetworkIcon from "./assets/icons/menu/network.png";
import MacintoshHDIcon from "./assets/icons/apps/macintosh_HD.ico";


const WALLPAPER = `
  radial-gradient(ellipse at 25% 35%, rgba(120, 40, 220, 0.75) 0%, transparent 55%),
  radial-gradient(ellipse at 78% 20%, rgba(255, 110, 40, 0.65) 0%, transparent 45%),
  radial-gradient(ellipse at 55% 78%, rgba(20, 90, 220, 0.55) 0%, transparent 48%),
  radial-gradient(ellipse at 85% 80%, rgba(200, 40, 120, 0.45) 0%, transparent 40%),
  linear-gradient(145deg, #0d0718 0%, #1a0833 35%, #0d1a3a 65%, #0d1f18 100%)
`;

const APPS = [
  { id: "finder",   name: "Finder",          icon: FinderIcon,    color: "#4B9EF0" },
  { id: "safari",   name: "Safari",          icon: SafariIcon,    color: "#0A84FF" },
  { id: "notes",    name: "Notes",           icon: NotesIcon,     color: "#FFD60A" },
  { id: "terminal", name: "Terminal",        icon: TerminalIcon,  color: "#1C1C1E" },
  { id: "music",    name: "Music",           icon: MusicIcon,     color: "#FF375F" },
  { id: "settings", name: "System Settings", icon: SettingsIcon,  color: "#636366" },
];

const INITIAL_POSITIONS = {
  finder:   { x: 80,  y: 56,  w: 740, h: 500 },
  notes:    { x: 200, y: 90,  w: 620, h: 440 },
  terminal: { x: 140, y: 70,  w: 660, h: 420 },
  settings: { x: 260, y: 100, w: 520, h: 400 },
  music:    { x: 180, y: 80,  w: 500, h: 420 },
  safari:   { x: 100, y: 60,  w: 780, h: 520 },
};

let zCounter = 100;

// ─── MenuBar ────────────────────────────────────────────────
function MenuBar({ activeApp }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fmtTime = (d) =>
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const fmtDate = (d) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const leftItems = [" ", activeApp || "Finder", "File", "Edit", "View", "Window", "Help"];

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 28,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(40px) saturate(1.8)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 6px", zIndex: 9999, color: "white",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        userSelect: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {leftItems.map((item, i) => (
          <span
            key={i}
            style={{
              padding: "2px 9px", borderRadius: 5, cursor: "default",
              fontSize: i === 0 ? 18 : 13,
              fontWeight: i <= 1 ? 600 : 400,
              color: i === 0 ? "white" : "rgba(255,255,255,0.88)",
              transition: "background 0.1s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {item === " " ? "" : item}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13 }}>
        <span style={{ opacity: 0.8 }}>🔋</span>
        <span style={{ opacity: 0.8 }}>📶</span>
        <span style={{ opacity: 0.75, fontSize: 12 }}>{fmtDate(time)}</span>
        <span style={{ fontWeight: 500 }}>{fmtTime(time)}</span>
      </div>
    </div>
  );
}

// ─── Dock ───────────────────────────────────────────────────
function Dock({ onOpen, openApps }) {
  const [hoverIdx, setHoverIdx] = useState(null);

  const getScale = (i) => {
    if (hoverIdx === null) return 1;
    const d = Math.abs(i - hoverIdx);
    if (d === 0) return 1.65;
    if (d === 1) return 1.3;
    if (d === 2) return 1.1;
    return 1;
  };

  const getTranslate = (i) => {
    if (hoverIdx === null) return 0;
    const d = Math.abs(i - hoverIdx);
    if (d === 0) return -10;
    if (d === 1) return -6;
    if (d === 2) return -2;
    return 0;
  };

  return (
    <div
      style={{
        position: "fixed", bottom: 8, left: "50%", transform: "translateX(-50%)",
        display: "flex", alignItems: "flex-end", gap: 8,
        background: "rgba(255,255,255,0.14)",
        backdropFilter: "blur(40px) saturate(2)",
        padding: "8px 14px 12px", borderRadius: 22,
        border: "1px solid rgba(255,255,255,0.24)",
        boxShadow: "0 10px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.28)",
        zIndex: 9000,
      }}
    >
      {APPS.map((app, i) => {
        const scale = getScale(i);
        const ty = getTranslate(i);
        const isOpen = openApps.includes(app.id);

        return (
          <div
            key={app.id}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              position: "relative",
              transform: `scale(${scale}) translateY(${ty}px)`,
              transformOrigin: "bottom center",
              transition: "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
            onClick={() => onOpen(app.id)}
          >
            {hoverIdx === i && (
              <div
                style={{
                  position: "absolute", bottom: "calc(100% + 10px)",
                  left: "50%", transform: "translateX(-50%)",
                  background: "rgba(24,24,28,0.92)",
                  backdropFilter: "blur(12px)",
                  color: "white", padding: "5px 10px", borderRadius: 7,
                  fontSize: 12, fontWeight: 500, whiteSpace: "nowrap",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
                  pointerEvents: "none",
                }}
              >
                {app.name}
              </div>
            )}

            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 14,
                background:
                  app.id === "terminal"
                    ? "linear-gradient(145deg, #2c2c2e, #1c1c1e)"
                    : `linear-gradient(145deg, ${app.color}dd, ${app.color}99)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <img
                src={app.icon}
                alt={app.name}
                style={{
                  width: 42,
                  height: 42,
                  objectFit: "contain",
                }}
              />
            </div>

            <div style={{ height: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isOpen && (
                <div style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: "rgba(255,255,255,0.75)",
                }} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Window Shell ───────────────────────────────────────────
function AppWindow({ win, onClose, onMinimize, onFocus, isActive, children }) {
  const [pos, setPos] = useState({ x: win.x, y: win.y });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onTitleMouseDown = (e) => {
    if (e.button !== 0) return;
    onFocus();
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };

    const onMove = (ev) => {
      if (!dragging.current) return;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - win.width, ev.clientX - offset.current.x)),
        y: Math.max(28, ev.clientY - offset.current.y),
      });
    };
    const onUp = () => {
      dragging.current = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    e.preventDefault();
  };

  const trafficLights = [
    { color: "#ff5f57", shadow: "rgba(255,50,50,0.5)", action: onClose },
    { color: "#ffbd2e", shadow: "rgba(255,180,0,0.5)", action: onMinimize },
    { color: "#28c840", shadow: "rgba(0,200,50,0.5)", action: null },
  ];

  return (
    <div
      onMouseDown={onFocus}
      style={{
        position: "fixed", left: pos.x, top: pos.y,
        width: win.width, height: win.height,
        background: "rgba(25,25,28,0.88)",
        backdropFilter: "blur(40px) saturate(1.8)",
        borderRadius: 12, overflow: "hidden",
        border: `1px solid rgba(255,255,255,${isActive ? 0.18 : 0.08})`,
        boxShadow: isActive
          ? "0 32px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.1)"
          : "0 14px 40px rgba(0,0,0,0.45)",
        zIndex: win.zIndex,
        display: "flex", flexDirection: "column",
        transition: "box-shadow 0.2s",
      }}
    >
      {/* Title Bar */}
      <div
        onMouseDown={onTitleMouseDown}
        style={{
          height: 40, flexShrink: 0,
          background: isActive ? "rgba(48,48,52,0.9)" : "rgba(38,38,42,0.9)",
          display: "flex", alignItems: "center",
          padding: "0 14px", cursor: "move",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          userSelect: "none",
          transition: "background 0.2s",
        }}
      >
        <div
          style={{ display: "flex", gap: 7, zIndex: 1 }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {trafficLights.map((btn, i) => (
            <div
              key={i}
              onClick={btn.action || undefined}
              style={{
                width: 12, height: 12, borderRadius: "50%",
                background: btn.color,
                cursor: btn.action ? "pointer" : "default",
                boxShadow: isActive ? `0 0 0 0.5px rgba(0,0,0,0.3)` : "none",
                opacity: isActive ? 1 : 0.4,
                transition: "opacity 0.2s, filter 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.8)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
            />
          ))}
        </div>

        <span
          style={{
            position: "absolute", left: 0, right: 0,
            textAlign: "center",
            color: isActive ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.35)",
            fontSize: 13, fontWeight: 500,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            letterSpacing: 0.15, pointerEvents: "none",
          }}
        >
          {win.title}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>
    </div>
  );
}

// ─── Finder ─────────────────────────────────────────────────
function FinderContent() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentFolder, setCurrentFolder] = useState("Home");

  const sidebar = [
    {
      label: "FAVOURITES",
      items: [
        { name: "Home", icon: FinderIcon },
        { name: "Desktop", icon: DesktopIcon },
        { name: "Documents", icon: DocumentsIcon },
        { name: "Downloads", icon: DownloadsIcon },
        { name: "Projects", icon: ProjectsIcon },
      ],
    },
    {
      label: "LOCATIONS",
      items: [{ name: "Macintosh HD", icon: "./src/assets/icons/apps/macintosh_HD.ico" }, 
        { name: "Network", icon: "./src/assets/icons/menu/network.png" },
      ],
    },
  ];

  const files = {
    Home: [
      { name: "Documents", type: "folder", icon: DocumentsIcon, size: "—", modified: "Today" },
      { name: "Downloads", type: "folder", icon: DownloadsIcon, size: "—", modified: "Today" },
      { name: "Desktop", icon: DesktopIcon },
      { name: "Projects", type: "folder", icon: ProjectsIcon, size: "—", modified: "Today" },
      { name: "readme.md", type: "file", icon: FileIcon, size: "4 KB", modified: "Today" },
    ],
    Documents: [
      { name: "Projects", type: "folder", icon: DocumentsIcon, size: "—", modified: "2 days ago" },
      { name: "resume.pdf", type: "file", icon: FileIcon, size: "128 KB", modified: "Last week" },
      { name: "notes.txt", type: "file", icon: FileIcon, size: "2 KB", modified: "Yesterday" },
    ],
    Downloads: [
      { name: "hackintosh-web-v1.zip", type: "file", icon: FileIcon, size: "8.2 MB", modified: "Today" },
      { name: "wallpaper.png", type: "file", icon: FileIcon, size: "3.1 MB", modified: "Yesterday" },
    ],
    Desktop: [],
    Projects: [
      { name: "hackintosh.web", type: "folder", icon: ProjectsIcon, size: "—", modified: "Just now" },
      { name: "portfolio", type: "folder", icon: ProjectsIcon, size: "—", modified: "3 days ago" },
    ],
    "Macintosh HD": [
      { name: "Applications", type: "folder", icon: DocumentsIcon, size: "—", modified: "Today" },
      { name: "Library", type: "folder", icon: DocumentsIcon, size: "—", modified: "Today" },
      { name: "System", type: "folder", icon: DocumentsIcon, size: "—", modified: "Today" },
      { name: "Users", type: "folder", icon: ProjectsIcon, size: "—", modified: "Today" },
    ],
    Network: [],
  };

  const currentFiles = files[currentFolder] || [];

  return (
    <div style={{
      display: "flex", height: "100%",
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    }}>
      {/* Sidebar */}
      <div style={{
        width: 185, flexShrink: 0,
        background: "rgba(36,36,40,0.95)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        padding: "10px 0", overflowY: "auto",
      }}>
        {sidebar.map((section) => (
          <div key={section.label}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              color: "rgba(255,255,255,0.3)",
              padding: "10px 18px 4px", letterSpacing: 1.1,
            }}>
              {section.label}
            </div>
            {section.items.map((item) => (
              <div
                key={item.name}
                onClick={() => { setCurrentFolder(item.name); setSelectedFile(null); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "5px 10px", borderRadius: 7, margin: "1px 6px",
                  background: currentFolder === item.name ? "rgba(255,255,255,0.12)" : "transparent",
                  color: currentFolder === item.name ? "white" : "rgba(255,255,255,0.6)",
                  fontSize: 13, cursor: "pointer",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => { if (currentFolder !== item.name) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={(e) => { if (currentFolder !== item.name) e.currentTarget.style.background = "transparent"; }}
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  style={{
                    width: 18,
                    height: 18,
                    objectFit: "contain",
                  }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* File Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{
          padding: "6px 14px",
          background: "rgba(40,40,44,0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 20, lineHeight: 1 }}>‹</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 20, lineHeight: 1 }}>›</span>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginLeft: 6 }}>
            {currentFolder}
          </span>
        </div>

        {/* Column Headers */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 90px 130px",
          padding: "5px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.3)", fontSize: 11, userSelect: "none",
        }}>
          <span>Name</span><span>Size</span><span>Date Modified</span>
        </div>

        {/* Files */}
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 6px" }}>
          {currentFiles.length === 0 ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", height: "100%",
              color: "rgba(255,255,255,0.2)", gap: 10,
            }}>
              <span style={{ fontSize: 44 }}>📭</span>
              <span style={{ fontSize: 13 }}>Folder is empty</span>
            </div>
          ) : (
            currentFiles.map((f) => (
              <div
                key={f.name}
                onClick={() => f.type === "folder" ? setCurrentFolder(f.name) : setSelectedFile(f.name)}
                onDoubleClick={() => f.type === "folder" && setCurrentFolder(f.name)}
                style={{
                  display: "grid", gridTemplateColumns: "1fr 90px 130px",
                  alignItems: "center", padding: "5px 8px", borderRadius: 6,
                  cursor: "pointer",
                  background: selectedFile === f.name ? "rgba(10,132,255,0.38)" : "transparent",
                  color: "rgba(255,255,255,0.82)", fontSize: 13,
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => { if (selectedFile !== f.name) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={(e) => { if (selectedFile !== f.name) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img
                    src={f.icon}
                    alt={f.name}
                    style={{
                      width: 18,
                      height: 18,
                      objectFit: "contain",
                    }}
                  />

                  <span>{f.name}</span>
                </span>
                <span style={{ color: "rgba(255,255,255,0.35)" }}>{f.size}</span>
                <span style={{ color: "rgba(255,255,255,0.35)" }}>{f.modified}</span>
              </div>
            ))
          )}
        </div>

        {/* Status Bar */}
        <div style={{
          padding: "5px 14px",
          background: "rgba(36,36,40,0.85)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.3)", fontSize: 11,
        }}>
          {currentFiles.length} items
        </div>
      </div>
    </div>
  );
}

// ─── Terminal ───────────────────────────────────────────────
function TerminalContent() {
  const [history, setHistory] = useState([
    { type: "output", text: "Last login: " + new Date().toDateString() + " on ttys001" },
    { type: "output", text: "" },
    { type: "output", text: 'Type "help" for available commands.' },
    { type: "output", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [cmdIdx, setCmdIdx] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const runCommand = (raw) => {
    const parts = raw.trim().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1).join(" ");

    const cmds = {
      help: [
        "Available commands:",
        "  ls        – list directory contents",
        "  pwd       – print working directory",
        "  whoami    – current user",
        "  uname     – system information",
        "  date      – current date & time",
        "  echo      – print text",
        "  cat       – print file contents",
        "  neofetch  – system info with ASCII art",
        "  clear     – clear the terminal",
        "  open      – open an app",
        "  git log   – fake git history",
      ],
      
      ls: [
        "Desktop/    Documents/    Downloads/    Movies/    Music/",
        "Pictures/   Projects/     Public/       readme.md",
      ],
      
      pwd: ["/Users/gaminghackintosh"],
      
      whoami: ["gaminghackintosh"],
      
      uname: ["Darwin hackintosh.web 24.0.0 Darwin Kernel Version 24.0.0; root:xnu/RELEASE_ARM64"],
      
      date: [new Date().toString()],
      "git log": [
        "\x1b[33mcommit a3f9d21\x1b[0m (HEAD -> main, origin/main)",
        "Author: gaminghackintosh <dev@hackintosh.web>",
        "Date:   " + new Date().toDateString(),
        "",
        "    feat: add draggable windows and dock magnification",
        "",
        "\x1b[33mcommit b1e4c08\x1b[0m",
        "Author: gaminghackintosh <dev@hackintosh.web>",
        "Date:   " + new Date(Date.now() - 86400000).toDateString(),
        "",
        "    init: project scaffold with React",
      ],
      
      neofetch: [
        "",
        " \x1b[38;5;39m                                     ,\x1b[0m                          \x1b[32mGamingHackintosh\x1b[0m@\x1b[36mhackintosh.web\x1b[0m",
        " \x1b[38;5;39m                                    ;o\\\\\x1b[0m                         ─────────────────────────────",
        " \x1b[38;5;45m                                    ;Ob`.\x1b[0m                       OS:          \x1b[37mhackintosh.web 1.0.0\x1b[0m",
        " \x1b[38;5;45m                                   ;OOOOb`.\x1b[0m                     Kernel:      \x1b[37mhackintosh-core\x1b[0m",
        " \x1b[38;5;51m                                  ;OOOOOY\" )\x1b[0m                    Host:        \x1b[37mMacBook Pro (Simulated)\x1b[0m",
        " \x1b[38;5;51m                                 ;OOOO' ,%%)\x1b[0m                    Shell:       \x1b[37mhacksh 1.0.0\x1b[0m",
        " \x1b[38;5;87m                             \\\\  /OOO ,%%%%,%\\\\\x1b[0m                 Runtime:     \x1b[37mReact 18 / V8\x1b[0m",
        " \x1b[38;5;87m                              |:  ,%%%%%%;%%/\x1b[0m                  Resolution:  \x1b[37m" + window.innerWidth + "x" + window.innerHeight + "\x1b[0m",
        " \x1b[38;5;123m                              ||,%%%%%%%%%%/\x1b[0m                   Theme:       \x1b[35mhackintosh Dark\x1b[0m",
        " \x1b[38;5;123m                              ;|%%%%%%%%%'/`-\"\"`.\x1b[0m             Engine:      \x1b[37mChromium Terminal\x1b[0m",
        " \x1b[38;5;159m                             /: %%%%%%%%'/ c$$$$.`.\x1b[0m            Memory:      \x1b[37m" + Math.round((performance?.memory?.usedJSHeapSize || 67108864) / 1048576) + " MB\x1b[0m",
        " \x1b[38;5;159m                `.______     \\\\ \\\\%%%%%%%'/.$$YF\"Y$: )\x1b[0m          Uptime:     \x1b[37m" + Math.floor(performance.now() / 1000) + "s\x1b[0m",
        " \x1b[38;5;195m              _________ \"`..\\\\`o \\\\`%%' ,',$F,.   $F )\x1b[0m         Packages:    \x1b[37m1337 (npm)\x1b[0m",
        " \x1b[38;5;195m     ___,--\"\"'dOOO;,:%%`-._ o_,O_   ,'\"',d88)  '  )\x1b[0m",
        " \x1b[38;5;45m  -\"'. YOOOOOOO';%%%%%%%%%;`-O   )_     ,X888F   _/\x1b[0m",
        " \x1b[38;5;45m      \\\\ YOOOO',%%%%%%%%%%Y    \\\\__;`),-.  `\"\"F  ,'\x1b[0m",
        " \x1b[38;5;51m       \\\\ `\" ,%%%%%%%%%%,' _,-   \\\\-' \\\\_ `------'\x1b[0m",
        " \x1b[38;5;51m        \\\\_ %%%%',%%%%%_,-' ,;    ( _,-\\\\\x1b[0m",
        " \x1b[38;5;87m          `-.__`%%',-' .c$$'     |\\\\-_,-\\\\\x1b[0m",
        " \x1b[38;5;87m               `\"\"; ,$$$',md8oY  : `\\\\_,')\x1b[0m",
        " \x1b[38;5;123m                 ( ,$$$F `88888  ;   `--'\x1b[0m",
        " \x1b[38;5;123m                  \\\\`$$(    `\"\"' /\x1b[0m",
        " \x1b[38;5;159m                   \\\\`\"$$c'   _,'\x1b[0m",
        " \x1b[38;5;159m                    `.____,-'\x1b[0m",
        "",
        " \x1b[40m   \x1b[0m\x1b[41m   \x1b[0m\x1b[42m   \x1b[0m\x1b[43m   \x1b[0m\x1b[44m   \x1b[0m\x1b[45m   \x1b[0m\x1b[46m   \x1b[0m\x1b[47m   \x1b[0m",
        "",
      ]
    };

    if (cmd === "clear") return "CLEAR";
    if (cmd === "echo") return [args || ""];
    if (cmd === "") return [""];
    if (cmd === "open") return [`Opening ${args || "application"}...`];
    cat: if (cmd === "cat" && args === "readme.md")
      return [
        "# hackintosh.web",
        "",
        "A web-native macOS experience built with React.",
        "github.com/gaminghackintosh",
        "",
        "## Features",
        "- Draggable windows with traffic lights",
        "- Dock with magnification",
        "- Finder, Terminal, Notes",
        "- Live clock and menu bar",
        "",
        "## Stack",
        "React 18 · CSS-in-JS · Vite",
      ];
    if (cmd === "git" && parts[1] === "log") return cmds["git log"];
    if (cmds[cmd]) return cmds[cmd];
    return [`\x1b[31m${cmd}: command not found\x1b[0m. Type 'help' for available commands.`];
  };

  const handleSubmit = () => {
    const cmd = input.trim();
    if (runCommand(cmd) === "CLEAR") {
      setHistory([{ type: "output", text: "" }]);
    } else {
      const lines = runCommand(cmd);
      setHistory((prev) => [
        ...prev,
        { type: "prompt", text: cmd },
        ...lines.map((t) => ({ type: "output", text: t })),
      ]);
    }
    setCmdHistory((prev) => (cmd ? [cmd, ...prev] : prev));
    setCmdIdx(-1);
    setInput("");
  };

  // Simple ANSI color renderer
  const renderLine = (text) => {
    const ansiMap = {
      "\x1b[0m": "</span>",
      "\x1b[31m": '<span style="color:#ff453a">',
      "\x1b[32m": '<span style="color:#32d74b">',
      "\x1b[33m": '<span style="color:#ffd60a">',
      "\x1b[34m": '<span style="color:#0a84ff">',
      "\x1b[35m": '<span style="color:#bf5af2">',
      "\x1b[36m": '<span style="color:#5ac8fa">',
      "\x1b[37m": '<span style="color:#e5e5ea">',
      "\x1b[41m": '<span style="background:#ff453a;color:#ff453a">',
      "\x1b[43m": '<span style="background:#ffd60a;color:#ffd60a">',
      "\x1b[42m": '<span style="background:#32d74b;color:#32d74b">',
      "\x1b[46m": '<span style="background:#5ac8fa;color:#5ac8fa">',
      "\x1b[44m": '<span style="background:#0a84ff;color:#0a84ff">',
      "\x1b[45m": '<span style="background:#bf5af2;color:#bf5af2">',
    };
    let result = text;
    Object.entries(ansiMap).forEach(([code, tag]) => {
      result = result.split(code).join(tag);
    });
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        background: "rgba(16,16,18,0.99)", height: "100%",
        fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", "Consolas", monospace',
        fontSize: 13, color: "#d4d4d4",
        overflowY: "auto", cursor: "text",
        display: "flex", flexDirection: "column",
        padding: "12px 14px",
      }}
    >
      <div style={{ flex: 1 }}>
        {history.map((entry, i) => (
          <div key={i} style={{ lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {entry.type === "prompt" ? (
              <span>
                <span style={{ color: "#32d74b" }}>gaminghackintosh</span>
                <span style={{ color: "#48484a" }}>@</span>
                <span style={{ color: "#0a84ff" }}>hackintosh.web</span>
                <span style={{ color: "#636366" }}>:~$ </span>
                <span style={{ color: "#f2f2f7" }}>{entry.text}</span>
              </span>
            ) : (
              renderLine(entry.text)
            )}
          </div>
        ))}
      </div>

      {/* Input line */}
      <div style={{ display: "flex", alignItems: "center", marginTop: 2, flexShrink: 0 }}>
        <span style={{ color: "#32d74b", flexShrink: 0 }}>gaminghackintosh</span>
        <span style={{ color: "#48484a", flexShrink: 0 }}>@</span>
        <span style={{ color: "#0a84ff", flexShrink: 0 }}>hackintosh.web</span>
        <span style={{ color: "#636366", flexShrink: 0 }}>:~$ </span>
        <input
          ref={inputRef}
          value={input}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "ArrowUp") {
              const ni = Math.min(cmdIdx + 1, cmdHistory.length - 1);
              setCmdIdx(ni); setInput(cmdHistory[ni] || "");
            }
            if (e.key === "ArrowDown") {
              const ni = Math.max(cmdIdx - 1, -1);
              setCmdIdx(ni); setInput(ni === -1 ? "" : cmdHistory[ni]);
            }
          }}
          style={{
            background: "transparent", border: "none", outline: "none",
            color: "#f2f2f7", flex: 1,
            fontFamily: "inherit", fontSize: "inherit",
            caretColor: "#f2f2f7",
          }}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

// ─── Notes ──────────────────────────────────────────────────
function NotesContent() {
  const initialNotes = [
    {
      id: 1, title: "hackintosh.web Roadmap",
      content: "# hackintosh.web 🍎\n\nProject roadmap:\n\n✅ Draggable windows\n✅ Dock with magnification\n✅ Terminal emulator\n✅ Finder with sidebar\n✅ Notes app\n\n🔲 Safari browser\n🔲 Spotlight search (⌘ Space)\n🔲 Mission Control\n🔲 Notifications\n🔲 App Store\n🔲 Calendar\n🔲 Dark/Light mode toggle",
      modified: "Just now",
    },
    {
      id: 2, title: "React Patterns",
      content: "# React Patterns\n\nuseState – reactive state\nuseEffect – side effects\nuseRef – mutable refs / DOM\nuseCallback – memoize fns\n\nKey rules:\n- Lift state up\n- Composition > inheritance\n- Keys on lists\n- Never mutate state directly",
      modified: "Yesterday",
    },
    {
      id: 3, title: "Shopping List",
      content: "- Coffee ☕\n- Matcha 🍵\n- Energy drinks 🔋\n- More RAM",
      modified: "2 days ago",
    },
  ];

  const [notes, setNotes] = useState(initialNotes);
  const [activeId, setActiveId] = useState(1);

  const activeNote = notes.find((n) => n.id === activeId);

  const updateContent = (content) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === activeId ? { ...n, content, modified: "Just now" } : n))
    );
  };

  return (
    <div style={{
      display: "flex", height: "100%",
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    }}>
      {/* Note List */}
      <div style={{
        width: 210, flexShrink: 0,
        background: "rgba(36,36,40,0.96)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "10px 14px 8px",
          fontSize: 11, fontWeight: 700,
          color: "rgba(255,255,255,0.3)",
          letterSpacing: 0.8,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          ALL NOTES — {notes.length}
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveId(note.id)}
              style={{
                padding: "10px 14px",
                background: activeId === note.id ? "rgba(255,190,0,0.16)" : "transparent",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                cursor: "pointer",
                borderLeft: activeId === note.id ? "3px solid #ffd60a" : "3px solid transparent",
                transition: "background 0.1s",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 13, color: "rgba(255,255,255,0.86)", marginBottom: 3 }}>
                {note.title}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)" }}>{note.modified}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <textarea
        value={activeNote?.content || ""}
        onChange={(e) => updateContent(e.target.value)}
        placeholder="Start writing..."
        style={{
          flex: 1, background: "rgba(22,22,26,0.99)",
          border: "none", outline: "none",
          color: "rgba(255,255,255,0.82)",
          fontFamily: '"SF Mono", "Fira Code", monospace',
          fontSize: 14, lineHeight: 1.75,
          padding: "22px 28px", resize: "none",
        }}
      />
    </div>
  );
}

// ─── Coming Soon Placeholder ────────────────────────────────
function PlaceholderContent({ appId }) {
  const app = APPS.find((a) => a.id === appId);
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100%", gap: 14,
      color: "rgba(255,255,255,0.35)",
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <img
        src={app?.icon}
        alt={app?.name}
        style={{
          width: 72,
          height: 72,
          objectFit: "contain",
        }}
      />
      <span style={{ fontSize: 20, fontWeight: 300 }}>{app?.name}</span>
      <span style={{
        fontSize: 12, opacity: 0.5,
        background: "rgba(255,255,255,0.06)",
        padding: "4px 12px", borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        Coming soon
      </span>
    </div>
  );
}

// ─── Root App ───────────────────────────────────────────────
export default function MacOSWeb() {
  const [windows, setWindows] = useState([]);
  const [openApps, setOpenApps] = useState([]);
  const [activeWin, setActiveWin] = useState(null);

  const openApp = (appId) => {
    const existing = windows.find((w) => w.id === appId);
    if (existing) { focusWindow(appId); return; }

    const p = INITIAL_POSITIONS[appId] || { x: 120, y: 80, w: 600, h: 420 };
    const app = APPS.find((a) => a.id === appId);
    setWindows((prev) => [
      ...prev,
      { id: appId, title: app?.name || appId, x: p.x, y: p.y, width: p.w, height: p.h, zIndex: ++zCounter },
    ]);
    setOpenApps((prev) => (prev.includes(appId) ? prev : [...prev, appId]));
    setActiveWin(appId);
  };

  const closeWindow = (appId) => {
    setWindows((prev) => prev.filter((w) => w.id !== appId));
    setOpenApps((prev) => prev.filter((id) => id !== appId));
    setActiveWin((cur) => (cur === appId ? null : cur));
  };

  const focusWindow = (appId) => {
    setWindows((prev) => prev.map((w) => (w.id === appId ? { ...w, zIndex: ++zCounter } : w)));
    setActiveWin(appId);
  };

  const renderContent = (appId) => {
    switch (appId) {
      case "finder":   return <FinderContent />;
      case "terminal": return <TerminalContent />;
      case "notes":    return <NotesContent />;
      default:         return <PlaceholderContent appId={appId} />;
    }
  };

  const activeApp = activeWin ? APPS.find((a) => a.id === activeWin)?.name : "Finder";

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", background: WALLPAPER }}>
      {/* Subtle vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)",
      }} />

      {/* Desktop icons top-right */}
      <div style={{
        position: "absolute", top: 44, right: 14,
        display: "flex", flexDirection: "column", gap: 8, zIndex: 2,
      }}>
        {[{ name: "hackintosh.web", icon: "💿" }].map((item) => (
          <div
            key={item.name}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 4, cursor: "pointer", padding: 8, borderRadius: 8,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            onDoubleClick={() => openApp("finder")}
          >
            <span style={{ fontSize: 44 }}>{item.icon}</span>
            <span style={{
              color: "white", fontSize: 11, textAlign: "center",
              textShadow: "0 1px 4px rgba(0,0,0,0.9)",
              background: "rgba(0,0,0,0.3)", padding: "1px 5px", borderRadius: 3,
            }}>
              {item.name}
            </span>
          </div>
        ))}
      </div>

      <MenuBar activeApp={activeApp} />

      {/* Windows */}
      {windows.map((win) => (
        <AppWindow
          key={win.id} win={win}
          isActive={activeWin === win.id}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => closeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
        >
          {renderContent(win.id)}
        </AppWindow>
      ))}

      <Dock onOpen={openApp} openApps={openApps} />
    </div>
  );
}