import React, { useState, useRef, useLayoutEffect, memo, useMemo, useCallback } from "react";

const defaultWindowContextValue = {
  onClose: () => {},
  onMinimize: () => {},
  onZoom: () => {},
  onFocus: () => {},
  onTitleMouseDown: () => {},
};

export const WindowContext = React.createContext(defaultWindowContextValue);

export const AppWindow = memo(function AppWindow({
  win,
  onClose,
  onMinimize,
  onFocus,
  isActive,
  isMinimized = false,
  children,
  onZoom = null,
  allowResize = true,
}) {
  const [pos, setPos] = useState(() => ({ x: win.x, y: win.y }));
  
  // Для fixed-size приложений не устанавливаем размеры
  const hasCustomSize = win.width !== undefined || win.w !== undefined || win.height !== undefined || win.h !== undefined;
  
  const [size, setSize] = useState(() => {
    if (!hasCustomSize && !allowResize) {
      // Fixed-size приложения без явных размеров - используем null для fit-content
      return { width: null, height: null };
    }
    return { 
      width: win.width ?? win.w ?? 600, 
      height: win.height ?? win.h ?? 420 
    };
  });
  const [isMaximized, setIsMaximized] = useState(false);

  const windowRef = useRef(null);
  const contentRef = useRef(null);
  const dragging = useRef(false);
  const resizing = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  const posRef = useRef(pos);
  const sizeRef = useRef(size);
  
  useLayoutEffect(() => {
    posRef.current = pos;
    sizeRef.current = size;
  }, [pos, size]);

  useLayoutEffect(() => {
    if ((win.x !== posRef.current.x || win.y !== posRef.current.y) && !dragging.current) {
      setPos({ x: win.x, y: win.y });
      setIsMaximized(win.x === 0 && win.y === 28);
      if (windowRef.current) {
        windowRef.current.style.transform = `translate3d(${win.x}px, ${win.y}px, 0)`;
      }
    }
    
    // Обновляем размеры только если они явно указаны
    if (hasCustomSize && !resizing.current) {
      const winWidth = win.width ?? win.w ?? 600;
      const winHeight = win.height ?? win.h ?? 420;
      if (winWidth !== sizeRef.current.width || winHeight !== sizeRef.current.height) {
        setSize({ width: winWidth, height: winHeight });
        setIsMaximized(winWidth >= window.innerWidth - 2);
      }
    }
  }, [win.x, win.y, win.width, win.w, win.height, win.h, hasCustomSize, resizing]);

  const onTitleMouseDown = useCallback((e) => {
    if (e.button !== 0 || isMaximized) return;
    if (e.target.closest('button')) return;
    
    onFocus();
    dragging.current = true;

    const rect = windowRef.current.getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    if (windowRef.current) {
      windowRef.current.classList.add('app-window--dragging');
      windowRef.current.style.willChange = 'transform';
      windowRef.current.style.pointerEvents = 'none';
    }

    let rafId = null;
    let lastX = rect.left;
    let lastY = rect.top;
    const windowWidth = rect.width;
    
    const onMove = (ev) => {
      if (!dragging.current) return;
      
      const newX = Math.max(0, Math.min(window.innerWidth - windowWidth, ev.clientX - offset.current.x));
      const newY = Math.max(28, ev.clientY - offset.current.y);

      if (Math.abs(newX - lastX) < 2 && Math.abs(newY - lastY) < 2) return;
      lastX = newX;
      lastY = newY;
      
      if (rafId !== null) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        if (windowRef.current && dragging.current) {
          windowRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
          rafId = null;
        }
      });
    };

    const onUp = (ev) => {
      if (!dragging.current) return;
      dragging.current = false;

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      
      if (windowRef.current) {
        windowRef.current.classList.remove('app-window--dragging');
        windowRef.current.style.willChange = '';
        windowRef.current.style.pointerEvents = '';
      }

      const finalX = Math.max(0, Math.min(window.innerWidth - windowWidth, ev.clientX - offset.current.x));
      const finalY = Math.max(28, ev.clientY - offset.current.y);
      
      setPos({ x: finalX, y: finalY });
      
      if (windowRef.current) {
        windowRef.current.style.transform = `translate3d(${finalX}px, ${finalY}px, 0)`;
      }

      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseup", onUp, { passive: true });
    e.preventDefault();
  }, [isMaximized, onFocus]);

  const onResizeMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onFocus();

    resizing.current = true;
    startSize.current = { width: sizeRef.current.width, height: sizeRef.current.height };
    const startX = e.clientX;
    const startY = e.clientY;

    if (windowRef.current) {
      windowRef.current.classList.add('app-window--resizing');
      windowRef.current.style.willChange = 'width, height';
      windowRef.current.style.pointerEvents = 'none';
    }

    let rafId = null;
    let lastW = startSize.current.width;
    let lastH = startSize.current.height;
    
    const onMove = (ev) => {
      if (!resizing.current) return;
      
      const deltaX = ev.clientX - startX;
      const deltaY = ev.clientY - startY;
      const newWidth = Math.max(250, startSize.current.width + deltaX);
      const newHeight = Math.max(200, startSize.current.height + deltaY);

      if (Math.abs(newWidth - lastW) < 2 && Math.abs(newHeight - lastH) < 2) return;
      lastW = newWidth;
      lastH = newHeight;
      
      if (rafId !== null) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        if (windowRef.current && resizing.current) {
          windowRef.current.style.width = `${newWidth}px`;
          windowRef.current.style.height = `${newHeight}px`;
          rafId = null;
        }
      });
    };

    const onUp = () => {
      resizing.current = false;
      
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      
      if (windowRef.current) {
        windowRef.current.classList.remove('app-window--resizing');
        windowRef.current.style.willChange = '';
        windowRef.current.style.pointerEvents = '';
        setSize({ 
          width: parseFloat(windowRef.current.style.width) || sizeRef.current.width, 
          height: parseFloat(windowRef.current.style.height) || sizeRef.current.height 
        });
      }

      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseup", onUp, { passive: true });
  }, [onFocus]);

  const contextValue = useMemo(() => ({
    onClose,
    onMinimize,
    onZoom,
    onFocus,
    onTitleMouseDown,
  }), [onClose, onMinimize, onZoom, onFocus, onTitleMouseDown]);

  const memoizedChildren = useMemo(() => children, [children]);

  return (
    <WindowContext.Provider value={contextValue}>
      <div
        ref={windowRef}
        className={[
          "app-window",
          isActive ? "app-window--active" : "app-window--inactive",
          isMinimized ? "app-window--minimized" : "",
          !allowResize ? "app-window--fixed-size" : "",
        ].filter(Boolean).join(" ")}
        onContextMenu={(e) => e.stopPropagation()}
        onMouseDown={onFocus}
        style={{
          position: "fixed",
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          ...(size.width !== null ? { width: size.width } : {}),
          ...(size.height !== null ? { height: size.height } : {}),
          zIndex: win.zIndex,
          willChange: isActive ? "transform" : "auto",
          contain: "layout style paint",
          touchAction: "none",
          contentVisibility: "auto",
        }}
      >
        <div ref={contentRef} className="app-window__content" style={{ contain: "content" }}>
          {memoizedChildren}
        </div>

        {allowResize && (
          <div 
            className="resize-handle" 
            onMouseDown={onResizeMouseDown}
            style={{ touchAction: "none" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M14 0 L14 14 L0 14" fill="none" stroke="white" strokeWidth="1" opacity="0.6" />
              <path d="M10 14 L14 10" stroke="white" strokeWidth="1" opacity="0.6" />
              <path d="M6 14 L14 6" stroke="white" strokeWidth="1" opacity="0.4" />
            </svg>
          </div>
        )}
      </div>
    </WindowContext.Provider>
  );
});
