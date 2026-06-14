import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/features/main.scss";

document.addEventListener(
  "contextmenu",
  (e) => {
    if (e.shiftKey) return;
    e.preventDefault();
  },
  { capture: true }
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  process.env.NODE_ENV === 'production' 
    ? <App />
    : <React.StrictMode><App /></React.StrictMode>
);
