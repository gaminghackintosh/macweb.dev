import React, { memo } from "react";
import { MenuItemIcon } from "./MenuItemIcon";

export const TabsList = memo(({ sections, activeTab, onTabClick }) => (
  <div className="tabs-list" role="tablist">
    {sections.map((section, idx) => (
      <div key={section.id} className="menu-section">
        {idx > 0 && <div className="section-divider" />}
        {section.items.map(item => (
          <div 
            key={item.id} 
            className={`tab-item${activeTab === item.id ? " active" : ""}`} 
            onClick={() => onTabClick(item.id)} 
            role="tab" 
            aria-selected={activeTab === item.id} 
            tabIndex={0} 
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onTabClick(item.id); } }}
          >
            <MenuItemIcon item={item} />
            <span className="tab-label">{item.label}</span>
            {item.badge && <span className="tab-badge">{item.badge}</span>}
          </div>
        ))}
      </div>
    ))}
  </div>
));
