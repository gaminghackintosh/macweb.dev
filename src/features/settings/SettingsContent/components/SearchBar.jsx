import React, { memo } from "react";

export const SearchBar = memo(({ value, onChange }) => (
  <div className="sidebar-search">
    <input 
      type="text" 
      placeholder="Search" 
      value={value} 
      onChange={onChange} 
      aria-label="Search settings" 
    />
  </div>
));
