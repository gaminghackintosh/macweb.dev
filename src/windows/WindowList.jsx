import { useWindowManager } from "@/core/providers";
import { AppWindow } from './AppWindow/AppWindow';
import { renderAppContent } from "@/utils/renderAppContent";
import { Suspense, memo, useCallback, useMemo } from 'react';
import { WindowLoading } from "@/ui";

const WindowItem = memo(function WindowItem({ winId, setWallpaper }) {
  const { 
    windows, 
    activeWin, 
    minimizedApps,
    closeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    focusWindow 
  } = useWindowManager();
  
  const win = windows.find(w => w.id === winId);
  if (!win) return null;
  
  const isActive = activeWin === winId;
  // Защита: проверяем тип minimizedApps
  const isMinimized = minimizedApps instanceof Set ? minimizedApps.has(winId) : minimizedApps.includes?.(winId);
  
  // Приложения с фиксированным размером (без resize)
  const fixedSizeApps = ['calculator'];
  const allowResize = !fixedSizeApps.includes(winId);
  
  // Мемоизация callback-функций
  const handleClose = useCallback(() => closeWindow(winId), [closeWindow, winId]);
  const handleMinimize = useCallback(() => minimizeWindow(winId), [minimizeWindow, winId]);
  const handleFocus = useCallback(() => focusWindow(winId), [focusWindow, winId]);
  const handleZoom = useCallback(() => maximizeWindow(winId), [maximizeWindow, winId]);

  // Мемоизация рендера контента
  const appContent = useMemo(() => (
    <Suspense fallback={<WindowLoading />}>
      {renderAppContent(winId, { 
        closeWindow: handleClose, 
        minimizeWindow: handleMinimize, 
        maximizeWindow: handleZoom, 
        setWallpaper 
      })}
    </Suspense>
  ), [winId, handleClose, handleMinimize, handleZoom, setWallpaper]);

  return (
    <AppWindow
      win={win}
      isActive={isActive}
      isMinimized={isMinimized}
      onClose={handleClose}
      onMinimize={handleMinimize}
      onFocus={handleFocus}
      onZoom={handleZoom}
      allowResize={allowResize}
    >
      {appContent}
    </AppWindow>
  );
}, (prev, next) => {
  return prev.winId === next.winId && prev.setWallpaper === next.setWallpaper;
});

export const WindowList = memo(function WindowList({ setWallpaper }) {
  const { windows } = useWindowManager();
  
  // Мемоизация списка окон для предотвращения лишних рендеров
  const windowItems = useMemo(() => (
    windows.map(win => (
      <WindowItem key={win.id} winId={win.id} setWallpaper={setWallpaper} />
    ))
  ), [windows, setWallpaper]);

  return <>{windowItems}</>;
}, (prev, next) => {
  return prev.setWallpaper === next.setWallpaper;
});
