import { useState } from 'react'
import { authService as auth } from '@/lib/authService'
import { Button, Input, PasswordInput, Label } from '@/components/ui/basic'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/basic'
import { 
    Lock, Mail, Loader2, AlertCircle, ArrowRight, ArrowLeft, 
    Building2, Stethoscope, ShieldAlert, Activity, User, 
    Zap, ChevronDown, ChevronUp, CheckCircle2, Shield
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'

export function LoginPage() {
    const [isForgotMode, setIsForgotMode] = useState(false)
    const [showManualLogin, setShowManualLogin] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loadingRole, setLoadingRole] = useState<string | null>(null)
    const [manualLoading, setManualLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    // 1-Click Direct Portal Access
    const handleDirectLogin = async (
        role: 'HOSPITAL_ADMIN' | 'DOCTOR' | 'CLINIC_ADMIN' | 'NURSE' | 'PATIENT',
        targetView: 'admin' | 'clinic-admin' | 'doctor-consultation' | 'emergency-triage' | 'patient-kiosk',
        label: string
    ) => {
        setLoadingRole(role)
        setError(null)
        try {
            localStorage.setItem('lastActiveView', targetView)
            await auth.signInDemo(role)
            toast({
                title: '⚡ Instant Portal Access Granted',
                description: `Authenticated as ${label}. Entering ${targetView.replace('-', ' ').toUpperCase()}...`,
                className: 'bg-emerald-50 border-emerald-200 text-emerald-900'
            })
            window.location.hash = '#/app'
        } catch (err: any) {
            setError(err.message || 'Direct login failed')
        } finally {
            setLoadingRole(null)
        }
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setManualLoading(true)
        setError(null)

        try {
            if (isForgotMode) {
                await auth.resetPassword(email)
                toast({
                    title: 'Recovery Link Sent',
                    description: 'Check your email for the password reset link.',
                    className: 'bg-green-50 border-green-200 text-green-900'
                })
                setIsForgotMode(false)
            } else {
                await auth.signIn(email, password)
                window.location.hash = '#/app'
            }
        } catch (err: any) {
            console.error("Auth Error:", err)
            setError(err.message || 'An unexpected error occurred')
            toast({
                title: 'Authentication Failed',
                description: err.message,
                variant: 'destructive',
            })
        } finally {
            setManualLoading(false)
        }
    }

    const PORTAL_PROFILES = [
        {
            id: 'hq-admin',
            role: 'HOSPITAL_ADMIN' as const,
            view: 'admin' as const,
            title: 'HQ Command Center',
            subtitle: 'Multi-Clinic Hospital Group',
            persona: 'Dr. Potla Sri Sharan • Medical Director',
            icon: Building2,
            badge: 'Headquarters • Project 1',
            accent: 'from-blue-600 to-indigo-700',
            border: 'border-blue-200 hover:border-blue-500 hover:shadow-blue-500/10',
            bgPill: 'bg-blue-50 text-blue-700 border-blue-200',
            highlights: ['Multi-Clinic Registry', 'Central Rebalancing', 'Cryptographic Audit Lock']
        },
        {
            id: 'clinic-hub',
            role: 'CLINIC_ADMIN' as const,
            view: 'clinic-admin' as const,
            title: 'Clinic Operations Hub',
            subtitle: 'Single Clinic Management & POS',
            persona: 'Rajesh Verma • Clinic Manager',
            icon: Activity,
            badge: 'Clinic Hub • Project 1',
            accent: 'from-sky-600 to-blue-700',
            border: 'border-sky-200 hover:border-sky-500 hover:shadow-sky-500/10',
            bgPill: 'bg-sky-50 text-sky-700 border-sky-200',
            highlights: ['Billing & Loose Tablets', 'Drift Radar FEFO', 'Staff Shift Rosters']
        },
        {
            id: 'doctor-opd',
            role: 'DOCTOR' as const,
            view: 'doctor-consultation' as const,
            title: 'Doctor OPD Cockpit',
            subtitle: 'Consultation & Decision Support',
            persona: 'Dr. A. Sen, MD • Senior Physician',
            icon: Stethoscope,
            badge: 'Doctor Portal • Project 2',
            accent: 'from-teal-600 to-emerald-700',
            border: 'border-teal-200 hover:border-teal-500 hover:shadow-teal-500/10',
            bgPill: 'bg-teal-50 text-teal-700 border-teal-200',
            highlights: ['AI SOAP Audio Citations', 'ICD-11 & NAMASTE', 'Jan Aushadhi 88% Savings']
        },
        {
            id: 'nurse-stat',
            role: 'NURSE' as const,
            view: 'emergency-triage' as const,
            title: 'Nurse STAT Triage',
            subtitle: 'Life-Critical ER Resuscitation',
            persona: 'Nurse Ananya Roy, RN • Trauma Lead',
            icon: ShieldAlert,
            badge: 'Nurse Portal • Project 2',
            accent: 'from-rose-600 to-red-700',
            border: 'border-rose-200 hover:border-rose-500 hover:shadow-rose-500/10',
            bgPill: 'bg-rose-50 text-rose-700 border-rose-200',
            highlights: ['<15ms Sentinel Guarantee', 'Casualty Bays 1-4', '1-Click Crash Cart Dispatch']
        },
        {
            id: 'patient-kiosk',
            role: 'PATIENT' as const,
            view: 'patient-kiosk' as const,
            title: 'Patient Self-Service Kiosk',
            subtitle: 'Multilingual Check-In & Token',
            persona: 'Ramesh Chandra • Patient Self-Service',
            icon: User,
            badge: 'Patient Portal • Project 2',
            accent: 'from-amber-600 to-orange-700',
            border: 'border-amber-200 hover:border-amber-500 hover:shadow-amber-500/10',
            bgPill: 'bg-amber-50 text-amber-700 border-amber-200',
            highlights: ['6 Indian Languages', '14-Digit ABHA Formatting', 'PM-JAY ₹5L Cashless Slip']
        }
    ]

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/80 p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
            {/* Background Atmosphere */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-100/70 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-100/60 rounded-full blur-[120px] pointer-events-none" />

            {/* Back to Landing */}
            <button
                type="button"
                onClick={() => window.location.hash = '#/'}
                className="absolute top-6 left-6 flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 bg-white/80 backdrop-blur px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all z-10"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Public Overview
            </button>

            <div className="w-full max-w-6xl mx-auto space-y-8 z-10 my-auto py-8">
                {/* Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <div className="flex justify-center mb-2">
                        <img
                            src="/assets/ayusetu_logo.png"
                            alt="AyuSetu Healthcare"
                            className="h-12 w-auto object-contain"
                        />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-full text-blue-800 text-xs font-black tracking-wide shadow-xs">
                        <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                        <span>ZERO PASSWORD REQUIREMENT • 1-CLICK INSTANT ENTRY</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        Select a Dashboard Profile to Enter
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                        Click any role below to bypass authentication and enter that dedicated healthcare cockpit directly with pre-populated operational state.
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive" className="max-w-xl mx-auto bg-red-50 border-red-200 text-red-800 shadow-sm">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* 5 DIRECT LOGIN PROFILE CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {PORTAL_PROFILES.map((portal) => {
                        const Icon = portal.icon
                        const isThisLoading = loadingRole === portal.role

                        return (
                            <div
                                key={portal.id}
                                onClick={() => !loadingRole && handleDirectLogin(portal.role, portal.view, portal.title)}
                                className={`relative group bg-white/95 backdrop-blur-md rounded-2xl border ${portal.border} p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-[0.99]`}
                            >
                                <div className="space-y-4">
                                    {/* Card Header & Icon */}
                                    <div className="flex items-start justify-between">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${portal.accent} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${portal.bgPill}`}>
                                            {portal.badge}
                                        </span>
                                    </div>

                                    {/* Titles */}
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                                            {portal.title}
                                        </h3>
                                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                            {portal.subtitle}
                                        </p>
                                        <div className="mt-2.5 py-1.5 px-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                            <span className="truncate">{portal.persona}</span>
                                        </div>
                                    </div>

                                    {/* Key Capabilities */}
                                    <div className="space-y-1.5 pt-1">
                                        {portal.highlights.map((h, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                <span>{h}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        disabled={!!loadingRole}
                                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm ${
                                            isThisLoading
                                                ? 'bg-slate-100 text-slate-400'
                                                : `bg-gradient-to-r ${portal.accent} text-white group-hover:opacity-95 group-hover:shadow-md`
                                        }`}
                                    >
                                        {isThisLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                                                <span>Connecting Portal...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Launch {portal.title}</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )
                    })}

                    {/* 6th Card: Super Admin / CA Finance Suite Quick Access */}
                    <div
                        onClick={() => !loadingRole && handleDirectLogin('SUPER_ADMIN' as any, 'admin', 'Super Admin Command')}
                        className="relative group bg-white/95 backdrop-blur-md rounded-2xl border border-indigo-200 hover:border-indigo-500 p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer active:scale-[0.99]"
                    >
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-700 to-purple-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border bg-purple-50 text-purple-700 border-purple-200">
                                    Finance & CA Suite
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                                    CA Financial & Audit Suite
                                </h3>
                                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                    Platform Finance & Tax Compliance
                                </p>
                                <div className="mt-2.5 py-1.5 px-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-700 flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                    <span className="truncate">Chief Medical Registrar • Group CA</span>
                                </div>
                            </div>
                            <div className="space-y-1.5 pt-1">
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>P&L, Balance Sheet, Ledger Locks</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>Bank Reconciliation (BRS)</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>Multi-Hospital SaaS Superadmin</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                disabled={!!loadingRole}
                                className="w-full py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm bg-gradient-to-r from-indigo-700 to-purple-800 text-white group-hover:opacity-95"
                            >
                                <span>Launch Finance & Super Admin</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* MANUAL LOGIN COLLAPSIBLE SECTION */}
                <div className="max-w-md mx-auto pt-4">
                    <button
                        type="button"
                        onClick={() => setShowManualLogin(!showManualLogin)}
                        className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors py-2 bg-white/70 hover:bg-white rounded-xl border border-slate-200/80 shadow-xs"
                    >
                        <span>Need traditional email & password sign-in?</span>
                        {showManualLogin ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showManualLogin && (
                        <Card className="mt-4 bg-white shadow-xl border-slate-200/80 animate-in fade-in slide-in-from-top-4 duration-300">
                            <CardHeader className="pt-6 pb-2 text-center">
                                <CardTitle className="text-lg font-bold text-slate-900">
                                    {isForgotMode ? 'Reset Password' : 'Staff Credential Login'}
                                </CardTitle>
                                <CardDescription className="text-xs text-slate-500">
                                    {isForgotMode ? 'Enter registered email for recovery' : 'Enter credentials for authorized account'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-6">
                                <form onSubmit={handleAuth} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="email" className="text-xs">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="doctor@hospital.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-9 h-10 text-sm bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {!isForgotMode && (
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password" className="text-xs">Password</Label>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsForgotMode(true)}
                                                    className="text-xs text-blue-600 hover:underline font-medium"
                                                >
                                                    Forgot?
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <PasswordInput
                                                    id="password"
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="pl-9 h-10 text-sm bg-slate-50/50 border-slate-200 focus:bg-white rounded-xl"
                                                    required
                                                    minLength={6}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full h-11 bg-slate-900 hover:bg-black text-white font-bold text-sm shadow-md rounded-xl transition-all"
                                        disabled={manualLoading}
                                    >
                                        {manualLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {isForgotMode ? 'Sending Link...' : 'Verifying Credentials...'}
                                            </>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                {isForgotMode ? 'Send Recovery Link' : 'Sign In with Credentials'}
                                                <ArrowRight className="w-4 h-4" />
                                            </span>
                                        )}
                                    </Button>

                                    {isForgotMode && (
                                        <button
                                            type="button"
                                            onClick={() => setIsForgotMode(false)}
                                            className="w-full text-xs text-center text-slate-500 hover:text-slate-800 font-semibold pt-1"
                                        >
                                            Back to Sign In
                                        </button>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

