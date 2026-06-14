import React, { useLayoutEffect } from 'react';
import { useWindowManager } from "@/core/providers";
import { AppWindow } from './AppWindow/AppWindow';
import { renderAppContent } from "@/utils/renderAppContent";
import { Suspense, memo, useCallback, useMemo, useRef } from 'react';
import { WindowLoading } from "@/ui";

// ✅ Отдельный контекст для изоляции активных окон
const ActiveWindowContext = React.createContext(null);

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
  // ✅ Кастомное сравнение: перерисовываем только если это наше окно
  return prev.winId === next.winId && prev.setWallpaper === next.setWallpaper;
});

// ✅ Оптимизированный WindowList с изоляцией рендеринга
export const WindowList = memo(function WindowList({ setWallpaper }) {
  const { windows, activeWin, minimizedApps } = useWindowManager();
  
  // Мемоизация списка окон — рендерим только если изменилось конкретное окно
  const windowItemsRef = useRef(new Map());
  
  useLayoutEffect(() => {
    // Очищаем кэш при размонтировании
    return () => windowItemsRef.current.clear();
  }, []);
  
  // Создаём окна только когда они появляются/исчезают
  const windowItems = useMemo(() => {
    const items = [];
    const currentIds = new Set(windows.map(w => w.id));
    const cachedIds = new Set(windowItemsRef.current.keys());
    
    // Добавляем новые окна
    windows.forEach(win => {
      if (!windowItemsRef.current.has(win.id)) {
        windowItemsRef.current.set(win.id, (
          <WindowItem key={win.id} winId={win.id} setWallpaper={setWallpaper} />
        ));
      }
      items.push(windowItemsRef.current.get(win.id));
    });
    
    // Удаляем закрытые окна из кэша
    cachedIds.forEach(id => {
      if (!currentIds.has(id)) {
        windowItemsRef.current.delete(id);
      }
    });
    
    return items;
  }, [windows, setWallpaper]);

  return <>{windowItems}</>;
}, () => true); // ✅ Всегда skip - мы управляем рендерингом вручную
