import React, { memo } from "react";

export const TrafficLights = memo(({ onClose, onMinimize, onZoom }) => (
  <div className="sidebar-traffic-lights">
    <button className="traffic-light traffic-light--close" onClick={onClose} aria-label="Close" />
    <button className="traffic-light traffic-light--minimize" onClick={onMinimize} aria-label="Minimize" />
    <button className="traffic-light traffic-light--zoom" onClick={onZoom} aria-label="Zoom" />
  </div>
));
