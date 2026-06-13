import React, { lazy, Suspense } from "react";
import { WindowLoading } from "@/ui";

const FinderContent = lazy(() => import("@/features/finder/FinderContent"));
const TerminalContent = lazy(() => import("@/features/terminal/Terminal").then(m => ({ default: m.TerminalContent })));
const NotesContent = lazy(() => import("@/features/notes/NotesContent").then(m => ({ default: m.NotesContent })));
const SettingsContent = lazy(() => import("@/features/settings/SettingsContent").then(m => ({ default: m.SettingsContent })));
const MusicContent = lazy(() => import("@/features/music/MusicContent").then(m => ({ default: m.MusicContent })));
const SafariContent = lazy(() => import("@/features/safari/SafariContent").then(m => ({ default: m.SafariContent })));
const CalendarContent = lazy(() => import("@/features/calendar/CalendarContent").then(m => ({ default: m.CalendarContent })));
const CalculatorContent = lazy(() => import("@/features/calculator/CalculatorContent").then(m => ({ default: m.CalculatorContent })));

export const renderAppContent = (appId, { closeWindow, minimizeWindow, maximizeWindow, setWallpaper }) => {
  const commonProps = {
    onClose: () => closeWindow(appId),
    onMinimize: () => minimizeWindow(appId),
    onMaximize: () => maximizeWindow(appId),
    onZoom: () => maximizeWindow(appId),
  };

  switch (appId) {
    case "finder":
      return <Suspense fallback={<WindowLoading />}><FinderContent {...commonProps} /></Suspense>;
    case "terminal":
      return <Suspense fallback={<WindowLoading />}><TerminalContent {...commonProps} /></Suspense>;
    case "notes":
      return <Suspense fallback={<WindowLoading />}><NotesContent {...commonProps} /></Suspense>;
    case "settings":
      return <Suspense fallback={<WindowLoading />}><SettingsContent {...commonProps} onWallpaperChange={setWallpaper} /></Suspense>;
    case "safari":
      return <Suspense fallback={<WindowLoading />}><SafariContent {...commonProps} /></Suspense>;
    case "music":
      return <Suspense fallback={<WindowLoading />}><MusicContent {...commonProps} /></Suspense>;
    case "calendar":
      return <Suspense fallback={<WindowLoading />}><CalendarContent {...commonProps} /></Suspense>;
    case "calculator":
      return <Suspense fallback={<WindowLoading />}><CalculatorContent {...commonProps} /></Suspense>;
    default:
      return <div style={{ padding: 20, color: '#707070' }}>App {appId} not found.</div>;
  }
};
