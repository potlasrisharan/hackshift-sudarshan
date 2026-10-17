import { SymbolIcon } from "@/components/ui/SymbolIcon";

import React from 'react';
import ReactGA from "@/lib/analytics-client";
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative bg-white pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden border-b border-slate-100">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-primary/15 rounded-full filter blur-[100px] animate-pulse duration-[4000ms]"></div>
        <div className="absolute bottom-0 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-cyan-400/15 rounded-full filter blur-[100px] animate-pulse duration-[5000ms]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left z-10 relative">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-4 md:mb-6 tracking-tight">
              Welcome to AyuSetu:<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-cyan-400 pb-2 inline-block">
                Healthcare Operations, Reimagined.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-xl font-medium">
              Seamlessly Integrating Clinic and Hospital Management for Better Patient Outcomes. Empowering providers with data-driven workflows and real-time operational visibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
              <button
                onClick={() => {
                  const el = document.getElementById('offers');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-1 w-full sm:w-auto text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Explore 5 Dashboards</span>
                <SymbolIcon className="material-symbols-outlined text-lg">arrow_downward</SymbolIcon>
              </button>
              <button
                onClick={() => {
                  ReactGA.event({
                    category: "App Launch",
                    action: "Clicked Instant Launch",
                  });
                  localStorage.setItem('lastActiveView', 'admin');
                  navigate('/app');
                }}
                className="bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 hover:text-blue-600 hover:border-blue-400 px-8 py-4 rounded-2xl text-lg font-bold shadow-sm transition-all hover:-translate-y-1 w-full sm:w-auto text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Instant Launch</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">No Login</span>
              </button>
            </div>

            {/* Quick 5-Portal Profile Dock */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                1-Click Direct Entry by Profile:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'HQ Group', icon: 'domain', view: 'admin', color: 'hover:border-indigo-500 hover:text-indigo-600' },
                  { label: 'Clinic Hub', icon: 'local_hospital', view: 'clinic-admin', color: 'hover:border-blue-500 hover:text-blue-600' },
                  { label: 'Doctor OPD', icon: 'stethoscope', view: 'doctor-consultation', color: 'hover:border-teal-500 hover:text-teal-600' },
                  { label: 'Nurse STAT', icon: 'emergency', view: 'emergency-triage', color: 'hover:border-rose-500 hover:text-rose-600' },
                  { label: 'Patient Kiosk', icon: 'touch_app', view: 'patient-kiosk', color: 'hover:border-amber-500 hover:text-amber-600' }
                ].map((item) => (
                  <button
                    key={item.view}
                    onClick={() => {
                      localStorage.setItem('lastActiveView', item.view);
                      navigate(`/app?view=${item.view}`);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer ${item.color}`}
                  >
                    <SymbolIcon className="material-symbols-outlined text-[16px]">{item.icon}</SymbolIcon>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div 
            onClick={() => {
              localStorage.setItem('lastActiveView', 'admin');
              navigate('/app');
            }}
            className="relative group flex justify-center lg:justify-end mt-16 lg:mt-0 z-10 transition-transform duration-700 hover:-translate-y-2 cursor-pointer"
            title="Click to launch live dashboard"
          >
            <div className="relative w-full max-w-xl aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border-4 border-white/50 bg-white">
              <div className="absolute inset-0 pointer-events-none"></div>

              {/* Dashboard Preview Image */}
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200"
                alt="AyuSetu Dashboard Preview"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90"
              />

              {/* Light Overlays */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-primary/5 z-10 mix-blend-overlay"></div>

              <div className="absolute top-6 right-6 z-20">
                <div className="bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-slate-800 text-[10px] font-bold tracking-widest uppercase">System Live</span>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-100 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-900 font-bold">Operational Efficiency</p>
                    <span className="text-primary font-mono font-bold text-sm">+24.8%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"></div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs text-blue-700 font-bold">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                    </div>
                    <p className="text-slate-500 font-medium text-[11px]">AyuSetu Unified Dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
