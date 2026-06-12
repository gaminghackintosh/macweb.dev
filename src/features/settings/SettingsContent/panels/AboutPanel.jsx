import React, { memo } from "react";
import { SettingsPanel, SettingsGroup } from "@/features/settings/Settings_Components/SettingsPanel";

const AppleLogoSVG = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-.8 1.94-.8s.16 1.06-.59 1.91c-.7.81-1.87.76-1.87.76s-.21-1.02.52-1.87z"/>
  </svg>
);

export const AboutPanel = memo(() => (
  <SettingsPanel title="About">
    <div className="apple-about-container">
      <div className="about-hardware-hero">
        <div className="hardware-icon-canvas">
          <AppleLogoSVG />
        </div>
        <h2 className="hardware-title">hackintosh.web</h2>
        <p className="hardware-subtitle">Virtual Mac (Browser Edition)</p>
      </div>

      <SettingsGroup>
        <div className="sr-row">
          <span className="sr-label">Chip</span>
          <span className="sr-value">Apple M3 Max (Virtual 16-Core)</span>
        </div>
        <div className="sr-row">
          <span className="sr-label">Memory</span>
          <span className="sr-value">16 GB LPDDR5X</span>
        </div>
        <div className="sr-row">
          <span className="sr-label">Startup Disk</span>
          <span className="sr-value">Macintosh HD</span>
        </div>
        <div className="sr-row">
          <span className="sr-label">Serial Number</span>
          <span className="sr-value actionable-text">HACKW192K98X</span>
        </div>
      </SettingsGroup>

      <div className="settings-group-title">Operating System</div>
      <SettingsGroup>
        <div className="os-disclosure-row">
          <div className="os-meta-left">
            <div className="os-gradient-thumbnail" />
            <div className="os-text-stack">
              <span className="os-name">macOS Sonoma</span>
              <span className="os-version-build">Version 14.0.1 (23A344)</span>
            </div>
          </div>
          <button className="apple-btn-secondary">Software Update…</button>
        </div>
      </SettingsGroup>

      <div className="settings-group-title">Storage</div>
      <SettingsGroup>
        <div className="about-storage-box">
          <div className="storage-info-header">
            <span className="disk-name">Macintosh HD</span>
            <span className="disk-meta">342 GB available of 512 GB</span>
          </div>
          <div className="storage-bar-track">
            <div className="storage-bar-fill-system" style={{ width: "33%" }} />
          </div>
        </div>
      </SettingsGroup>

      <div className="about-legal-footer">
        <div className="legal-links-row">
          <button className="legal-link-btn">Regulatory Certification</button>
          <span className="legal-dot">•</span>
          <button className="legal-link-btn">License Agreement</button>
        </div>
        <p className="legal-copyright-text">
          ™ & © 1983–2026 Apple Inc. All rights reserved.
        </p>
      </div>
    </div>
  </SettingsPanel>
));
