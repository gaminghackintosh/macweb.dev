import React, { useState, lazy, Suspense, createContext, useCallback, useMemo, memo } from "react";
import { APPS, INITIAL_POSITIONS } from "./constants/apps";
import { AppWindow } from "./components/AppWindow/AppWindow";
import { Dock } from "./components/Dock";
import { WALLPAPER_GROUPS } from "./core/constants/wallpapers";

export const WindowContext = createContext(null);

const FinderContent   = lazy(() => import("./components/apps/Finder/FinderContent"));
const SafariContent   = lazy(() => import("./components/apps/Safari/SafariContent"));
const TerminalContent = lazy(() => import("./components/apps/Terminal/TerminalContent"));
const NotesContent    = lazy(() => import("./components/apps/Notes/NotesContent"));

const WindowLoader = memo(() => (
  <div className="window-loader">
    <div className="loader-spinner" />
  </div>
));

const CONTENT_COMPONENTS = {
  finder: FinderContent,
  safari: SafariContent,
  terminal: TerminalContent,
  notes: NotesContent,
};

const defaultWallpaper = WALLPAPER_GROUPS[0]?.wallpapers[0]?.image;

export default function MacOSWeb() {
  const [windows, setWindows] = useState([]);
  const [openApps, setOpenApps] = useState([]);
  const [activeWin, setActiveWin] = useState(null);

  const openApp = useCallback((appId) => {
    setWindows(prev => {
      if (prev.find(w => w.id === appId)) return prev;
      const p = INITIAL_POSITIONS[appId] || { x: 120, y: 80 };
      const app = APPS.find(a => a.id === appId);
      return [...prev, { id: appId, title: app?.name || appId, x: p.x, y: p.y, width: p.w, height: p.h, zIndex: Date.now() }];
    });
    setOpenApps(prev => prev.includes(appId) ? prev : [...prev, appId]);
    setActiveWin(appId);
  }, []);

  const closeWindow = useCallback((appId) => {
    setWindows(prev => prev.filter(w => w.id !== appId));
    setOpenApps(prev => prev.filter(id => id !== appId));
    setActiveWin(cur => cur === appId ? null : cur);
  }, []);

  const focusWindow = useCallback((appId) => {
    setWindows(prev => prev.map(w => w.id === appId ? { ...w, zIndex: Date.now() } : w));
    setActiveWin(appId);
  }, []);

  const renderContent = useMemo(() => {
    const handleClose = () => closeWindow(activeWin);
    const Component = CONTENT_COMPONENTS[activeWin];
    if (!Component) return null;
    return (
      <Suspense fallback={<WindowLoader />}>
        {activeWin === "safari" ? <Component onClose={handleClose} onMinimize={handleClose} onZoom={null} /> : <Component />}
      </Suspense>
    );
  }, [activeWin, closeWindow]);

  const activeApp = useMemo(() => activeWin ? APPS.find(a => a.id === activeWin)?.name : "Finder", [activeWin]);

  return (
    <div className="macos-desktop" style={{ backgroundImage: `url(${defaultWallpaper})` }}>
      {windows.map(win => (
        <AppWindow
          key={win.id} 
          win={win}
          isActive={activeWin === win.id}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => closeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
        >
          {win.id === activeWin && renderContent}
        </AppWindow>
      ))}
      <Dock onOpen={openApp} openApps={openApps} />
    </div>
  );
}

export default function MacOSWeb() {
  const [windows, setWindows] = useState([]);
  const [openApps, setOpenApps] = useState([]);
  const [activeWin, setActiveWin] = useState(null);

  const openApp = useCallback((appId) => {
    setWindows(prev => {
      if (prev.find((w) => w.id === appId)) return prev;
      const p = INITIAL_POSITIONS[appId] || { x: 120, y: 80 };
      const app = APPS.find((a) => a.id === appId);
      return [...prev, { id: appId, title: app?.name || appId, x: p.x, y: p.y, width: p.w, height: p.h, zIndex: ++zCounter }];
    });
    setOpenApps(prev => prev.includes(appId) ? prev : [...prev, appId]);
    setActiveWin(appId);
  }, []);

  const closeWindow = useCallback((appId) => {
    setWindows((prev) => prev.filter((w) => w.id !== appId));
    setOpenApps((prev) => prev.filter((id) => id !== appId));
    setActiveWin((cur) => (cur === appId ? null : cur));
  }, []);

  const focusWindow = useCallback((appId) => {
    setWindows((prev) => prev.map((w) => (w.id === appId ? { ...w, zIndex: ++zCounter } : w)));
    setActiveWin(appId);
  }, []);

  const renderContent = useCallback((appId) => {
    const handleClose = () => closeWindow(appId);
    switch (appId) {
      case "finder":   return <FinderContent />;
      case "safari":   return <SafariContent onClose={handleClose} onMinimize={handleClose} onZoom={null} />;
      case "terminal": return <TerminalContent />;
      case "notes":    return <NotesContent />;
      default:         return null;
    }
  }, [closeWindow]);

  const activeApp = useMemo(() => activeWin ? APPS.find((a) => a.id === activeWin)?.name : "Finder", [activeWin]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", background: WALLPAPER }}>

      {windows.map((win) => (
        <AppWindow
          key={win.id} 
          win={win}
          isActive={activeWin === win.id}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => closeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
        >
          <Suspense fallback={<WindowLoader />}>
            {renderContent(win.id)}
          </Suspense>
        </AppWindow>
      ))}

      <Dock onOpen={openApp} openApps={openApps} />
    </div>
  );
}