import { useState, useCallback, useMemo } from 'react';

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState(null);

  const openContextMenu = useCallback((e, items) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: items
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // ✅ Мемоизация объекта возвращаемого значения
  return useMemo(() => ({
    contextMenu,
    openContextMenu,
    closeContextMenu,
  }), [contextMenu, openContextMenu, closeContextMenu]);
};