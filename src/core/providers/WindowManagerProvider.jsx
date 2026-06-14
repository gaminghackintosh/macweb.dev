import { createContext, useContext, useMemo, useCallback, useState, useRef, useReducer, useLayoutEffect } from "react";
import { APPS } from "@/core/constants/apps";
import { INITIAL_POSITIONS } from "@/core/constants/positions";

const WindowManagerContext = createContext(null);

// Акции для reducer
const WINDOW_ACTIONS = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  MINIMIZE: 'MINIMIZE',
  MAXIMIZE: 'MAXIMIZE',
  FOCUS: 'FOCUS',
  UPDATE_POSITION: 'UPDATE_POSITION',
  UPDATE_SIZE: 'UPDATE_SIZE',
};

// Reducer для управления состоянием окон
function windowReducer(state, action) {
  switch (action.type) {
    case WINDOW_ACTIONS.OPEN: {
      const { appId, appName, position } = action.payload;
      const existing = state.windows.find(w => w.id === appId);
      if (existing) {
        const newMinimizedApps = new Set(state.minimizedApps);
        newMinimizedApps.delete(appId);
        return {
          ...state,
          activeWin: appId,
          minimizedApps: newMinimizedApps,
        };
      }
      
      const p = position || INITIAL_POSITIONS[appId] || { x: 120, y: 80, w: 600, h: 420 };
      const newZIndex = state.zCounter + 1;
      
      return {
        ...state,
        windows: [
          ...state.windows,
          {
            id: appId,
            title: appName || appId,
            x: p.x,
            y: p.y,
            width: p.w,
            height: p.h,
            zIndex: newZIndex,
          },
        ],
        openApps: state.openApps.includes(appId) ? state.openApps : [...state.openApps, appId],
        activeWin: appId,
        zCounter: newZIndex,
      };
    }
    
    case WINDOW_ACTIONS.CLOSE: {
      const { appId } = action.payload;
      const newMinimizedApps = new Set(state.minimizedApps);
      newMinimizedApps.delete(appId);
      
      return {
        ...state,
        windows: state.windows.filter(w => w.id !== appId),
        openApps: state.openApps.filter(id => id !== appId),
        minimizedApps: newMinimizedApps,
        activeWin: state.activeWin === appId ? null : state.activeWin,
      };
    }
    
    case WINDOW_ACTIONS.MINIMIZE: {
      const { appId } = action.payload;
      const newMinimizedApps = new Set(state.minimizedApps);
      newMinimizedApps.add(appId);
      
      return {
        ...state,
        minimizedApps: newMinimizedApps,
        activeWin: state.activeWin === appId ? null : state.activeWin,
      };
    }
    
    case WINDOW_ACTIONS.MAXIMIZE: {
      const { appId, windowStates } = action.payload;
      const win = state.windows.find(w => w.id === appId);
      if (!win) return state;

      const DOCK_HEIGHT = 80;
      const MENUBAR_HEIGHT = 28;
      const isMaximized = win.x === 0 && win.y === MENUBAR_HEIGHT;

      if (isMaximized) {
        const saved = windowStates[appId];
        if (!saved) return state;
        
        return {
          ...state,
          windows: state.windows.map(w => 
            w.id === appId 
              ? { ...w, x: saved.x, y: saved.y, width: saved.w, height: saved.h } 
              : w
          ),
        };
      } else {
        const newWindowStates = {
          ...windowStates,
          [appId]: { x: win.x, y: win.y, w: win.width, h: win.height },
        };
        
        return {
          ...state,
          windowStates: newWindowStates,
          windows: state.windows.map(w =>
            w.id === appId
              ? { 
                  ...w, 
                  x: 0, 
                  y: MENUBAR_HEIGHT, 
                  width: window.innerWidth, 
                  height: window.innerHeight - MENUBAR_HEIGHT - DOCK_HEIGHT 
                }
              : w
          ),
        };
      }
    }
    
    case WINDOW_ACTIONS.FOCUS: {
      const { appId } = action.payload;
      if (state.activeWin === appId) return state;
      
      const target = state.windows.find(w => w.id === appId);
      if (!target || target.zIndex === state.zCounter + 1) return state;
      
      return {
        ...state,
        windows: state.windows.map(w => 
          w.id === appId ? { ...w, zIndex: state.zCounter + 1 } : w
        ),
        activeWin: appId,
        zCounter: state.zCounter + 1,
      };
    }
    
    case WINDOW_ACTIONS.UPDATE_POSITION: {
      const { appId, x, y } = action.payload;
      return {
        ...state,
        windows: state.windows.map(w => 
          w.id === appId ? { ...w, x, y } : w
        ),
      };
    }
    
    case WINDOW_ACTIONS.UPDATE_SIZE: {
      const { appId, width, height } = action.payload;
      return {
        ...state,
        windows: state.windows.map(w => 
          w.id === appId ? { ...w, width, height } : w
        ),
      };
    }
    
    case 'BATCH_UPDATE': {
      const { windows } = action.payload;
      return {
        ...state,
        windows,
      };
    }
    
    default:
      return state;
  }
}

