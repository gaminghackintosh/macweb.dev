import React, { useEffect, useRef } from 'react';

export const ContextMenu = ({ x, y, items, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const overflowsRight = x + rect.width > window.innerWidth;
      const overflowsBottom = y + rect.height > window.innerHeight;
      if (overflowsRight) menuRef.current.style.left = `${x - rect.width}px`;
      if (overflowsBottom) menuRef.current.style.top = `${y - rect.height}px`;
    }
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: x, top: y }}
    >
      {items.map((item, index) => {
        if (item.type === 'divider') {
          return <div key={index} className="context-menu__divider" />;
        }
        return (
          <div
            key={index}
            className={`context-menu__item ${item.disabled ? 'context-menu__item--disabled' : ''}`}
            onClick={() => {
              if (!item.disabled) {
                item.action?.();
                onClose();
              }
            }}
          >
            <span className="context-menu__label">{item.label}</span>
            {item.shortcut && <span className="context-menu__shortcut">{item.shortcut}</span>}
            {item.submenu && (
              <svg className="context-menu__arrow" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 4l4 4-4 4V4z"/>
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};