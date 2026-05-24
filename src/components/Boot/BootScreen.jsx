import React, { useEffect, useState } from "react";
import "./../../styles/BootScreen.scss";

// ════════════════════════════════════════════════════════════
//  BootScreen — Classic macOS boot animation
// ══════════════════════════════════════════════════════════════

export default function BootScreen({ onComplete }) {
  const [showLogo, setShowLogo] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Logo appears after 200ms
    const logoTimer = setTimeout(() => setShowLogo(true), 200);

    // Progress bar starts after 600ms
    const progressTimer = setTimeout(() => setShowProgress(true), 600);

    // Simulate progress
    let progressInterval;
    progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return p + Math.random() * 30;
      });
    }, 400);

    // Complete boot after 3.2 seconds
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(onComplete, 300);
    }, 3200);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(progressTimer);
      clearTimeout(completeTimer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="boot-screen">
      <div className="boot-bg" />

      <div className="boot-container">
        {/* Apple logo */}
        <div className={`boot-logo ${showLogo ? "boot-logo--show" : ""}`}>
          <div className="apple-logo"></div>
        </div>

        {/* Loading text */}
        <div className={`boot-text ${showLogo ? "boot-text--show" : ""}`}>
          hackintosh.web
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className="boot-progress">
            <div
              className="boot-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className={`boot-footer ${showProgress ? "boot-footer--show" : ""}`}>
        Starting up...
      </div>
    </div>
  );
}