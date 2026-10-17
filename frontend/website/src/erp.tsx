import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./design-system/erp.css";

const root = document.getElementById("root");
if (root)
  createRoot(root).render(
    <div className="ayu-erp">
      <div className="ayu-demo-ribbon flex items-center justify-center gap-2">
        <img
          src="/assets/ayusetu_logo.png"
          alt="AyuSetu"
          className="h-3.5 w-auto object-contain inline-block"
        />
        <span>
          AyuSetu Enterprise Workspace · Unified Continuity of Care · Cloudflare D1 & Edge Engine
        </span>
      </div>
      <App />
    </div>,
  );
