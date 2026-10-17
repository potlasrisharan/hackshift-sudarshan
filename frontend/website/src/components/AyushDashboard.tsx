import { useState } from 'react';
import { 
  Users, Printer, CheckCircle2, 
  Sparkles, Leaf, Pill 
} from 'lucide-react';

export interface AyushPatient {
  id: string;
  token: string;
  name: string;
  age: number;
  gender: string;
  prakriti: {
    vata: number;
    pitta: number;
    kapha: number;
    dominant: string;
  };
  dashavidha: {
    dushya: string;
    desha: string;
    bala: string;
    kala: string;
    anala: string;
    prakritiDesc: string;
    vaya: string;
    sattva: string;
    satmya: string;
    ahara: string;
  };
  namasteCode: string;
  icd11Tm2: string;
  classicalFormulations: Array<{
    name: string;
    dosage: string;
    anupana: string;
    duration: string;
  }>;
}

const INITIAL_AYUSH_QUEUE: AyushPatient[] = [
  {
    id: 'ay-201',
    token: 'TOKEN #041',
    name: 'Ananya Deshmukh',
    age: 38,
    gender: 'FEMALE',
    prakriti: { vata: 65, pitta: 45, kapha: 20, dominant: 'Vata-Pitta' },
    dashavidha: {
      dushya: 'Asthi & Majja Dhatu, Snayu',
      desha: 'Sadharana Desha (Temperate)',
      bala: 'Madhyama Bala (Moderate Vitality)',
      kala: 'Varsha Ritu (Vata Aggravating)',
      anala: 'Vishamagni (Irregular Digestive Fire)',
      prakritiDesc: 'Krusha (Slender physique), rapid speech, dry skin',
      vaya: 'Madhyama Vaya (38 Years)',
      sattva: 'Madhyama Sattva (Moderate mental resilience)',
      satmya: 'Katu & Tikta Satmya',
      ahara: 'Madhyama Abhyavaharana Shakti'
    },
    namasteCode: 'AY-SAN-03 (Sandhigata Vata)',
    icd11Tm2: 'SF02 (Traditional Medicine Osteoarthritis / Vata Vyadhi)',
    classicalFormulations: [
      { name: 'Yograj Guggulu', dosage: '500mg (2 tabs)', anupana: 'Warm Water / Rasnadi Kwath', duration: '30 Days' },
      { name: 'Shallaki Tablet (Boswellia 400mg)', dosage: '1 tab BD', anupana: 'Milk after food', duration: '30 Days' },
      { name: 'Mahanarayana Taila', dosage: 'Local Application', anupana: 'External Abhyanga & Hot Fomentation', duration: '15 Days' }
    ]
  },
  {
    id: 'ay-202',
    token: 'TOKEN #045',
    name: 'Balwinder Singh',
    age: 50,
    gender: 'MALE',
    prakriti: { vata: 25, pitta: 70, kapha: 35, dominant: 'Pitta Dominant' },
    dashavidha: {
      dushya: 'Rakta Dhatu & Mamsa Dhatu',
      desha: 'Jangala Desha (Dry, arid)',
      bala: 'Pravara Bala (High Physical Strength)',
      kala: 'Greeshma / Sharad',
      anala: 'Tikshnagni (Intense / Acidic Agni)',
      prakritiDesc: 'Raktavarna Mukha, hot intolerance, sour eructations',
      vaya: 'Madhyama Vaya (50 Years)',
      sattva: 'Pravara Sattva',
      satmya: 'Madhura & Sheeta Satmya',
      ahara: 'Teekshna Kshudha (Excess hunger)'
    },
    namasteCode: 'AY-AML-01 (Amlapitta)',
    icd11Tm2: 'SG14 (Hyperacidity / Pittaja Grahani Disorder)',
    classicalFormulations: [
      { name: 'Avipattikar Churna', dosage: '3 grams', anupana: 'Warm water before meals', duration: '21 Days' },
      { name: 'Kamadudha Rasa (Moti Yukta)', dosage: '125mg (1 tab)', anupana: 'Cow Milk / Ghee', duration: '15 Days' },
      { name: 'Sutshekhar Rasa', dosage: '1 tab BD', anupana: 'Honey / Water after meals', duration: '14 Days' }
    ]
  }
];

interface AyushDashboardProps {
  onSendToPos?: (items: any[], patientInfo: any) => void;
}

