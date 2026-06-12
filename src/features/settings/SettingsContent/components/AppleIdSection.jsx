import React, { memo } from "react";
import { AppleIdAvatar } from "./AppleIdAvatar";

export const AppleIdSection = memo(({ isActive, onClick }) => (
  <div className={`sidebar-apple-id${isActive ? " active" : ""}`} onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}>
    <AppleIdAvatar />
    <div className="apple-id-info">
      <div className="apple-id-name">ghost</div>
      <div className="apple-id-email">Apple ID</div>
    </div>
  </div>
));
