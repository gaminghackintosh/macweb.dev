import React, { lazy, Suspense } from "react";
import { WindowLoading } from "@/ui";

// ✅ Ленивая загрузка каждого приложения — code splitting по чанкам
const FinderContent = lazy(() => import("@/features/finder/Finder/FinderContent"));
const TerminalContent = lazy(() => import("@/features/terminal/Terminal/Terminal").then(m => ({ default: m.TerminalContent })));
const NotesContent = lazy(() => import("@/features/notes/Notes/NotesContent").then(m => ({ default: m.NotesContent })));
const SettingsContent = lazy(() => import("@/features/settings/Settings/SettingsContent").then(m => ({ default: m.SettingsContent })));
const MusicContent = lazy(() => import("@/features/music/MusicApp/MusicContent").then(m => ({ default: m.MusicContent })));
const SafariContent = lazy(() => import("@/features/safari/Safari/SafariContent").then(m => ({ default: m.SafariContent })));
const CalendarContent = lazy(() => import("@/features/calendar/CalendarContent").then(m => ({ default: m.CalendarContent })));

/**
 * Функция-фабрика для рендеринга контента приложения.
 * ✅ Оптимизирована для lazy loading + code-splitting.
 * @param {string} appId - ID приложения.
 * @param {object} props - Объект с функциями управления окном и состояниями.
 */
export const renderAppContent = (appId, { 
  closeWindow, minimizeWindow, maximizeWindow, setWallpaper 
}) => {
  // Общие пропсы для всех приложений
  const commonProps = {
    onClose: () => closeWindow(appId),
    onMinimize: () => minimizeWindow(appId),
    onMaximize: () => maximizeWindow(appId),
    onZoom: () => maximizeWindow(appId),
  };

  // ✅ Оборачиваем каждое приложение в Suspense для lazy loading
  switch (appId) {
    case "finder":
      return (
        <Suspense fallback={<WindowLoading />}>
          <FinderContent {...commonProps} />
        </Suspense>
      );
    case "terminal":
      return (
        <Suspense fallback={<WindowLoading />}>
          <TerminalContent {...commonProps} />
        </Suspense>
      );
    case "notes":
      return (
        <Suspense fallback={<WindowLoading />}>
          <NotesContent {...commonProps} />
        </Suspense>
      );
    case "settings":
      return (
        <Suspense fallback={<WindowLoading />}>
          <SettingsContent
            {...commonProps}
            onWallpaperChange={setWallpaper}
          />
        </Suspense>
      );
    case "safari":
      return (
        <Suspense fallback={<WindowLoading />}>
          <SafariContent {...commonProps} />
        </Suspense>
      );
    case "music":
      return (
        <Suspense fallback={<WindowLoading />}>
          <MusicContent {...commonProps} />
        </Suspense>
      );
    case "calendar":
      return (
        <Suspense fallback={<WindowLoading />}>
          <CalendarContent {...commonProps} />
        </Suspense>
      );
    default:
      return (
        <div style={{ padding: 20, color: '#707070' }}>
          App {appId} not found.
        </div>
      );
  }
};