export function AyushDashboard({ onSendToPos }: AyushDashboardProps) {
  const [queue] = useState<AyushPatient[]>(INITIAL_AYUSH_QUEUE);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_AYUSH_QUEUE[0].id);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const activePatient = queue.find(p => p.id === selectedId) || queue[0];

  const handleApproveFormulations = () => {
    setSuccessMsg(`🌿 Ayurvedic Case Sheet Approved! Pushed to ABDM M2 Gateway & AYUSETU POS!`);
    setTimeout(() => setSuccessMsg(null), 4000);

    if (onSendToPos) {
      onSendToPos(
        activePatient.classicalFormulations.map(f => ({
          drug: f.name,
          dosage: f.dosage,
          frequency: f.anupana,
          duration: f.duration,
          availableInClinic: true
        })),
        {
          name: activePatient.name,
          patientId: activePatient.id,
          token: activePatient.token
        }
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {successMsg && (
        <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{successMsg}</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">
            NRCeS_FHIR_M2_CARE_CONTEXT_LINKED
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-2xl shadow-sm">
            🌿
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                AYUSH Clinical Case-Taking & Dashavidha Pariksha Center
              </h1>
              <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Ministry of Ayush • AIIA Standard
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              10-Fold Ayurvedic Examination • Tridosha Scoring • WHO ICD-11 TM-2 & NAMASTE Dual Coding
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-900">{queue.length} AYUSH OPD Waiting</span>
          </div>
          <button 
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Case Sheet</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>AYUSH OPD Queue</span>
              </h2>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Real-Time Sync
              </span>
            </div>

            <div className="space-y-2.5">
              {queue.map(p => {
                const isSelected = p.id === activePatient.id;

                return (
                  <div 
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`p-3.5 rounded-xl border-2 transition cursor-pointer ${
                      isSelected 
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-slate-800">{p.token}</span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                        {p.prakriti.dominant}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900">{p.name}</h3>
                      <span className="text-xs text-slate-500">{p.age}Y • {p.gender}</span>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-600 font-medium">
                      Diagnosis: {p.namasteCode}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Dashavidha & Formulation Pad (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
            
            {/* Patient Header */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900">{activePatient.name}</h2>
                  <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full">
                    {activePatient.token}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
                    {activePatient.age} Yrs • {activePatient.gender}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Dual Coded: {activePatient.namasteCode} • WHO ICD-11 {activePatient.icd11Tm2}
                </p>
              </div>

              <button
                onClick={handleApproveFormulations}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Approve & Push to POS</span>
              </button>
            </div>

            {/* Tridosha Radar Metrics */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-black uppercase text-emerald-900 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Tridosha Prakriti Analysis</span>
              </h3>
              
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="bg-white p-3 rounded-lg border border-emerald-200 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Vata Dosha</span>
                  <span className="text-base font-black text-blue-700">{activePatient.prakriti.vata}%</span>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${activePatient.prakriti.vata}%` }}></div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-emerald-200 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Pitta Dosha</span>
                  <span className="text-base font-black text-amber-700">{activePatient.prakriti.pitta}%</span>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: `${activePatient.prakriti.pitta}%` }}></div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-emerald-200 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Kapha Dosha</span>
                  <span className="text-base font-black text-emerald-700">{activePatient.prakriti.kapha}%</span>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${activePatient.prakriti.kapha}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashavidha Pariksha 10-Fold Parameters */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Dashavidha Pariksha (10-Fold Clinical Clinical Diagnostic Suite)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">1. Dushya (Affected Tissue / Dhatu)</span>
                  <p className="font-semibold text-slate-800">{activePatient.dashavidha.dushya}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">2. Desha (Geographic Habitat)</span>
                  <p className="font-semibold text-slate-800">{activePatient.dashavidha.desha}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">3. Bala (Physical & Immunity Strength)</span>
                  <p className="font-semibold text-slate-800">{activePatient.dashavidha.bala}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">4. Anala (Agni / Digestive Fire Status)</span>
                  <p className="font-semibold text-slate-800">{activePatient.dashavidha.anala}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">5. Sattva (Psychological Resilience)</span>
                  <p className="font-semibold text-slate-800">{activePatient.dashavidha.sattva}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">6. Satmya (Habituation & Diet Compatibilities)</span>
                  <p className="font-semibold text-slate-800">{activePatient.dashavidha.satmya}</p>
                </div>
              </div>
            </div>

            {/* Formulations */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-emerald-600" />
                <span>Classical Ayurvedic Formulations (Rx)</span>
              </h3>

              <div className="space-y-2">
                {activePatient.classicalFormulations.map((f, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{f.name}</span>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Dose: <strong className="text-slate-700">{f.dosage}</strong> • Anupana: <strong className="text-slate-700">{f.anupana}</strong>
                      </div>
                    </div>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">
                      {f.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
