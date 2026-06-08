import React, { useEffect, useState } from "react";
import AppleLogo from "@/assets/icons/preloader/Apple_Logo_Test.svg";

// ════════════════════════════════════════════════════════════
//  BootScreen — Realistic macOS boot animation
// ══════════════════════════════════════════════════════════════

export default function BootScreen({ onComplete }) {
  const [showLogo, setShowLogo] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo(true), 150);
    const progressTimer = setTimeout(() => setShowProgress(true), 500);

    let startTime = performance.now();

    let progressInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      let newProgress = 0;

      if (elapsed < 800) {
        newProgress = Math.min(30, (elapsed / 800) * 30);
      } else if (elapsed < 2200) {
        const t = (elapsed - 800) / 1400;

        newProgress = 30 + Math.min(55, t * 55);

        if (newProgress > 45 && newProgress < 47) newProgress = 45.5;
        if (newProgress > 70 && newProgress < 72) newProgress = 71;
      } else if (elapsed < 2800) {
        const t = (elapsed - 2200) / 600;

        newProgress = 85 + Math.min(10, t * 10);
      } else {
        newProgress =
          95 + Math.min(5, ((elapsed - 2800) / 400) * 5);
      }

      newProgress = Math.min(
        100,
        Math.floor(newProgress * 10) / 10
      );

      if (newProgress >= 100) {
        clearInterval(progressInterval);

        setProgress(100);

        setTimeout(onComplete, 300);
      } else {
        setProgress(newProgress);
      }
    }, 50);

    const safetyTimer = setTimeout(() => {
      if (progress < 100) {
        clearInterval(progressInterval);

        setProgress(100);

        setTimeout(onComplete, 300);
      }
    }, 5000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(progressTimer);
      clearTimeout(safetyTimer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="boot-screen">
      <div className="boot-bg" />

      <div className="boot-container">
        <div
          className={`boot-logo ${
            showLogo ? "boot-logo--show" : ""
          }`}
        >
          <img
            src={AppleLogo}
            alt="Apple Logo"
            className="apple-logo"
            draggable={false}
            fetchPriority="high"
            decoding="async"
          />
        </div>

        {showProgress && (
          <div className="boot-progress">
            <div
              className="boot-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}