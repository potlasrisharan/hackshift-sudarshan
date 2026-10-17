
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import ReactGA from '@/lib/analytics-client';

interface DashboardOffering {
  id: string;
  viewKey: string;
  badge: string;
  badgeColor: string;
  persona: string;
  roleTitle: string;
  title: string;
  description: string;
  heroMetric: { label: string; value: string };
  bullets: string[];
  gradient: string;
  accentBg: string;
  mockup: {
    title: string;
    pill1: string;
    pill2: string;
    stats: { label: string; val: string }[];
    previewBadge: string;
    previewBadgeColor: string;
  };
}

const Offers: React.FC = () => {
  const navigate = useNavigate();

  const handleLaunch = (viewKey: string, title: string) => {
    ReactGA.event({
      category: 'Dashboard Launch',
      action: `Launched ${title}`,
      label: viewKey,
    });
    localStorage.setItem('lastActiveView', viewKey);
    navigate(`/app?view=${viewKey}`);
  };

  const dashboards: DashboardOffering[] = [
    {
      id: 'patient-kiosk',
      viewKey: 'patient-kiosk',
      badge: 'PORTAL 1 · MULTILINGUAL PATIENT KIOSK',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      persona: 'Walk-in Patient & Family Caregiver',
      roleTitle: 'Patient Self-Service',
      title: 'Patient Multilingual Kiosk Check-In',
      description: 'Universal accessibility terminal designed for any Indian citizen. 6 native languages, ABHA 14-digit digital ID validation, PM-JAY ₹5L cover check, and thermal boarding-pass token.',
      heroMetric: { label: 'Coverage Synced', value: '₹5,00,000' },
      bullets: [
        '6 Indian Languages (हिंदी, English, தமிழ், తెలుగు, ਪੰਜਾਬੀ, বাংলা)',
        'ABHA 14-Digit Digital Health ID & PM-JAY Cashless Sync',
        'Multilingual Voice Microphone Symptom Recording',
        'Thermal Token Slip #042 with QR Code & Audio Announcement'
      ],
      gradient: 'from-amber-600 to-orange-600',
      accentBg: 'bg-amber-600',
      mockup: {
        title: 'Self Check-In Kiosk · Hindi / English / Telugu',
        pill1: 'ABHA: 91-4521-8890-12',
        pill2: 'PM-JAY: ₹5L Cashless Active',
        stats: [
          { label: 'Token', val: '#042 OPD' },
          { label: 'Language', val: 'हिंदी / English' },
          { label: 'Wait Time', val: '12 Mins' },
          { label: 'Doctor', val: 'Room 104' }
        ],
        previewBadge: 'Touch Terminal',
        previewBadgeColor: 'bg-amber-500/20 text-amber-300'
      }
    },
    {
      id: 'doctor-opd',
      viewKey: 'doctor-consultation',
      badge: 'PORTAL 2 · CLINICAL OPD COCKPIT',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      persona: 'Consulting Physician & Surgeon',
      roleTitle: 'Doctor Clinical Workspace',
      title: 'Doctor OPD Cockpit & AI SOAP',
      description: 'Distraction-free clinical cockpit. Instant patient vitals HUD, ambient voice-to-SOAP note generation, ICD-11 & NAMASTE coding, and Jan Aushadhi generic substitution.',
      heroMetric: { label: 'Generic Savings', value: '88% per Rx' },
      bullets: [
        'Active Patient Vitals HUD (BP 120/80, SpO2 99%, Pulse 72)',
        'Ambient AI SOAP Notes with Voice Transcript Citations',
        'Jan Aushadhi Generic Drug Substitution (₹180 → ₹18)',
        '1-Click Send to POS, Admit to Bed, or Print PDF Rx'
      ],
      gradient: 'from-teal-600 to-emerald-600',
      accentBg: 'bg-teal-600',
      mockup: {
        title: 'Patient Consult · Rajesh Sharma (48M)',
        pill1: 'BP: 120/80 mmHg · SpO2 99%',
        pill2: 'Jan Aushadhi: ₹162 Saved',
        stats: [
          { label: 'Diagnosis', val: 'ICD-11: BA00' },
          { label: 'SOAP Notes', val: 'AI Synced' },
          { label: 'Pharmacy', val: 'In Stock' },
          { label: 'Action', val: '1-Click POS' }
        ],
        previewBadge: 'Physician View',
        previewBadgeColor: 'bg-teal-500/20 text-teal-300'
      }
    },
    {
      id: 'nurse-stat',
      viewKey: 'emergency-triage',
      badge: 'PORTAL 3 · LIFE-CRITICAL EMERGENCY',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      persona: 'ER Charge Nurse & Trauma Specialist',
      roleTitle: 'Emergency Department',
      title: 'Nurse STAT Emergency Triage',
      description: 'Sub-15ms life-critical ER triage HUD powered by the Sentinel deterministic rule engine. Automated crisis parameter triggers, resuscitation bays, and code team dispatch.',
      heroMetric: { label: 'Decision Speed', value: '<15ms Guarantee' },
      bullets: [
        'Crimson Pulsing Beacon for Immediate STAT Emergencies',
        'Sentinel Rule Engine: Deterministic Sub-15ms Triage',
        'Crisis Thresholds: Hypertensive Crisis, Hypoxia, Tachycardia',
        '1-Click Code Blue Crash Cart Dispatch & IPD Bed Admission'
      ],
      gradient: 'from-rose-600 to-red-700',
      accentBg: 'bg-rose-600',
      mockup: {
        title: 'Trauma Resus Bay 2 · STAT Alert Active',
        pill1: 'Sentinel Engine: 9ms Latency',
        pill2: 'Code Cart: Dispatched',
        stats: [
          { label: 'BP Crisis', val: '185/110' },
          { label: 'SpO2 Level', val: '86% STAT' },
          { label: 'Resus Bay', val: 'Bay 2 Engaged' },
          { label: 'Protocol', val: 'Immediate' }
        ],
        previewBadge: 'LIFE-CRITICAL',
        previewBadgeColor: 'bg-rose-500/20 text-rose-300 animate-pulse'
      }
    },
    {
      id: 'hq-command',
      viewKey: 'admin',
      badge: 'PORTAL 4 · MULTI-CLINIC HQ COMMAND',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      persona: 'Hospital Group Executive & Director',
      roleTitle: 'Headquarters Leadership',
      title: 'HQ Multi-Clinic Command Center',
      description: 'The master operational cockpit for hospital owners and network executives. Monitor cross-clinic revenue, inter-branch stock transfers, and cryptographic audit chains.',
      heroMetric: { label: 'Network Revenue', value: '₹24,80,000' },
      bullets: [
        'Multi-Clinic Financial Consolidation & Daily P&L',
        'Central Procurement & Inter-Branch Stock Rebalance',
        'Cryptographic Audit Chain Integrity Verification',
        'Role-Based Staff Access & Shift Roster Control'
      ],
      gradient: 'from-indigo-600 to-blue-700',
      accentBg: 'bg-indigo-600',
      mockup: {
        title: 'Network Overview · 4 Active Branches',
        pill1: 'Audit Chain: Verified 100%',
        pill2: 'Central PO: Auto-Dispatched',
        stats: [
          { label: 'Clinics', val: '4 Active' },
          { label: 'Occupancy', val: '86.4%' },
          { label: 'Transactions', val: '1,420' },
          { label: 'Cloudflare D1', val: 'Multi-Tenant' }
        ],
        previewBadge: 'Executive Mode',
        previewBadgeColor: 'bg-indigo-500/20 text-indigo-300'
      }
    },
    {
      id: 'clinic-hub',
      viewKey: 'clinic-admin',
      badge: 'PORTAL 5 · CLINIC OPERATIONS & POS',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      persona: 'Clinic Branch Manager & Pharmacist Lead',
      roleTitle: 'Single Clinic Operations',
      title: 'Clinic Hub & Point-of-Sale (POS)',
      description: 'A sub-second checkout and dispensing terminal. Run high-velocity OPD consultations, real-time batch inventory depletion, and instant thermal tax receipts.',
      heroMetric: { label: 'Today Dispensed', value: '142 Orders' },
      bullets: [
        'Lightning-Fast Barcode POS Billing & Tax Invoices',
        'Drift Radar: Near-Expiry (<30d) Batch Telemetry',
        'Automated Real-Time Stock Depletion Ledger',
        'Staff Biometric Attendance & Daily Cash Drawer Sync'
      ],
      gradient: 'from-blue-600 to-cyan-600',
      accentBg: 'bg-blue-600',
      mockup: {
        title: 'Clinic Pharmacy Terminal · Station 01',
        pill1: 'POS Latency: <180ms',
        pill2: 'Drift Radar: 3 Near-Expiry',
        stats: [
          { label: 'OPD Bills', val: '₹48,250' },
          { label: 'Inventory', val: '2,840 Items' },
          { label: 'Receipt', val: 'Thermal PDF' },
          { label: 'POS Sync', val: 'D1 Live' }
        ],
        previewBadge: 'POS Active',
        previewBadgeColor: 'bg-blue-500/20 text-blue-300'
      }
    }
  ];

  return (
    <section id="offers" className="py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Zero Login Walls · 1-Click Interactive Access</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            The 5 Specialized Healthcare Portals
          </h2>
          <p className="text-base md:text-lg text-slate-600 font-medium">
            Click any portal picture below to enter the live dashboard immediately. Pre-authenticated, fully functional, and connected across the unified Cloudflare architecture.
          </p>
        </div>

        {/* 5-Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboards.map((dash, index) => {
            const isFullWidthOnLarge = index === 0; // HQ takes 2 cols on lg if desired, or uniform
            return (
              <div
                key={dash.id}
                className={`bg-white border-2 border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:border-blue-400 hover:-translate-y-2 transition-all duration-300 flex flex-col group ${
                  isFullWidthOnLarge ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Visual Dashboard Picture / Mockup Container */}
                <div className={`p-6 sm:p-8 bg-gradient-to-br ${dash.gradient} text-white relative overflow-hidden`}>
                  {/* Subtle Grid / Circuit pattern overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>
                  
                  {/* Top Bar inside Mockup */}
                  <div className="relative z-10 flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                      <span className="text-xs font-mono font-bold tracking-wider opacity-85 ml-2">
                        ayusetu://{dash.viewKey}
                      </span>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-md ${dash.mockup.previewBadgeColor}`}>
                      {dash.mockup.previewBadge}
                    </span>
                  </div>

                  {/* Mockup Card Main Display */}
                  <div className="relative z-10 bg-slate-900/60 backdrop-blur-md border border-white/15 rounded-2xl p-5 shadow-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
                      <div>
                        <h4 className="font-bold text-white text-base tracking-tight">{dash.mockup.title}</h4>
                        <p className="text-xs text-white/70 font-mono mt-0.5">{dash.persona}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-white/60 block">{dash.heroMetric.label}</span>
                        <span className="text-lg font-black text-emerald-400 font-mono">{dash.heroMetric.value}</span>
                      </div>
                    </div>

                    {/* Quick Telemetry Pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-[11px] font-semibold bg-white/15 px-2.5 py-1 rounded-lg text-white/90 border border-white/10">
                        {dash.mockup.pill1}
                      </span>
                      <span className="text-[11px] font-semibold bg-white/15 px-2.5 py-1 rounded-lg text-white/90 border border-white/10">
                        {dash.mockup.pill2}
                      </span>
                    </div>

                    {/* Stats Grid inside Mockup */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                      {dash.mockup.stats.map((stat, sIdx) => (
                        <div key={sIdx} className="bg-white/10 rounded-xl p-2.5 text-center border border-white/10">
                          <span className="text-[10px] text-white/70 block uppercase font-mono">{stat.label}</span>
                          <span className="text-xs font-bold text-white mt-0.5 block truncate">{stat.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Content & Features */}
                <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    {/* Badge & Role Pill */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${dash.badgeColor}`}>
                        {dash.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        · {dash.roleTitle}
                      </span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                      {dash.title}
                    </h3>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
                      {dash.description}
                    </p>

                    {/* Feature Bullets */}
                    <ul className="space-y-2.5 mb-8">
                      {dash.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2.5 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 1-Click Launch Button */}
                  <button
                    onClick={() => handleLaunch(dash.viewKey, dash.title)}
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 px-6 rounded-2xl font-bold shadow-lg shadow-slate-900/10 hover:shadow-blue-600/30 transition-all duration-300 flex items-center justify-center gap-2 group/btn hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Launch {dash.roleTitle}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-blue-500/20">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>All 5 Portals Ready</span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight">Need to switch between portals while testing?</h3>
            <p className="text-blue-200 text-sm mt-1 font-medium">
              Use the top-bar Executive Dock inside the app to jump across all 5 roles seamlessly with zero re-login.
            </p>
          </div>
          <button
            onClick={() => handleLaunch('admin', 'HQ Command')}
            className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 rounded-2xl font-extrabold text-sm shadow-xl transition-all hover:scale-105 shrink-0 cursor-pointer"
          >
            Launch All Dashboards →
          </button>
        </div>

      </div>
    </section>
  );
};

export default Offers;

