Current theme: blue Tailwind semantic tokens for ERP; jade #176654, gray #f5f7f6 clinical workspace. Target: ivory #fffcf5, jade #087f72, ink #182724, sage #e6f4ef, amber #d98558. 4px spacing, 240px sidebar, 72px topbar, 12/20px radii.
## `frontend/website/src/index.css`
```
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    :root {
        --background: 0 0% 100%;
        --foreground: 222.2 84% 4.9%;

        --card: 0 0% 100%;
        --card-foreground: 222.2 84% 4.9%;

        --popover: 0 0% 100%;
        --popover-foreground: 222.2 84% 4.9%;

        --primary: 221.2 83.2% 53.3%;
        --primary-foreground: 210 40% 98%;

        --secondary: 210 40% 96.1%;
        --secondary-foreground: 222.2 47.4% 11.2%;

        --muted: 210 40% 96.1%;
        --muted-foreground: 215.4 16.3% 46.9%;

        --accent: 210 40% 96.1%;
        --accent-foreground: 222.2 47.4% 11.2%;

        --destructive: 0 84.2% 60.2%;
        --destructive-foreground: 210 40% 98%;

        --border: 214.3 31.8% 91.4%;
        --input: 214.3 31.8% 91.4%;
        --ring: 221.2 83.2% 53.3%;

        --radius: 0.5rem;

        /* NEW UI COLORS */
        --sidebar-bg: #f8fafc;
    }
}

@layer base {
    * {
        @apply border-border;
    }

    body {
        @apply bg-background text-foreground;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-feature-settings: "tnum" on, "lnum" on;
        min-height: max(884px, 100dvh);
        scroll-behavior: smooth;
    }

    .glass-effect {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .gradient-border {
        position: relative;
        border-radius: 1rem;
    }

    .gradient-border::before {
        content: "";
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        padding: 2px;
        background: linear-gradient(45deg, #00f2fe, #4facfe, #a18cd1, #fbc2eb);
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
    }

    /* Remove scrolling strictly for main window, allow inside contents */
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
}

/* Material Symbols Overrides */
.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

@layer utilities {
    .glass-panel {
        @apply bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-slate-900/5 rounded-2xl transition-all duration-300;
    }

    .glass-card {
        @apply bg-white/60 backdrop-blur-md border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl;
    }

    .btn-primary {
        @apply bg-[hsl(var(--primary))] hover:opacity-90 text-white shadow-lg shadow-slate-500/25 rounded-xl font-medium transition-all duration-300 active:scale-95;
    }

    .btn-outline {
        @apply border border-slate-200 bg-white/50 hover:bg-white hover:text-[hsl(var(--primary))] hover:border-[hsl(var(--primary))] text-slate-600 shadow-sm transition-all duration-200 rounded-xl;
    }

    .input-field {
        @apply w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-[hsl(var(--primary))] transition-all duration-200 placeholder:text-slate-400 font-medium;
    }

    .sidebar-item {
        @apply flex items-center gap-3 px-4 py-3 text-slate-500 font-medium rounded-xl hover:bg-slate-50 hover:text-[hsl(var(--primary))] transition-all duration-200 cursor-pointer;
    }

    .sidebar-item-active {
        @apply bg-[hsl(var(--primary))] text-white shadow-lg shadow-slate-500/30 hover:opacity-90 hover:text-white;
    }

    .perspective-1000 {
        perspective: 1000px;
    }

    @keyframes pulse-slow {

        0%,
        100% {
            opacity: 0.1;
            transform: scale(1);
        }

        50% {
            opacity: 0.3;
            transform: scale(1.05);
        }
    }

    @keyframes float {

        0%,
        100% {
            transform: translateY(0);
        }

        50% {
            transform: translateY(-10px);
        }
    }

    .animate-pulse-slow {
        animation: pulse-slow 8s ease-in-out infinite;
    }

    .animate-float {
        animation: float 6s ease-in-out infinite;
    }
}
```

## `frontend/website/tailwind.config.js`
```
/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'sans-serif'],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                sidebar: {
                    DEFAULT: "var(--sidebar-bg)",
                },
                artemis: { navy: "#0f172a", blue: "#3b82f6" }
            }
        }
    },
    plugins: [],
};

```