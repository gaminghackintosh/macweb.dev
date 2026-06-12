import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/features/main.scss";

const AppWrapper = process.env.NODE_ENV === 'production' ? App : React.StrictMode;

document.addEventListener(
  "contextmenu",
  (e) => {
    if (e.shiftKey) return;
    e.preventDefault();
  },
  { capture: true }
);

const root = ReactDOM.createRoot(document.getElementById("root"));

// ✅ Profiler только в development
if (process.env.NODE_ENV === 'development') {
  const { Profiler } = React;
  
  const onRenderCallback = (id, phase, actualDuration) => {
    if (actualDuration > 16) {
      console.warn(`⚠️ ${id} took ${actualDuration.toFixed(2)}ms (>16ms = 1 frame)`);
    }
  };
  
  root.render(
    <Profiler id="App" onRender={onRenderCallback}>
      <AppWrapper>
        <App />
      </AppWrapper>
    </Profiler>
  );
} else {
  // ✅ Production рендер без Profiler
  root.render(<AppWrapper><App /></AppWrapper>);
}
