import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./design-system/erp.css";

const root = document.getElementById("root");
if (root)
  createRoot(root).render(
    <div className="ayu-erp">
      <div className="ayu-demo-ribbon">
        Demonstration workspace · Synthetic patient data · External identity,
        insurance and hospital integrations may be simulated
      </div>
      <App />
    </div>,
  );
