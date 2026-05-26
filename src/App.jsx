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

import FinderContent from "./components/Finder/FinderContent";

import MobileNotSupported from "./components/MNS/MobileNotSupported";
import { APPS } from "./constants/apps";
import { AppWindow } from "./components/AppWindow/AppWindow";

import { MenuBar } from "./components/apps/MenuBar/MenuBar";
import { TerminalContent } from "./components/apps/Terminal/Terminal";
import { NotesContent } from "./components/apps/Notes/NotesContent";
import { SettingsContent } from "./components/apps/Settings/SettingsContent";

import { DEFAULT_WALLPAPER } from "./constants/wallpapers";

const INITIAL_POSITIONS = {
  finder:   { x: 80,  y: 56,  w: 740, h: 500 },  // эталон
  safari:   { x: 100, y: 60,  w: 780, h: 520 },  // эталон
  notes:    { x: 200, y: 90,  w: 620, h: 440 },
  terminal: { x: 140, y: 70,  w: 780, h: 520 },  
  settings: { x: 80,  y: 56,  w: 740, h: 500 },  
  music:    { x: 180, y: 80,  w: 740, h: 500 },  
};


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
    id: DEFAULT_WALLPAPER.id,
    type: "image",
    value: DEFAULT_WALLPAPER.image,
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

  useEffect(() => {
    window.openAppFromFinder = (appId) => {
      openApp(appId);
    };
    return () => {
      delete window.openAppFromFinder;
    };
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
      { 
        id: appId, 
        title: app?.name || appId, 
        x: p.x, 
        y: p.y, 
        width: p.w, 
        height: p.h, 
        zIndex: ++zCounter 
      },
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
        return <FinderContent openApp={openApp} />;
      case "terminal":
        return <TerminalContent />;
      case "notes":
        return <NotesContent />;
      case "settings":
        return (
          <SettingsContent
            currentWallpaper={wallpaperState.id}
            onWallpaperChange={handleWallpaperChange}
          />
        );
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
    
  const wallpaperStyle = {
    backgroundImage: `url(${wallpaperState.value})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#0b0b0c",
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", ...wallpaperStyle }}>
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
          titleBarHidden={win.id === 'settings'}
        >
          {renderContent(win.id)}
        </AppWindow>
      ))}

      <Dock onOpen={openApp} openApps={openApps} />
    </div>
  );
}
