import React, { useState, useEffect, useRef } from "react";
import {
  MENU_ICONS,
  MENU_ICON_FALLBACK,
  DESKTOP_ICONS,
  DESKTOP_ICON_FALLBACK,
  FINDER_ICONS,
  FINDER_ICON_FALLBACK,
} from "./assets/paths";
import { AssetIcon } from "./components/AssetIcon";
import Dock from "./components/Dock";
import MobileNotSupported from "./components/MNS/MobileNotSupported";
import SafariContent from "./apps/Safari/SafariContent";
import { APPS } from "./constants/apps";
import wallpaperDefault from "./assets/wallpapers/wallpaper_default.png";
import DocumentsIcon from "./assets/icons/finder/Folder.png";

const WALLPAPER_CSS = {
  backgroundImage: `url(${wallpaperDefault})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundColor: "#0b0b0c",
};

const INITIAL_POSITIONS = {
  finder:   { x: 80,  y: 56,  w: 740, h: 500 },  // эталон
  safari:   { x: 100, y: 60,  w: 780, h: 520 },  // эталон
  notes:    { x: 200, y: 90,  w: 620, h: 440 },  // без изменений
  terminal: { x: 140, y: 70,  w: 780, h: 520 },  // ← было 660×420, теперь = Safari
  settings: { x: 80,  y: 56,  w: 740, h: 500 },  // ← было 260/100, теперь = Finder
  music:    { x: 180, y: 80,  w: 740, h: 500 },  // ← было 500×420, теперь ≈ Finder
};

/* ===== APPLE SVG ===== */
const AppleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    style={{ display: "block" }}
    fill="currentColor"
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47c-1.34.03-1.77-.79-3.29-.79c-1.53 0-2 .77-3.27.82c-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51c1.28-.02 2.5.87 3.29.87c.78 0 2.26-1.07 3.81-.91c.65.03 2.47.26 3.64 1.98c-.09.06-2.17 1.28-2.15 3.81c.03 3.02 2.65 4.03 2.68 4.04c-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5c.13 1.17-.34 2.35-1.04 3.19c-.69.85-1.83 1.51-2.95 1.42c-.15-1.15.41-2.35 1.05-3.11"/>
  </svg>
);

let zCounter = 100;

/* ===== MENU BAR ===== */
function MenuBar({ activeApp }) {
  const [time, setTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState(null);
  const barRef = useRef(null);

  const menuOptions = {
    File: ["New Folder", "New Window", "Open...", "Close Window"],
    Edit: ["Undo", "Redo", "Cut", "Copy", "Paste", "Select All"],
    View: ["Show Sidebar", "Show Path Bar", "Sort By", "Clean Up"],
    Window: ["Minimize", "Zoom", "Bring All to Front"],
    Help: ["Search", "About This Mac"],
  };

  const leftItems = [" ", activeApp || "Finder", "File", "Edit", "View", "Window", "Help"];

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeMenu) return;

    const handleClickOutside = (event) => {
      if (barRef.current && !barRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);

  const fmtTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const fmtDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div ref={barRef} className="menuBar">
      <div className="menuBar__left">
        {leftItems.map((item, i) => {
          const isClickable = i > 1;

          return (
            <div key={i} className="menuBar__itemWrapper">
              <span
                className={[
                  "menuBar__item",
                  isClickable ? "isClickable" : "",
                  activeMenu === item ? "isActive" : "",
                  i === 0 ? "isApple" : "",
                  i <= 1 ? "isBold" : "",
                ].join(" ")}
                onClick={() => {
                  if (!isClickable) return;
                  setActiveMenu(activeMenu === item ? null : item);
                }}
              >
                {item === " " ? <AppleIcon /> : item}
              </span>

              {activeMenu === item && menuOptions[item] && (
                <div className="menuBar__dropdown">
                  {menuOptions[item].map((option, idx) => (
                    <div
                      key={idx}
                      className="menuBar__dropdownItem"
                      onClick={() => setActiveMenu(null)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="menuBar__right">
        <span className="menuBar__icon">🔋</span>
        <span className="menuBar__icon">📶</span>
        <span className="menuBar__date">{fmtDate(time)}</span>
        <span className="menuBar__time">{fmtTime(time)}</span>
      </div>
    </div>
  );
}

/* ===== APP WINDOW ===== */
function AppWindow({ win, onClose, onMinimize, onFocus, isActive, children }) {
  const [pos, setPos] = useState({ x: win.x, y: win.y });
  const [size, setSize] = useState({ width: win.width, height: win.height });
  const dragging = useRef(false);
  const resizing = useRef(false);
  const resizeEdge = useRef(null);
  const offset = useRef({ x: 0, y: 0 });
  const windowRef = useRef(null);
  const [cursor, setCursor] = useState("default");

  const RESIZE_EDGE_SIZE = 10;
  const TITLE_BAR_HEIGHT = 40;

  const getResizeEdge = (e) => {
    if (!windowRef.current) return null;
    
    const rect = windowRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Don't allow resize in titlebar area
    if (y < TITLE_BAR_HEIGHT) return null;
    
    const edges = [];
    if (y < TITLE_BAR_HEIGHT + RESIZE_EDGE_SIZE) edges.push("top");
    if (y > rect.height - RESIZE_EDGE_SIZE) edges.push("bottom");
    if (x < RESIZE_EDGE_SIZE) edges.push("left");
    if (x > rect.width - RESIZE_EDGE_SIZE) edges.push("right");
    
    return edges.length > 0 ? edges.join("-") : null;
  };

  const getCursorStyle = (edge) => {
    if (!edge) return "default";
    const cursorMap = {
      "top": "ns-resize",
      "bottom": "ns-resize",
      "left": "ew-resize",
      "right": "ew-resize",
      "top-left": "nwse-resize",
      "top-right": "nesw-resize",
      "bottom-left": "nesw-resize",
      "bottom-right": "nwse-resize",
    };
    return cursorMap[edge] || "default";
  };

  const onWindowMouseMove = (e) => {
    const edge = getResizeEdge(e);
    setCursor(getCursorStyle(edge));
  };

  const onWindowMouseDown = (e) => {
    const edge = getResizeEdge(e);
    if (edge) {
      e.preventDefault();
      onFocus();
      resizing.current = true;
      resizeEdge.current = edge;
      offset.current = { x: e.clientX, y: e.clientY, w: size.width, h: size.height };

      const onMove = (ev) => {
        if (!resizing.current) return;
        const dx = ev.clientX - offset.current.x;
        const dy = ev.clientY - offset.current.y;
        const minWidth = 300;
        const minHeight = 200;

        const newSize = { width: offset.current.w, height: offset.current.h };
        const newPos = { ...pos };

        if (resizeEdge.current.includes("right")) {
          newSize.width = Math.max(minWidth, offset.current.w + dx);
        }
        if (resizeEdge.current.includes("left")) {
          const newWidth = Math.max(minWidth, offset.current.w - dx);
          if (newWidth >= minWidth) {
            newSize.width = newWidth;
            newPos.x = pos.x + dx;
          }
        }
        if (resizeEdge.current.includes("bottom")) {
          newSize.height = Math.max(minHeight, offset.current.h + dy);
        }
        if (resizeEdge.current.includes("top")) {
          const newHeight = Math.max(minHeight, offset.current.h - dy);
          if (newHeight >= minHeight) {
            newSize.height = newHeight;
            newPos.y = pos.y + dy;
          }
        }

        setPos(newPos);
        setSize(newSize);
      };

      const onUp = () => {
        resizing.current = false;
        resizeEdge.current = null;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    }
  };

  const onTitleMouseDown = (e) => {
    if (e.button !== 0 || getResizeEdge(e)) return;
    onFocus();
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };

    const onMove = (ev) => {
      if (!dragging.current) return;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - size.width, ev.clientX - offset.current.x)),
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
      ref={windowRef}
      onMouseDown={onWindowMouseDown}
      onMouseMove={onWindowMouseMove}
      onMouseLeave={() => setCursor("default")}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: size.width,
        height: size.height,
        background: "rgba(25,25,28,0.88)",
        backdropFilter: "blur(40px) saturate(1.8)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: isActive
          ? "0 32px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.1)"
          : "0 14px 40px rgba(0,0,0,0.45)",
        zIndex: win.zIndex,
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s",
        cursor: cursor,
      }}
    >
      <div
        onMouseDown={onTitleMouseDown}
        style={{
          height: 40,
          flexShrink: 0,
          background: isActive ? "rgba(48,48,52,0.9)" : "rgba(38,38,42,0.9)",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          cursor: "move",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          userSelect: "none",
          transition: "background 0.2s",
        }}
      >
        <div style={{ display: "flex", gap: 7, zIndex: 1 }} onMouseDown={(e) => e.stopPropagation()}>
          {trafficLights.map((btn, i) => (
            <div
              key={i}
              onClick={btn.action || undefined}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
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
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            color: isActive ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.35)",
            fontSize: 13,
            fontWeight: 500,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            letterSpacing: 0.15,
            pointerEvents: "none",
          }}
        >
          {win.title}
        </span>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>
    </div>
  );
}

/* ===== FINDER ===== */
function FinderContent() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentFolder, setCurrentFolder] = useState("Home");

  const sidebar = [
    {
      label: "FAVOURITES",
      items: [
        { name: "Home", iconPath: MENU_ICONS.home, icon: MENU_ICON_FALLBACK.home },
        { name: "Desktop", iconPath: MENU_ICONS.desktop, icon: MENU_ICON_FALLBACK.desktop },
        { name: "Documents", iconPath: MENU_ICONS.documents, icon: MENU_ICON_FALLBACK.documents },
        { name: "Downloads", iconPath: MENU_ICONS.downloads, icon: MENU_ICON_FALLBACK.downloads },
        { name: "Projects", iconPath: MENU_ICONS.projects, icon: MENU_ICON_FALLBACK.projects },
      ],
    },
    {
      label: "LOCATIONS",
      items: [
        { name: "Macintosh HD", iconPath: MENU_ICONS.macintoshHd, icon: MENU_ICON_FALLBACK.macintoshHd },
        { name: "Network", iconPath: MENU_ICONS.network, icon: MENU_ICON_FALLBACK.network },
      ],
    },
  ];

  const files = {
    Home: [
      { name: "Documents", type: "folder", iconType: "folder", size: "—", modified: "Today" },
      { name: "Downloads", type: "folder", iconType: "folder", size: "—", modified: "Today" },
      { name: "Desktop", type: "folder", iconType: "folder", size: "—", modified: "Today" },
      { name: "Projects", type: "folder", iconType: "folder", size: "—", modified: "Today" },
      { name: "readme.md", type: "file", iconType: "file", size: "4 KB", modified: "Today", preview: "# hackintosh.web\n\nA web-native macOS experience built with React." },
    ],
    Documents: [
      { name: "Projects", type: "folder", iconType: "folder", size: "—", modified: "2 days ago" },
      { name: "resume.pdf", type: "file", iconType: "pdf", size: "128 KB", modified: "Last week" },
      { name: "notes.txt", type: "file", iconType: "file", size: "2 KB", modified: "Yesterday", preview: "- Coffee ☕\n- Matcha 🍵\n- Energy drinks 🔋\n- More RAM" },
    ],
    Downloads: [
      { name: "hackintosh-web-v1.zip", type: "file", iconType: "archive", size: "8.2 MB", modified: "Today" },
      { name: "wallpaper.png", type: "file", iconType: "image", size: "3.1 MB", modified: "Yesterday" },
    ],
    Desktop: [
      { name: "hackintosh.web", type: "application", iconType: "application", size: "2 MB", modified: "Today" },
      { name: "Macintosh HD", type: "folder", iconType: "folder", size: "—", modified: "Today" },
    ],
    Projects: [
      { name: "hackintosh.web", type: "folder", iconType: "folder", size: "—", modified: "Just now" },
      { name: "portfolio", type: "folder", iconType: "folder", size: "—", modified: "3 days ago" },
    ],
    "hackintosh.web": [
      { name: "index.html", type: "file", iconType: "file", size: "9 KB", modified: "Just now" },
      { name: "package.json", type: "file", iconType: "file", size: "1 KB", modified: "Just now" },
      { name: "src", type: "folder", iconType: "folder", size: "—", modified: "Just now" },
    ],
    "Macintosh HD": [
      { name: "Applications", type: "folder", iconType: "folder", size: "—", modified: "Today" },
      { name: "Library", type: "folder", iconType: "folder", size: "—", modified: "Today" },
      { name: "System", type: "folder", iconType: "folder", size: "—", modified: "Today" },
      { name: "Users", type: "folder", iconType: "folder", size: "—", modified: "Today" },
    ],
    Applications: [
      { name: "Finder", type: "application", iconType: "application", size: "4 MB", modified: "Today" },
      { name: "Safari", type: "application", iconType: "application", size: "15 MB", modified: "Today" },
      { name: "Notes", type: "application", iconType: "application", size: "6 MB", modified: "Today" },
      { name: "Terminal", type: "application", iconType: "application", size: "3 MB", modified: "Today" },
    ],
    Library: [],
    System: [],
    Users: [
      { name: "gaminghackintosh", type: "folder", iconType: "folder", size: "—", modified: "Today" },
    ],
    Network: [],
  };

  const currentFiles = files[currentFolder] || [];
  const selectedItem = currentFiles.find((file) => file.name === selectedFile);

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      }}
    >
      <div
        style={{
          width: 200,
          flexShrink: 0,
          background: "rgba(36,36,40,0.95)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          padding: "12px 0",
          overflowY: "auto",
        }}
      >
        {sidebar.map((section) => (
          <div key={section.label}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "rgba(255,255,255,0.3)",
                padding: "10px 18px 4px",
                letterSpacing: 1.1,
              }}
            >
              {section.label}
            </div>
            {section.items.map((item) => (
              <div
                key={item.name}
                onClick={() => {
                  setCurrentFolder(item.name);
                  setSelectedFile(null);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 14px",
                  borderRadius: 10,
                  margin: "2px 10px",
                  background: currentFolder === item.name ? "rgba(255,255,255,0.12)" : "transparent",
                  color: currentFolder === item.name ? "white" : "rgba(255,255,255,0.72)",
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "background 0.12s",
                }}
                onMouseEnter={(e) => {
                  if (currentFolder !== item.name) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  if (currentFolder !== item.name) e.currentTarget.style.background = "transparent";
                }}
              >
                <AssetIcon path={item.iconPath} fallback={item.icon} size={18} alt={item.name} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: selectedItem ? "1.6fr 0.9fr" : "1fr", overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div
            style={{
              padding: "10px 16px",
              background: "rgba(40,40,44,0.88)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Finder</span>
            <span style={{ color: "rgba(255,255,255,0.18)" }}>•</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{currentFolder}</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(28,28,30,0.95)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Path:</span>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>{currentFolder}</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 90px 130px",
                padding: "10px 14px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.35)",
                fontSize: 11,
                userSelect: "none",
              }}
            >
              <span>Name</span>
              <span>Size</span>
              <span>Date Modified</span>
            </div>

            {currentFiles.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 260,
                  color: "rgba(255,255,255,0.28)",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 42 }}>📭</span>
                <span style={{ fontSize: 13 }}>This folder is empty.</span>
              </div>
            ) : (
              currentFiles.map((file) => (
                <div
                  key={file.name}
                  onClick={() => setSelectedFile(file.name)}
                  onDoubleClick={() => {
                    if (file.type === "folder") {
                      setCurrentFolder(file.name);
                      setSelectedFile(null);
                    }
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 90px 130px",
                    alignItems: "center",
                    padding: "10px 14px",
                    borderRadius: 10,
                    cursor: "pointer",
                    background: selectedFile === file.name ? "rgba(10,132,255,0.2)" : "transparent",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 13,
                    transition: "background 0.12s",
                    marginBottom: 4,
                  }}
                  onMouseEnter={(e) => {
                    if (selectedFile !== file.name) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    if (selectedFile !== file.name) e.currentTarget.style.background = selectedFile === file.name ? "rgba(10,132,255,0.2)" : "transparent";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <AssetIcon
                      path={FINDER_ICONS[file.iconType || file.type]}
                      fallback={FINDER_ICON_FALLBACK[file.iconType || file.type]}
                      size={18}
                      alt={file.name}
                    />
                    <span>{file.name}</span>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.45)" }}>{file.size}</span>
                  <span style={{ color: "rgba(255,255,255,0.45)" }}>{file.modified}</span>
                </div>
              ))
            )}
          </div>

          <div
            style={{
              padding: "10px 16px",
              background: "rgba(36,36,40,0.9)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.3)",
              fontSize: 11,
            }}
          >
            {currentFiles.length} item{currentFiles.length === 1 ? "" : "s"}
            {selectedFile ? ` • Selected: ${selectedFile}` : ""}
          </div>
        </div>

        {selectedItem && (
          <div
            style={{
              padding: "18px",
              background: "rgba(24,24,26,0.94)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <AssetIcon
                path={FINDER_ICONS[selectedItem.iconType || selectedItem.type]}
                fallback={FINDER_ICON_FALLBACK[selectedItem.iconType || selectedItem.type]}
                size={42}
                alt={selectedItem.name}
              />
              <div>
                <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 18, fontWeight: 600 }}>{selectedItem.name}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>{selectedItem.type.toUpperCase()}</div>
              </div>
            </div>

            <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 13, marginBottom: 14 }}>
              <div style={{ marginBottom: 8 }}><strong>Size:</strong> {selectedItem.size}</div>
              <div style={{ marginBottom: 8 }}><strong>Modified:</strong> {selectedItem.modified}</div>
              <div><strong>Kind:</strong> {selectedItem.type === "folder" ? "Folder" : selectedItem.iconType === "application" ? "Application" : "File"}</div>
            </div>

            {selectedItem.preview ? (
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: 12,
                  padding: "14px",
                  whiteSpace: "pre-wrap",
                  fontSize: 12,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {selectedItem.preview}
              </div>
            ) : (
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>No preview available for this item.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== Terminal ===== */
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
  const [gitLogLines, setGitLogLines] = useState([]);
  const [gitLogLoading, setGitLogLoading] = useState(true);
  const [gitLogError, setGitLogError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchGitLog() {
      try {
        const response = await fetch(
          "https://api.github.com/repos/gaminghackintosh/hackintosh.web/commits?sha=code-root&per_page=10",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`GitHub API returned ${response.status}`);
        }

        const commits = await response.json();
        const lines = commits.flatMap((commit) => {
          const author = commit.commit.author || {};
          const date = author.date ? new Date(author.date) : new Date();
          const message = commit.commit.message?.split("\n")[0] || "(no commit message)";
          return [
            `\x1b[33mcommit ${commit.sha.slice(0, 7)}\x1b[0m`,
            `Author: ${author.name || "Unknown"} <${author.email || "noreply@github.com"}>`,
            `Date:   ${date.toUTCString()}`,
            "",
            `    ${message}`,
            "",
          ];
        });

        setGitLogLines(lines.length ? lines : ["No commits found."]);
      } catch (error) {
        if (error.name !== "AbortError") {
          setGitLogError(error.message);
          setGitLogLines([]);
        }
      } finally {
        setGitLogLoading(false);
      }
    }

    fetchGitLog();
    return () => controller.abort();
  }, []);

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
        "  git log   – repository commit history",
      ],
      ls: [
        "Desktop/    Documents/    Downloads/    Movies/    Music/",
        "Pictures/   Projects/     Public/       readme.md",
      ],
      pwd: ["/Users/gaminghackintosh"],
      whoami: ["gaminghackintosh"],
      uname: [
        "Darwin hackintosh.web 24.0.0 Darwin Kernel Version 24.0.0; root:xnu/RELEASE_ARM64",
      ],
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
        " \x1b[38;5;39m                                     ,\x1b[0m                          \x1b[32mgaminghackintosh\x1b[0m@\x1b[36mhackintosh.web\x1b[0m",
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
    if (cmd === "open") return [`Opening ${args || "application"}... `];
    if (cmd === "cat" && args === "readme.md")
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
    if (cmd === "git" && parts[1] === "log") {
      if (gitLogLoading) {
        return ["Fetching commit history from GitHub..."];
      }
      if (gitLogError) {
        return [`\x1b[31merror:\x1b[0m ${gitLogError}`];
      }
      return gitLogLines.length ? gitLogLines : ["No commit history available."];
    }

    if (cmds[cmd]) return cmds[cmd];
    return [
      `\x1b[31m${cmd}: command not found\x1b[0m. Type 'help' for available commands.`,
    ];
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

const renderLine = (text) => {
  const ansiMap = {
    "\x1b[0m": "</span>",

    "\x1b[30m": '<span style="color:#000">',
    "\x1b[31m": '<span style="color:#ff5f56">',
    "\x1b[32m": '<span style="color:#27c93f">',
    "\x1b[33m": '<span style="color:#ffbd2e">',
    "\x1b[34m": '<span style="color:#0a84ff">',
    "\x1b[35m": '<span style="color:#bf5af2">',
    "\x1b[36m": '<span style="color:#5ac8fa">',
    "\x1b[37m": '<span style="color:#f2f2f7">',

    "\x1b[1m": '<span style="font-weight:bold">',

    "\x1b[40m": '<span style="background:#1c1c1e;color:#1c1c1e">',
    "\x1b[41m": '<span style="background:#ff5f56;color:#ff5f56">',
    "\x1b[42m": '<span style="background:#27c93f;color:#27c93f">',
    "\x1b[43m": '<span style="background:#ffbd2e;color:#ffbd2e">',
    "\x1b[44m": '<span style="background:#0a84ff;color:#0a84ff">',
    "\x1b[45m": '<span style="background:#bf5af2;color:#bf5af2">',
    "\x1b[46m": '<span style="background:#5ac8fa;color:#5ac8fa">',
    "\x1b[47m": '<span style="background:#f2f2f7;color:#f2f2f7">',
  };

  let result = text;

  Object.entries(ansiMap).forEach(([code, tag]) => {
    result = result.split(code).join(tag);
  });

  return (
    <span
      dangerouslySetInnerHTML={{ __html: result }}
      style={{
        whiteSpace: "pre",
        fontVariantLigatures: "none",
      }}
    />
  );
};

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        background: "rgba(16,16,18,0.99)",
        height: "100%",
        fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", "Consolas", monospace',
        fontSize: 13,
        color: "#d4d4d4",
        overflowY: "auto",
        cursor: "text",
        display: "flex",
        flexDirection: "column",
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
              setCmdIdx(ni);
              setInput(cmdHistory[ni] || "");
            }
            if (e.key === "ArrowDown") {
              const ni = Math.max(cmdIdx - 1, -1);
              setCmdIdx(ni);
              setInput(ni === -1 ? "" : cmdHistory[ni]);
            }
          }}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#f2f2f7",
            flex: 1,
            fontFamily: "inherit",
            fontSize: "inherit",
            caretColor: "#f2f2f7",
          }}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

/* ===== NOTES ===== */
function NotesContent() {
  const initialNotes = [
    {
      id: 1,
      title: "hackintosh.web Roadmap",
      content:
        "# hackintosh.web 🍎\n\nProject roadmap:\n\n✅ Draggable windows\n✅ Dock with magnification\n✅ Terminal emulator\n✅ Finder with sidebar\n✅ Notes app\n\n🔲 Safari browser\n🔲 Spotlight search (⌘ Space)\n🔲 Mission Control\n🔲 Notifications\n🔲 App Store\n🔲 Calendar\n🔲 Dark/Light mode toggle",
      modified: "Just now",
    },
    {
      id: 2,
      title: "React Patterns",
      content:
        "# React Patterns\n\nuseState – reactive state\nuseEffect – side effects\nuseRef – mutable refs / DOM\nuseCallback – memoize fns\n\nKey rules:\n- Lift state up\n- Composition > inheritance\n- Keys on lists\n- Never mutate state directly",
      modified: "Yesterday",
    },
    {
      id: 3,
      title: "Shopping List",
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
    <div
      style={{
        display: "flex",
        height: "100%",
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      }}
    >
      <div
        style={{
          width: 210,
          flexShrink: 0,
          background: "rgba(36,36,40,0.96)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "10px 14px 8px",
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: 0.8,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
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
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.86)",
                  marginBottom: 3,
                }}
              >
                {note.title}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)" }}>{note.modified}</div>
            </div>
          ))}
        </div>
      </div>

      <textarea
        value={activeNote?.content || ""}
        onChange={(e) => updateContent(e.target.value)}
        placeholder="Start writing..."
        style={{
          flex: 1,
          background: "rgba(22,22,26,0.99)",
          border: "none",
          outline: "none",
          color: "rgba(255,255,255,0.82)",
          fontFamily: '"SF Mono", "Fira Code", monospace',
          fontSize: 14,
          lineHeight: 1.75,
          padding: "22px 28px",
          resize: "none",
        }}
      />
    </div>
  );
}

/* ================ Placeholder Content ================ */
function PlaceholderContent({ appId }) {
  const app = APPS.find((a) => a.id === appId);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 14,
        color: "rgba(255,255,255,0.35)",
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <AssetIcon path={app?.iconPath} fallback={app?.icon} size={68} alt={app?.name} />
      <span style={{ fontSize: 20, fontWeight: 300 }}>{app?.name}</span>
      <span
        style={{
          fontSize: 12,
          opacity: 0.5,
          background: "rgba(255,255,255,0.06)",
          padding: "4px 12px",
          borderRadius: 20,
        }}
      >
        Coming soon
      </span>
    </div>
  );
}

export default function App() {
  const [windows, setWindows] = useState([]);
  const [openApps, setOpenApps] = useState([]);
  const [activeWin, setActiveWin] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      // Просто проверяем ширину экрана - более надежно для мобильных
      setIsMobile(width <= 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const openApp = (appId) => {
    const existing = windows.find((w) => w.id === appId);
    if (existing) {
      focusWindow(appId);
      return;
    }

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
      case "finder":
        return <FinderContent />;
      case "safari":
        return <SafariContent />;
      case "terminal":
        return <TerminalContent />;
      case "notes":
        return <NotesContent />;
      default:
        return <PlaceholderContent appId={appId} />;
    }
  };

  const activeApp = activeWin ? APPS.find((a) => a.id === activeWin)?.name : "Finder";

  if (isMobile) {
    return <MobileNotSupported />;
  }

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", ...WALLPAPER_CSS }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 44,
          right: 14,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 2,
        }}
      >
        {[
          {
            name: "hackintosh.web",
            iconPath: DESKTOP_ICONS.hackintoshWeb,
            icon: DESKTOP_ICON_FALLBACK.hackintoshWeb,
          },
        ].map((item) => (
          <div
            key={item.name}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
            }}
            onDoubleClick={() => openApp("finder")}
          >
            <AssetIcon path={item.iconPath} fallback={item.icon} size={44} alt={item.name} style={{ borderRadius: 12 }} />
            <span
              style={{
                color: "white",
                fontSize: 11,
                textAlign: "center",
                textShadow: "0 1px 4px rgba(0,0,0,0.9)",
                background: "rgba(0,0,0,0.3)",
                padding: "1px 5px",
                borderRadius: 3,
              }}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>

      <MenuBar activeApp={activeApp} />

      {windows.map((win) => (
        <AppWindow
          key={win.id}
          win={win}
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
