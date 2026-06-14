import React, { memo } from "react";
import { SettingsPanel } from "@/features/settings/Settings_Components/SettingsPanel";
import macOS26Tahoe from "@/assets/images/logo/MacOS_Tahoe_Logo.png";

const AppleLogoSVG = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-.8 1.94-.8s.16 1.06-.59 1.91c-.7.81-1.87.76-1.87.76s-.21-1.02.52-1.87z"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
    <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SpecRow = ({ label, value, actionable = false, onClick }) => (
  <div className="sr-row">
    <div className="sr-left">
      <span className="sr-label">{label}</span>
    </div>
    <div className="sr-right">
      {actionable ? (
        <button className="spec-action" onClick={onClick}>
          <span>{value}</span>
          <ChevronIcon />
        </button>
      ) : (
        <span className="sr-value">{value}</span>
      )}
    </div>
  </div>
);

export const AboutPanel = memo(() => {
  const handleSerialClick = () => {
    navigator.clipboard?.writeText("HACKW192K98X");
  };

  return (
    <SettingsPanel title="About">
      <div className="about-panel">

        {/* ── Hero ── */}
        <div className="about-hero">
          <div className="about-icon-bg">
            <AppleLogoSVG />
          </div>
          <div className="about-hero-text">
            <h1 className="about-title">macweb.dev</h1>
            <p className="about-subtitle">Virtual Mac · Browser Edition</p>
          </div>
        </div>

        {/* ── Specifications ── */}
        <div className="sg-wrapper">
          <div className="sg-card">
            <SpecRow label="Chip" value="Apple M3 Max (Virtual 16-Core)" />
            <div className="sg-divider" />
            <SpecRow label="Memory" value="16 GB LPDDR5X" />
            <div className="sg-divider" />
            <SpecRow label="Startup Disk" value="Macintosh HD" />
            <div className="sg-divider" />
            <SpecRow
              label="Serial Number"
              value="HACKW192K98X"
              actionable
              onClick={handleSerialClick}
            />
          </div>
        </div>

        {/* ── macOS Version ── */}
        <div className="sg-wrapper">
          <div className="sg-label">Operating System</div>
          <div className="sg-card">
            <div className="os-row">
              <div className="os-row-left">
                <div className="os-icon">
                  <img src={macOS26Tahoe} alt="macOS Tahoe" className="os-icon-img" />
                </div>
                <div className="os-info">
                  <div className="os-name-row">
                    <span className="os-name">macOS Tahoe</span>
                    <span className="os-version">Version 26.0.1</span>
                  </div>
                  <span className="os-build">Build 23A344</span>
                </div>
              </div>
              <button className="apple-btn-secondary">Software Update…</button>
            </div>
          </div>
        </div>

        {/* ── Storage ── */}
        <div className="sg-wrapper">
          <div className="sg-label">Storage</div>
          <div className="sg-card">
            <div className="storage-row">
              <div className="storage-header">
                <span className="storage-name">Macintosh HD</span>
                <span className="storage-capacity">342 GB available of 512 GB</span>
              </div>
              <div className="storage-bar">
                <div className="storage-bar-fill" style={{ width: "33%" }} />
              </div>
              <div className="storage-legend">
                <div className="legend-item">
                  <span className="legend-dot system" />
                  <span>System</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot available" />
                  <span>Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="about-footer">
          <div className="footer-links">
            <button className="footer-link">System Report…</button>
            <span className="footer-divider" />
            <button className="footer-link">License Agreement</button>
          </div>
          <p className="footer-copyright">™ &amp; © 1983–2026 Apple Inc. All rights reserved.</p>
          <p className="footer-disclaimer">
            macweb.dev is a fan project and is not affiliated with Apple Inc.
          </p>
        </div>

      </div>
    </SettingsPanel>
  );
});