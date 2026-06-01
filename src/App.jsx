import React, { useState, useEffect, useMemo, useCallback } from "react";

import {
  DESKTOP_ICONS,
  DESKTOP_ICON_FALLBACK,
} from "./assets/paths";

// hooks
import { ContextMenu } from "./components/ContextMenu/ContextMenu";
import { useContextMenu } from "./hooks/useContextMenu";

import BootScreen from "./components/Boot/BootScreen";
import Dock from "./components/Dock";

import FinderContent from "./components/Finder/FinderContent";
import MobileNotSupported from "./components/MNS/MobileNotSupported";

import { APPS } from "./constants/apps";
import { AppWindow } from "./components/AppWindow/AppWindow";

import { MenuBar } from "./components/apps/MenuBar/MenuBar";
import { TerminalContent } from "./components/apps/Terminal/Terminal";
import { NotesContent } from "./components/apps/Notes/NotesContent";
import { SettingsContent } from "./components/apps/Settings/SettingsContent";
import { MusicContent } from "./components/apps/MusicApp/MusicContent";

import { DEFAULT_WALLPAPER } from "./constants/wallpapers";

const INITIAL_POSITIONS = {
  finder: { x: 80, y: 56, w: 740, h: 500 },
  safari: { x: 100, y: 60, w: 780, h: 520 },
  notes: { x: 200, y: 90, w: 620, h: 440 },
  terminal: { x: 140, y: 70, w: 780, h: 520 },
  settings: { x: 80, y: 56, w: 740, h: 500 },
  music: { x: 180, y: 80, w: 740, h: 500 },
};

// Высота Dock в пикселях (настройте под свою тему)
const DOCK_HEIGHT = 80;

function PlaceholderContent({ appId }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      gap: 14,
      color: "rgba(255,255,255,0.35)",
      fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <span style={{ fontSize: 24 }}>{appId}</span>
    </div>
  );
}

let zCounter = 10;

