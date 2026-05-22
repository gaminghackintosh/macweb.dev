const assetModules = import.meta.glob("./**/*.{png,svg,webp,jpg,jpeg,ico}", {
  eager: true,
  import: "default",
});

/**
 * @param {string | null | undefined} relativePath — например "icons/apps/finder.png"
 * @returns {string | null} URL для <img src> или null, если файла нет
 */
export function resolveAssetUrl(relativePath) {
  if (!relativePath) return null;
  const key = relativePath.startsWith("./") ? relativePath : `./${relativePath}`;
  return assetModules[key] ?? null;
}
