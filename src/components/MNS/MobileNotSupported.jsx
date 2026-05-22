import React from "react";

import "./scss/main.scss";

export default function MobileNotSupported() {
  return (
    <div className="mobile-not-supported">
      <div className="mobile-content">
        <div className="mobile-icon">💻</div>
        
        <h1 className="mobile-title">macOS Experience</h1>
        
        <p className="mobile-subtitle">
          This site is designed for desktop and laptop computers.
        </p>
        
        <p className="mobile-description">
          Please open this page on your desktop or laptop to experience the full macOS-inspired interface.
        </p>
        
        <div className="mobile-features">
          <div className="feature-item">
            <span className="feature-icon">🖥️</span>
            <span>Desktop Only</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎨</span>
            <span>macOS Design</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⌨️</span>
            <span>Full Experience</span>
          </div>
        </div>

        <footer className="mobile-footer">
          <p>© 2026 gaminghackintosh. Open on desktop to continue.</p>
        </footer>
      </div>
    </div>
  );
}