export default function App() {
  const [windows, setWindows] = useState([]);
  const [openApps, setOpenApps] = useState([]);
  const [activeWin, setActiveWin] = useState(null);
  const [bootComplete, setBootComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [windowStates, setWindowStates] = useState({});
  const [minimizedApps, setMinimizedApps] = useState(new Set());
  const { contextMenu, openContextMenu, closeContextMenu } = useContextMenu();

  const [wallpaperState, setWallpaperState] = useState({
    id: DEFAULT_WALLPAPER.id,
    type: "image",
    value: DEFAULT_WALLPAPER.image,
  });

  // Для проверки мобильности
  useEffect(() => {
    let timeout;
    const handler = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsMobile(window.innerWidth <= 1024), 100);
    };
    window.addEventListener('resize', handler);
    handler();
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handler);
    };
  }, []);

  // блокировка событий копирования
  useEffect(() => {
    const preventCopy = (e) => e.preventDefault();
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('selectstart', preventCopy);
    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('selectstart', preventCopy);
    };
  }, []);

  // Обработка изменения размера браузера – окна не вылетают за границы
  useEffect(() => {
    const handleResize = () => {
      setWindows(prev =>
        prev.map(win => ({
          ...win,
          x: Math.min(win.x, window.innerWidth - 100),
          y: Math.min(win.y, window.innerHeight - 100),
          width: Math.min(win.width, window.innerWidth),
          height: Math.min(win.height, window.innerHeight - 28),
        }))
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openApp = useCallback((appId) => {
    // Если окно свёрнуто — разворачиваем его
    if (minimizedApps.has(appId)) {
      setMinimizedApps((prev) => { const s = new Set(prev); s.delete(appId); return s; });
      focusWindow(appId);
      return;
    }

    const existing = windows.find((w) => w.id === appId);
    if (existing) return focusWindow(appId);

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
        zIndex: ++zCounter,
      },
    ]);

    setOpenApps((prev) => [...new Set([...prev, appId])]);
    setActiveWin(appId);
  }, [minimizedApps, windows]);

  const closeWindow = useCallback((appId) => {
    setWindows((prev) => prev.filter((w) => w.id !== appId));
    setOpenApps((prev) => prev.filter((id) => id !== appId));
    setMinimizedApps((prev) => { const s = new Set(prev); s.delete(appId); return s; });
  }, []);

  const minimizeWindow = useCallback((appId) => {
    setMinimizedApps((prev) => new Set([...prev, appId]));
    setActiveWin(null);
  }, []);

  const focusWindow = useCallback((appId) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === appId ? { ...w, zIndex: ++zCounter } : w
      )
    );
    setActiveWin(appId);
  }, []);

  // ✅ Максимизация/восстановление с учётом Dock
  const maximizeWindow = useCallback((appId) => {
    setWindows((prev) => {
      const win = prev.find((w) => w.id === appId);
      if (!win) return prev;

      const maximized = win.width >= window.innerWidth - 2 && win.height >= window.innerHeight - 28 - DOCK_HEIGHT;
      const savedState = windowStates[appId];
      const p = INITIAL_POSITIONS[appId] || { x: 120, y: 80, w: 600, h: 420 };

      if (maximized) {
        // Восстанавливаем позицию
        return prev.map((w) =>
          w.id === appId
            ? {
                ...w,
                x: savedState?.x || p.x,
                y: savedState?.y || p.y,
                width: savedState?.w || p.w,
                height: savedState?.h || p.h,
              }
            : w
        );
      } else {
        // Сохраняем текущую позицию и разворачиваем на весь экран (с учётом Menu Bar и Dock)
        setWindowStates((prevState) => ({
          ...prevState,
          [appId]: { x: win.x, y: win.y, w: win.width, h: win.height },
        }));
        return prev.map((w) =>
          w.id === appId
            ? { ...w, x: 0, y: 28, width: window.innerWidth, height: window.innerHeight - 28 - DOCK_HEIGHT }
            : w
        );
      }
    });
  }, [windowStates]);

  const activeApp = activeWin
    ? APPS.find((a) => a.id === activeWin)?.name
    : "Finder";

  // ✅ Мемоизированный renderContent
  const renderContent = useCallback((appId) => {
    // Общие пропсы управления окном
    const commonProps = {
      onClose: () => closeWindow(appId),
      onMinimize: () => minimizeWindow(appId),
      onMaximize: () => maximizeWindow(appId),
      onZoom: () => maximizeWindow(appId), // Для кнопки zoom в Settings
    };

    switch (appId) {
      case "finder":
        return (
          <FinderContent
            openApp={openApp}
            onClose={() => closeWindow("finder")}
            onMinimize={() => minimizeWindow("finder")}
            onMaximize={() => maximizeWindow("finder")}
          />
        );
      case "terminal":
        return <TerminalContent {...commonProps} />;
      case "notes":
        return <NotesContent {...commonProps} />;
      case "settings":
        return (
          <SettingsContent
            currentWallpaper={wallpaperState.id}
            onWallpaperChange={setWallpaperState}
            {...commonProps}
          />
        );
      case "music":
        return <MusicContent {...commonProps} />;

      default:
        return <PlaceholderContent appId={appId} {...commonProps} />;
    }
  }, [closeWindow, minimizeWindow, maximizeWindow, openApp, wallpaperState.id]);

  // ✅ Мемоизированный список окон
  const renderedWindows = useMemo(() => 
    windows.map((win) => (
      <AppWindow
        key={win.id}
        win={win}
        isActive={activeWin === win.id}
        isMinimized={minimizedApps.has(win.id)}
        onClose={() => closeWindow(win.id)}
        onMinimize={() => minimizeWindow(win.id)}
        onFocus={() => focusWindow(win.id)}
        onZoom={() => maximizeWindow(win.id)}
      >
        {renderContent(win.id)}
      </AppWindow>
    )),
    [windows, activeWin, minimizedApps, closeWindow, minimizeWindow, focusWindow, maximizeWindow, renderContent]
  );

  const handleDesktopContextMenu = (e) => {
    const items = [
      { label: "New Folder", action: () => console.log("New Folder") },
      { type: "divider" },
      { label: "Change Wallpaper", action: () => console.log("Change Wallpaper") },
      { type: "divider" },
      { label: "Get Info", action: () => console.log("Get Info") },
      { label: "Open in Terminal", action: () => console.log("Open in Terminal") },
    ];
    openContextMenu(e, items);
  };

  if (!bootComplete) return <BootScreen onComplete={() => setBootComplete(true)} />;
  if (isMobile) return <MobileNotSupported />;

  return (
    <div
      onContextMenu={handleDesktopContextMenu}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundImage: `url(${wallpaperState.value})`,
        backgroundSize: "cover",
      }}
    >
      <MenuBar
        activeApp={activeApp}
        openApp={openApp}
        onCloseWindow={() => closeWindow(activeWin)}
        onMinimizeWindow={() => minimizeWindow(activeWin)}
        onZoomWindow={() => maximizeWindow(activeWin)}
      />

      {renderedWindows}

      <Dock onOpen={openApp} openApps={openApps} minimizedApps={minimizedApps} />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
}