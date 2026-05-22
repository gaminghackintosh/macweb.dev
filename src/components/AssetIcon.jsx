import React, { useState } from "react";
import { resolveAssetUrl } from "../assets/resolveIcon";

/**
 * Показывает картинку из src/assets или emoji-fallback.
 */
export function AssetIcon({ path, fallback = "", size = 24, alt = "", style, imgStyle, className }) {
  const url = resolveAssetUrl(path);
  const [broken, setBroken] = useState(false);

  if (!url || broken) {
    return (
      <span
        className={className}
        role="img"
        aria-label={alt || undefined}
        style={{
          ...(size && { width: size, height: size }),
          fontSize: size,
          lineHeight: 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
      >
        {fallback}
      </span>
    );
  }
  return (
    <span
      className={className}
      style={{
        width: size,
        height: size,
        display: "inline-block",
        overflow: "hidden",
        lineHeight: 0,
        ...style,
      }}
    >
      <img
        src={url}
        alt={alt}
        draggable={false}
        onError={() => setBroken(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          border: "none",
          outline: "none",
          pointerEvents: "none",
          ...imgStyle,
        }}
      />
    </span>
  );
}