// Ленивая инициализация initialState для производительности
// ✅ Стабильный Set через функцию для избежания лишних ререндеров
function getInitialState() {
  return {
    windows: [],
    openApps: [],
    activeWin: null,
    minimizedApps: Object.freeze(new Set()),
    windowStates: {},
    zCounter: 100,
  };
}

export function WindowManagerProvider({ children }) {
  const [state, dispatch] = useReducer(windowReducer, null, getInitialState);
  const focusTimeoutRef = useRef(null);
  const activeWinRef = useRef(state.activeWin);

  // ✅ Обновляем ref при каждом изменении state.activeWin
  activeWinRef.current = state.activeWin;

  // Мемоизированный фокус без лишних обновлений
  // ✅ Используем ref вместо зависимостей для избежания пересоздания функции
  const focusWindow = useCallback((appId) => {
    if (activeWinRef.current === appId) return;
    
    if (focusTimeoutRef.current) {
      cancelAnimationFrame(focusTimeoutRef.current);
    }
    
    focusTimeoutRef.current = requestAnimationFrame(() => {
      dispatch({ type: WINDOW_ACTIONS.FOCUS, payload: { appId } });
    });
  }, []);

  const openApp = useCallback((appId, appName) => {
    if (state.minimizedApps.has(appId)) {
      dispatch({ type: WINDOW_ACTIONS.MINIMIZE, payload: { appId } });
      // Удаляем из minimizedApps
      dispatch({ 
        type: WINDOW_ACTIONS.OPEN, 
        payload: { appId, appName } 
      });
      focusWindow(appId);
      return;
    }

    dispatch({ 
      type: WINDOW_ACTIONS.OPEN, 
      payload: { appId, appName } 
    });
    
    if (!state.openApps.includes(appId)) {
      // Только добавляем в openApps если еще нет
      // Это обрабатывается внутри reducer
    }
    
    focusWindow(appId);
  }, [state.minimizedApps, state.openApps, focusWindow]);

  const closeWindow = useCallback((appId) => {
    dispatch({ type: WINDOW_ACTIONS.CLOSE, payload: { appId } });
  }, []);

  const minimizeWindow = useCallback((appId) => {
    dispatch({ type: WINDOW_ACTIONS.MINIMIZE, payload: { appId } });
  }, []);

  // ✅ Убрали state.windowStates из зависимостей — используем ref
  const windowStatesRef = useRef(state.windowStates);
  useLayoutEffect(() => {
    windowStatesRef.current = state.windowStates;
  }, [state.windowStates]);

  const maximizeWindow = useCallback((appId) => {
    dispatch({ 
      type: WINDOW_ACTIONS.MAXIMIZE, 
      payload: { appId, windowStates: windowStatesRef.current } 
    });
  }, []);

  // Стабильный value объект для контекста
  const value = useMemo(() => ({
    windows: state.windows,
    openApps: state.openApps,
    activeWin: state.activeWin,
    minimizedApps: state.minimizedApps,
    windowStates: state.windowStates,
    openApp,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    setActiveWin: (id) => dispatch({ type: WINDOW_ACTIONS.FOCUS, payload: { appId: id } }),
    setWindows: (updater) => {
      // Поддержка для обратной совместимости
      if (typeof updater === 'function') {
        const newWindows = updater(state.windows);
        dispatch({ 
          type: 'BATCH_UPDATE', 
          payload: { windows: newWindows } 
        });
      }
    },
  }), [
    state.windows,
    state.openApps,
    state.activeWin,
    state.minimizedApps,
    state.windowStates,
    openApp,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
  ]);

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within WindowManagerProvider');
  }
  return context;
};
