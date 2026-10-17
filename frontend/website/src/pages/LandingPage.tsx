import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Hospital, 
  Stethoscope, 
  AlertTriangle, 
  Smartphone, 
  ArrowRight
} from 'lucide-react';
import ReactGA from 'react-ga4';

interface DashboardItem {
  id: string;
  num: string;
  title: string;
  view: string;
  icon: React.ReactNode;
  tag: string;
  borderColor: string;
  hoverBg: string;
  tagColor: string;
  iconBg: string;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const dashboards: DashboardItem[] = [
    {
      id: 'patient-kiosk',
      num: '01',
      title: 'Patient Health Portal & Kiosk',
      view: 'patient-kiosk',
      icon: <Smartphone className="w-6 h-6 text-amber-600" />,
      tag: 'Personal Records & Touchless Intake',
      borderColor: 'hover:border-amber-500',
      hoverBg: 'group-hover:text-amber-600',
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
      iconBg: 'bg-amber-50 border-amber-100',
    },
    {
      id: 'doctor-opd',
      num: '02',
      title: 'Doctor Consultation (OPD)',
      view: 'doctor-consultation',
      icon: <Stethoscope className="w-6 h-6 text-teal-600" />,
      tag: 'Clinical Cockpit & AI SOAP',
      borderColor: 'hover:border-teal-500',
      hoverBg: 'group-hover:text-teal-600',
      tagColor: 'bg-teal-50 text-teal-700 border-teal-200',
      iconBg: 'bg-teal-50 border-teal-100',
    },
    {
      id: 'nurse-stat',
      num: '03',
      title: 'Emergency Triage (STAT)',
      view: 'emergency-triage',
      icon: <AlertTriangle className="w-6 h-6 text-rose-600" />,
      tag: 'Life-Critical Resuscitation',
      borderColor: 'hover:border-rose-500',
      hoverBg: 'group-hover:text-rose-600',
      tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
      iconBg: 'bg-rose-50 border-rose-100',
    },
    {
      id: 'hq-command',
      num: '04',
      title: 'Headquarters Command Center',
      view: 'admin',
      icon: <Building2 className="w-6 h-6 text-indigo-600" />,
      tag: 'Multi-Clinic Group',
      borderColor: 'hover:border-indigo-500',
      hoverBg: 'group-hover:text-indigo-600',
      tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconBg: 'bg-indigo-50 border-indigo-100',
    },
    {
      id: 'clinic-hub',
      num: '05',
      title: 'Clinic Operations & POS',
      view: 'clinic-admin',
      icon: <Hospital className="w-6 h-6 text-blue-600" />,
      tag: 'Single Clinic & Pharmacy',
      borderColor: 'hover:border-blue-500',
      hoverBg: 'group-hover:text-blue-600',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-50 border-blue-100',
    },
  ];

  const handleSelectDashboard = (dash: DashboardItem) => {
    ReactGA.event({
      category: 'Portal Selection',
      action: `Selected ${dash.title}`,
      label: dash.view,
    });
    localStorage.setItem('lastActiveView', dash.view);
    navigate(`/app?view=${dash.view}`);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      
      {/* Top Header Bar */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-white text-xl">local_hospital</span>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 block leading-none">
              AYUSETU
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mt-0.5">
              Continuity-of-Care OS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>5 Portals Live</span>
        </div>
      </header>

      {/* Main Selection Area */}
      <main className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 block mb-2">
            Healthcare Operating System
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Select Dashboard
          </h1>
        </div>

        {/* 5 Distinct Dashboard Cards - Just the Names & Portals */}
        <div className="space-y-3.5">
          {dashboards.map((dash) => (
            <button
              key={dash.id}
              onClick={() => handleSelectDashboard(dash)}
              className={`w-full group bg-white border-2 border-slate-200 rounded-2xl p-5 sm:p-6 text-left flex items-center justify-between shadow-sm hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer ${dash.borderColor}`}
            >
              <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                {/* Monospace Number & Icon */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-sm font-bold text-slate-400 w-6">
                    {dash.num}
                  </span>
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 ${dash.iconBg}`}>
                    {dash.icon}
                  </div>
                </div>

                {/* Dashboard Name & Tag */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${dash.tagColor}`}>
                      {dash.tag}
                    </span>
                  </div>
                  <h2 className={`text-xl sm:text-2xl font-bold text-slate-900 tracking-tight transition-colors truncate ${dash.hoverBg}`}>
                    {dash.title}
                  </h2>
                </div>
              </div>

              {/* Action Chevron */}
              <div className="shrink-0 pl-4 flex items-center">
                <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-slate-900 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-200">
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs font-mono text-slate-400">
        Cloudflare Native · D1 Multi-Tenant · Zero PHI Leaks
      </footer>

    </div>
  );
};

export default LandingPage;

