import React, { memo, useCallback } from "react";

export const MenuItemIcon = memo(({ item }) => {
  const renderIcon = useCallback(() => {
    if (item.iconType === "image") return <img src={item.icon} alt={item.label} loading="lazy" />;
    if (item.iconType === "svg") { const IconComponent = item.icon; return <IconComponent size={20} />; }
    if (item.iconType === "emoji") return <span>{item.icon}</span>;
    return null;
  }, [item]);

  return <span className="tab-icon">{renderIcon()}</span>;
});
