export const WALLPAPERS = [
  {
    id: "sonoma-default",
    name: "Sonoma",
    gradient: `
      radial-gradient(ellipse at 25% 35%, rgba(120, 40, 220, 0.75) 0%, transparent 55%),
      radial-gradient(ellipse at 78% 20%, rgba(255, 110, 40, 0.65) 0%, transparent 45%),
      radial-gradient(ellipse at 55% 78%, rgba(20, 90, 220, 0.55) 0%, transparent 48%),
      radial-gradient(ellipse at 85% 80%, rgba(200, 40, 120, 0.45) 0%, transparent 40%),
      linear-gradient(145deg, #0d0718 0%, #1a0833 35%, #0d1a3a 65%, #0d1f18 100%)
    `,
  },
  {
    id: "monterey-blue",
    name: "Monterey",
    gradient: `
      radial-gradient(ellipse at 40% 30%, rgba(100, 180, 255, 0.4) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 70%, rgba(80, 150, 220, 0.3) 0%, transparent 45%),
      linear-gradient(135deg, #0a1a3a 0%, #0a2a4a 40%, #051020 100%)
    `,
  },
  {
    id: "big-sur-green",
    name: "Big Sur",
    gradient: `
      radial-gradient(ellipse at 50% 30%, rgba(80, 180, 120, 0.35) 0%, transparent 55%),
      radial-gradient(ellipse at 25% 70%, rgba(100, 200, 150, 0.25) 0%, transparent 45%),
      linear-gradient(135deg, #0a2a0a 0%, #1a3a1a 40%, #050a05 100%)
    `,
  },
  {
    id: "space-black",
    name: "Space Black",
    gradient: `
      radial-gradient(ellipse at 20% 40%, rgba(100, 150, 255, 0.25) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 70%, rgba(150, 100, 255, 0.2) 0%, transparent 50%),
      linear-gradient(180deg, #0a0a1a 0%, #1a0f2a 50%, #0d0a1a 100%)
    `,
  },
  {
    id: "sunset-orange",
    name: "Sunset",
    gradient: `
      radial-gradient(ellipse at 30% 40%, rgba(255, 100, 50, 0.4) 0%, transparent 55%),
      radial-gradient(ellipse at 70% 60%, rgba(255, 150, 80, 0.3) 0%, transparent 45%),
      linear-gradient(135deg, #2a1510 0%, #4a2510 40%, #1a0a0a 100%)
    `,
  },
  {
    id: "ventura-teal",
    name: "Ventura",
    gradient: `
      radial-gradient(ellipse at 35% 35%, rgba(50, 200, 200, 0.3) 0%, transparent 55%),
      radial-gradient(ellipse at 75% 65%, rgba(80, 180, 220, 0.25) 0%, transparent 50%),
      linear-gradient(135deg, #0a1a2a 0%, #1a2a3a 40%, #0a1015 100%)
    `,
  },
];

export const DEFAULT_WALLPAPER = WALLPAPERS[0];

export function getWallpaperById(id) {
  return WALLPAPERS.find((w) => w.id === id) || DEFAULT_WALLPAPER;
}