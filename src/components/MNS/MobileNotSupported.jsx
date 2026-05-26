import React, { useState } from "react";
import "./scss/main.scss";

const FEATURES = [
  {
    icon: "🌄",
    title: "Для большого экрана",
    desc: "Интерфейс macOS воссоздан для разрешения от 1024 px",
  },
  {
    icon: "✨",
    title: "Живая атмосфера",
    desc: "Матовое стекло, мягкие тени и плавные анимации",
  },
  {
    icon: "🖥️",
    title: "Настоящие приложения",
    desc: "Finder, Терминал, Notes, Dock — всё как на Mac",
  },
];

export default function MobileNotSupported() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="mns-backdrop">
      <div className="mns-desktop-bg" />

      <div className="mns-window" role="dialog" aria-modal="true">
        {/* ── Заголовок окна ── */}
        <div className="mns-titlebar">
          <div className="mns-traffic">
            <div className="tl tl-close" title="Доступно только на ПК" />
            <div className="tl tl-min" />
            <div className="tl tl-max" />
          </div>
          <span className="mns-titlebar-label">hackintosh.web</span>
          <div className="mns-titlebar-spacer" />
        </div>

        {/* ── Контент ── */}
        <div className="mns-body">
          <div className="mns-hero">
            <div className="mns-app-icon" aria-hidden="true">
              <span className="mns-app-icon-inner">🏔️</span>
            </div>
            <div className="mns-hero-text">
              <h1 className="mns-title">Откройте на большом экране</h1>
              <p className="mns-subtitle">macOS Experience</p>
              <p className="mns-description">
                hackintosh.web — это полноценная среда macOS прямо в браузере.
                На телефоне ей тесно. Возьмите ноутбук или компьютер, чтобы
                погрузиться в атмосферу настоящего Mac.
              </p>
            </div>
          </div>

          <div className="mns-features-box">
            <div className="mns-features" role="list">
              {FEATURES.map((f) => (
                <div className="mns-feature-row" role="listitem" key={f.title}>
                  <div className="mns-feature-icon" aria-hidden="true">
                    {f.icon}
                  </div>
                  <div className="mns-feature-text">
                    <span className="mns-feature-title">{f.title}</span>
                    <span className="mns-feature-desc">{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mns-actions">
            <button
              className={`mns-btn ${copied ? "mns-btn--success" : "mns-btn--primary"}`}
              onClick={handleCopyLink}
            >
              {copied
                ? "Ссылка скопирована! Отправьте её на компьютер"
                : "Скопировать ссылку"}
            </button>
          </div>

          <p className="mns-footer">© 2026 gaminghackintosh</p>
        </div>
      </div>
    </div>
  );
}