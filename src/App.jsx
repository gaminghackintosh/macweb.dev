import React, { useState, useEffect, useRef } from "react";
import {
  MENU_ICONS,
  MENU_ICON_FALLBACK,
  DESKTOP_ICONS,
  DESKTOP_ICON_FALLBACK,
  FINDER_ICONS,
  FINDER_ICON_FALLBACK,
} from "./assets/paths";

// Import components
import BootScreen from "./components/Boot/BootScreen";
import { AssetIcon } from "./components/AssetIcon";
import Dock from "./components/Dock";
import MobileNotSupported from "./components/MNS/MobileNotSupported";
import { APPS } from "./constants/apps";
import { AppWindow } from "./components/AppWindow/AppWindow";

import { MenuBar } from "./components/apps/MenuBar/MenuBar";
import { TerminalContent } from "./components/apps/Terminal/Terminal";
import { NotesContent } from "./components/apps/Notes/NotesContent";
import { SettingsContent } from "./components/apps/Settings/SettingsContent";

// Import assets
import wallpaperDefault from "./assets/images/wallpapers/wallpaper_default.png";
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
  notes:    { x: 200, y: 90,  w: 620, h: 440 },
  terminal: { x: 140, y: 70,  w: 780, h: 520 },  
  settings: { x: 80,  y: 56,  w: 740, h: 500 },  
  music:    { x: 180, y: 80,  w: 740, h: 500 },  
};


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
        Do you seriously think that’s even possible? 😉
      </span>
    </div>
  );
}
let zCounter = 10;

export default function App() {
  const [windows, setWindows] = useState([]);
  const [openApps, setOpenApps] = useState([]);
  const [activeWin, setActiveWin] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);

  const [wallpaperState, setWallpaperState] = useState({
    id: "default",
    type: "image",
    value: wallpaperDefault
  });

  const handleWallpaperChange = (newWallpaper) => {
    setWallpaperState(newWallpaper);
  };

  
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      // Проверка ширины на mobile
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

  // ─── Рендер приложений ────────────────────────────────────────────────
  const renderContent = (appId) => {
    switch (appId) {
      case "finder":
        return <FinderContent />;
      case "terminal":
        return <TerminalContent />;
      case "notes":
        return <NotesContent />;
      case "settings":
        return <SettingsContent />;
      default:
        return <PlaceholderContent appId={appId} />;
    }
  };

  const activeApp = activeWin ? APPS.find((a) => a.id === activeWin)?.name : "Finder";

    if (!bootComplete) {
      return <BootScreen onComplete={() => setBootComplete(true)} />;
    }

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
