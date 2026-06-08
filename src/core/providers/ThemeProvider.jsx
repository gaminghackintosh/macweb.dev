import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isLightTheme, setIsLightTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'light';
  });

  // Применяем тему к документу при изменении
  useEffect(() => {
    const root = document.documentElement;
    if (isLightTheme) {
      root.classList.remove('dark-theme');
      root.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.remove('light-theme');
      root.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLightTheme]);

  const toggleTheme = useCallback(() => {
    setIsLightTheme(prev => !prev);
  }, []);

  const setTheme = useCallback((isLight) => {
    setIsLightTheme(isLight);
  }, []);

  const value = useMemo(() => ({
    isLightTheme,
    toggleTheme,
    setTheme,
  }), [isLightTheme, toggleTheme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
