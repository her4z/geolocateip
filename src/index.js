import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import { hydrateRoot } from "react-dom/client";
import "./index.css";

const container = document.getElementById("root");
if (container && container.innerHTML !== "") {
  hydrateRoot(container, <App />);
} else {
  const root = createRoot(container);
  root.render(<App />);
}
