import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./design-system/erp.css";

const root = document.getElementById("root");
if (root)
  createRoot(root).render(
    <div className="ayu-erp">
      <div className="ayu-demo-ribbon flex items-center justify-center gap-3 py-2 px-4 shadow-sm">
        <img
          src="/assets/ayusetu_logo.png"
          alt="AyuSetu"
          className="h-7 md:h-8 w-auto object-contain inline-block shrink-0"
        />
        <span className="font-semibold text-xs md:text-sm tracking-wide">
          AyuSetu Enterprise Workspace · Unified Continuity of Care · Cloudflare D1 & Edge Engine
        </span>
      </div>
      <App />
    </div>,
  );
