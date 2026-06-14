import React, { useState, useCallback, useEffect, memo, useMemo } from "react";
import { useMobileCheck, useContextMenu } from "@/core/hooks";
import { WindowManagerProvider, useWindowManager, ThemeProvider, useTheme  } from "@/core/providers";
// UI компоненты
import { BootScreen, MobileNotSupported, ContextMenu } from "@/ui";
// Layout компоненты
import { Desktop, Dock, WindowList } from "@/windows";
import { MenuBar } from "@/features/menubar/MenuBar";
// Ленивая загрузка обоев
import defaultWallpaperDark from "@/assets/images/wallpapers/Tahoe/Tahoe Dark.webp";
import defaultWallpaperLight from "@/assets/images/wallpapers/Tahoe/Tahoe Light.webp";

function AppContent() {
  const windowManager = useWindowManager();
  const { isLightTheme } = useTheme();
  const { contextMenu, openContextMenu, closeContextMenu } = useContextMenu();

  // Состояние обоев — используется Settings для смены обоев
  const [wallpaper, setWallpaper] = useState(() => ({
    id: "tahoe_default",
    type: "image",
    value: defaultWallpaperDark,
  }));

  // ✅ Синхронизация обоев с темой только при первой загрузке
  // (если пользователь не выбрал свои обои)
  useEffect(() => {
    // Проверяем если обои были изменены через Settings (id !== "tahoe_default")
    if (wallpaper.id !== "tahoe_default") return;
    
    setWallpaper({
      id: "tahoe_default",
      type: "image",
      value: isLightTheme ? defaultWallpaperLight : defaultWallpaperDark,
    });
  }, [isLightTheme]);

  const handleDesktopContextMenu = useCallback((e) => {
    openContextMenu(e, [
      { label: "New Folder", action: () => console.log("New Folder") },
      { type: "divider" },
      { label: "Get Info", action: () => console.log("Get Info") },
      { 
        label: "Change Wallpaper...", 
        action: () => {
          if (windowManager.openApp) {
            windowManager.openApp("settings", "Settings");
          }
        } 
      },
      { label: "Edit Widgets...", action: () => console.log("Edit Widgets") },
      { type: "divider" },
      { label: "Use Stacks", action: () => console.log("Use Stacks") },
      { label: "Sort By", submenu: true, action: () => console.log("Sort By") },
      { label: "Clean Up", action: () => console.log("Clean Up") },
      { label: "Clean Up By", submenu: true, action: () => console.log("Clean Up By") },
      { type: "divider" },
      { label: "Show View Options", action: () => console.log("Show View Options") },
    ]);
  }, [openContextMenu, windowManager]);

  return (
    <Desktop wallpaper={wallpaper.value} onContextMenu={handleDesktopContextMenu}>
      <MenuBar 
        activeApp={windowManager.activeWin} 
        onClose={() => windowManager.closeWindow(windowManager.activeWin)}
        onMinimize={() => windowManager.minimizeWindow(windowManager.activeWin)}
        onZoom={() => windowManager.maximizeWindow(windowManager.activeWin)}
      />

      <WindowList setWallpaper={setWallpaper} />

      <Dock 
        onOpen={windowManager.openApp} 
        openApps={windowManager.openApps} 
        minimizedApps={windowManager.minimizedApps} 
        isLightTheme={isLightTheme}
      />

      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          items={contextMenu.items} 
          onClose={closeContextMenu} 
        />
      )}
    </Desktop>
  );
}

/**
 * AppInner — управление boot screen
 */
function AppInner() {
  const isMobile = useMobileCheck();
  const [bootComplete, setBootComplete] = useState(false);
  
  if (!bootComplete) return <BootScreen onComplete={() => setBootComplete(true)} />;
  if (isMobile) return <MobileNotSupported />;

  return (
    <ThemeProvider>
      <WindowManagerProvider>
        <main role="main" aria-label="macOS Desktop Environment">
          <AppContent />
        </main>
      </WindowManagerProvider>
    </ThemeProvider>
  );
}

export default AppInner;