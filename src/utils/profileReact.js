/**
 * Инструмент для профилирования производительности React приложения
 */

export function profileReact() {
  console.group('⚡ React Performance Profile');
  
  // 1. Подсчёт ре-рендеров
  const renderCounts = new Map();
  
  const originalCreateElement = React.createElement;
  React.createElement = function(...args) {
    const componentName = args[0]?.displayName || args[0]?.name || 'Unknown';
    renderCounts.set(componentName, (renderCounts.get(componentName) || 0) + 1);
    return originalCreateElement.apply(this, args);
  };
  
  // 2. Мониторинг FPS
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 0;
  
  const measureFPS = (currentTime) => {
    frameCount++;
    const delta = currentTime - lastTime;
    
    if (delta >= 1000) {
      fps = Math.round((frameCount * 1000) / delta);
      console.log(`📊 FPS: ${fps}`);
      frameCount = 0;
      lastTime = currentTime;
    }
    
    requestAnimationFrame(measureFPS);
  };
  
  requestAnimationFrame(measureFPS);
  
  // 3. Long Tasks Observer
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn(`⚠️ Long Task: ${entry.duration.toFixed(2)}ms`);
        }
      }
    });
    observer.observe({ entryTypes: ['longtask'] });
  }
  
  // 4. Вывод статистики по клику
  document.addEventListener('keydown', (e) => {
    if (e.key === 'p' && e.ctrlKey) {
      console.groupCollapsed('📈 Render Statistics');
      renderCounts.forEach((count, name) => {
        if (count > 5) {
          console.log(`${name}: ${count} renders`);
        }
      });
      console.groupEnd();
    }
  });
  
  console.log('✅ Profiler started. Press Ctrl+P to see render stats');
  console.groupEnd();
  
  return () => {
    React.createElement = originalCreateElement;
  };
}

/**
 * Хук для отслеживания ре-рендеров компонента
 */
export function useRenderCount(label) {
  const count = React.useRef(0);
  count.current++;
  console.log(`🔄 ${label} rendered ${count.current} times`);
}

/**
 * Компонент для измерения времени рендера
 */
export function RenderTimer({ children, label }) {
  const start = performance.now();
  const result = children;
  const end = performance.now();
  
  if (end - start > 16) {
    console.warn(`⚠️ ${label} took ${(end - start).toFixed(2)}ms to render`);
  }
  
  return result;
}
