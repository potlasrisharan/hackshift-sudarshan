import { confirmCbcNavigation } from "./features/cbc/navigation";
import { useState, useEffect, lazy, Suspense, Component, type ErrorInfo, type ReactNode } from 'react'

function lazyWithRetry<T extends React.ComponentType<any>>(
    factory: () => Promise<{ default: T } | any>
) {
    return lazy(async () => {
        const pageHasBeenForceRefreshed = sessionStorage.getItem('dhaaga_chunk_retry_active');
        try {
            const module = await factory();
            sessionStorage.removeItem('dhaaga_chunk_retry_active');
            return 'default' in module ? module : { default: module };
        } catch (error: any) {
            console.warn('Vite dynamic chunk load error:', error);
            if (!pageHasBeenForceRefreshed) {
                sessionStorage.setItem('dhaaga_chunk_retry_active', 'true');
                window.location.reload();
                return new Promise<{ default: T }>(() => {});
            }
            sessionStorage.removeItem('dhaaga_chunk_retry_active');
            throw error;
        }
    });
}

const StaffPortal = lazyWithRetry(() => import("@/components/StaffPortal").then(module => ({ default: module.StaffPortal })));
const ProcurementDashboard = lazyWithRetry(() => import("@/components/ProcurementDashboard"));
const MedicineMigration = lazyWithRetry(() => import("@/components/MedicineMigration").then(module => ({ default: module.MedicineMigration })));
const SuperAdminDashboard = lazyWithRetry(() => import("@/components/SuperAdminDashboard").then(module => ({ default: module.SuperAdminDashboard })));
const HospitalDashboard = lazyWithRetry(() => import("@/components/HospitalDashboard").then(module => ({ default: module.HospitalDashboard })));
const ClinicAdminDashboard = lazyWithRetry(() => import("@/components/ClinicAdminDashboard").then(module => ({ default: module.ClinicAdminDashboard })));
import { AppLayout } from "@/components/layout/AppLayout";
import { WebsiteLanguageSelect, WebsiteLocalizationRuntime } from "@/components/WebsiteLanguageSelect";
const InventoryDashboard = lazyWithRetry(() => import("@/components/InventoryDashboard").then(module => ({ default: module.InventoryDashboard })));
const AdminSetup = lazyWithRetry(() => import("@/components/AdminSetup").then(module => ({ default: module.AdminSetup })));
import { HospitalProvider, useHospital } from '@/context/HospitalContext';
import { TourProvider } from '@/context/TourContext';
import { ProductTour } from '@/components/ProductTour';
import { ResetPasswordPage } from "@/components/ResetPasswordPage";
const HospitalsRegistry = lazyWithRetry(() => import("@/components/HospitalsRegistry").then(module => ({ default: module.HospitalsRegistry })));
const ExpensesDashboard = lazyWithRetry(() => import("./components/ExpensesDashboard").then(module => ({ default: module.ExpensesDashboard })));
const EquipmentsDashboard = lazyWithRetry(() => import("./components/EquipmentsDashboard").then(module => ({ default: module.EquipmentsDashboard })));
const HospitalDetails = lazyWithRetry(() => import("@/components/HospitalDetails").then(module => ({ default: module.HospitalDetails })));
const AuditLogs = lazyWithRetry(() => import("@/components/AuditLogs").then(module => ({ default: module.AuditLogs })));
const POSDashboard = lazyWithRetry(() => import("@/components/POSDashboard").then(module => ({ default: module.POSDashboard })));
const ClinicAttendance = lazyWithRetry(() => import("@/components/ClinicAttendance").then(module => ({ default: module.ClinicAttendance })));
const ShiftManagement = lazyWithRetry(() => import("@/components/ShiftManagement").then(module => ({ default: module.ShiftManagement })));
const HospitalShiftManagement = lazyWithRetry(() => import("@/components/HospitalShiftManagement").then(module => ({ default: module.HospitalShiftManagement })));
const EarningsDashboard = lazyWithRetry(() => import("@/components/EarningsDashboard").then(module => ({ default: module.EarningsDashboard })));
const SettingsDashboard = lazyWithRetry(() => import("@/components/SettingsDashboard").then(module => ({ default: module.SettingsDashboard })));
const CAFinancialSuite = lazyWithRetry(() => import("@/components/CAFinancialSuite").then(module => ({ default: module.CAFinancialSuite })));
const IPDDashboard = lazyWithRetry(() => import("@/components/IPDDashboard").then(module => ({ default: module.IPDDashboard })));
const DoctorConsultation = lazyWithRetry(() => import("@/components/DoctorConsultation").then(module => ({ default: module.DoctorConsultation })));
const EmergencyTriage = lazyWithRetry(() => import("@/components/EmergencyTriage").then(module => ({ default: module.EmergencyTriage })));
const AyushDashboard = lazyWithRetry(() => import("@/components/AyushDashboard").then(module => ({ default: module.AyushDashboard })));
const PatientKiosk = lazyWithRetry(() => import("@/components/PatientKiosk").then(module => ({ default: module.PatientKiosk })));
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import { BillingOverview, SubscriptionDashboard } from '@/components/billing';
const AboutPage = lazyWithRetry(() => import("@/pages/AboutPage"));
const NewsPage = lazyWithRetry(() => import("@/pages/NewsPage"));
const ContactPage = lazyWithRetry(() => import("@/pages/ContactPage"));
const ClinicOperationsPage = lazyWithRetry(() => import("@/pages/ClinicOperationsPage"));
const HospitalCommandCenterPage = lazyWithRetry(() => import("@/pages/HospitalCommandCenterPage"));
const PrivacyPage = lazyWithRetry(() => import("@/pages/PrivacyPage"));
const CareersPage = lazyWithRetry(() => import("@/pages/CareersPage"));
const SupportPage = lazyWithRetry(() => import("@/pages/SupportPage"));
import { useLocation } from 'react-router-dom';
import { logPageView } from '@/lib/analytics';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from '@/lib/transitions';

import { Shield, RefreshCw, AlertTriangle } from 'lucide-react'
import { Button, WorkspaceSkeleton, DashboardSkeleton } from '@/components/ui/basic'
import { Toaster } from '@/components/ui/toaster'
import { authService } from '@/lib/authService'
import { dataService } from '@/lib/dataService'

// View types
type View = 'selection' | 'staff' | 'admin' | 'inventory-dashboard' | 'setup' | 'hospitals' | 'audit_logs' | 'pos' | 'attendance' | 'earnings' | 'settings' | 'billing' | 'shift-management' | 'procurement' | 'medicine-migration' | 'expenses' | 'equipments' | 'ca-suite' | 'ipd' | 'doctor-consultation' | 'emergency-triage' | 'ayush-center' | 'patient-kiosk' | 'clinic-admin'

type SeoConfig = {
    title: string
    description: string
    path: string
    robots: 'index, follow' | 'noindex, nofollow'
}

const SEO_BASE_URL = 'https://www.ayusetu.in'
const DEFAULT_SEO: SeoConfig = {
    title: 'AYUSETU | Hospital Business Operations & Inventory',
    description: 'A complete hospital management system focused on core business operations. Seamlessly manage clinic inventory, OPD billing, consultation fees, staff, and CA balance sheets.',
    path: '/',
    robots: 'index, follow'
}

const SEO_ROUTES: Record<string, SeoConfig> = {
    '/': DEFAULT_SEO,
    '/about': {
        title: 'About AYUSETU | Hospital Operations Platform',
        description: 'Learn how AYUSETU helps hospitals and clinics run smoother operations across billing, inventory, staff workflows, and financial oversight.',
        path: '/about',
        robots: 'index, follow'
    },
    '/news': {
        title: 'AYUSETU News | Hospital Business Insights',
        description: 'Explore updates, announcements, and practical insights on hospital business operations, inventory control, and clinic financial workflows.',
        path: '/news',
        robots: 'index, follow'
    },
    '/contact': {
        title: 'Contact AYUSETU | Hospital Management Support',
        description: 'Connect with AYUSETU to discuss hospital operations, clinic inventory, OPD billing, staff workflows, and CA-ready reporting needs.',
        path: '/contact',
        robots: 'index, follow'
    },
    '/clinic-operations': {
        title: 'Clinic Operations Management | AYUSETU',
        description: 'Streamline day-to-day clinic operations with centralized workflows for OPD billing, inventory, consultation fees, and staff coordination.',
        path: '/clinic-operations',
        robots: 'index, follow'
    },
    '/hospital-command-center': {
        title: 'Hospital Command Center | AYUSETU',
        description: 'Get a unified command center for hospital business performance, from operations tracking and billing to inventory and staff management.',
        path: '/hospital-command-center',
        robots: 'index, follow'
    },
    '/privacy': {
        title: 'Privacy Policy | AYUSETU',
        description: 'Read AYUSETU privacy practices for handling data across hospital and clinic operations, billing, and business management workflows.',
        path: '/privacy',
        robots: 'index, follow'
    },
    '/careers': {
        title: 'Careers at AYUSETU | Build Healthcare Ops Tech',
        description: 'Join AYUSETU and help build technology that improves hospital business operations, inventory systems, billing, and financial reporting.',
        path: '/careers',
        robots: 'index, follow'
    },
    '/support': {
        title: 'Support | AYUSETU Hospital Management System',
        description: 'Access support for AYUSETU features spanning inventory, OPD billing, consultation fees, staff workflows, and CA balance-sheet readiness.',
        path: '/support',
        robots: 'index, follow'
    },
    '/login': {
        title: 'Login | AYUSETU',
        description: DEFAULT_SEO.description,
        path: '/login',
        robots: 'noindex, nofollow'
    },
    '/register': {
        title: 'Register | AYUSETU',
        description: DEFAULT_SEO.description,
        path: '/register',
        robots: 'noindex, nofollow'
    }
}

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full h-full"
    >
        {children}
    </motion.div>
);

function AppContent() {
    const { session, profile, loading, clinics } = useHospital();
    const isHospitalAdmin = profile?.role === 'HOSPITAL_ADMIN' || profile?.role === 'ADMIN';
    const location = useLocation();

    // Check query parameter e.g. /app?view=doctor-consultation
    const queryParams = new URLSearchParams(location.search);
    const viewParam = queryParams.get('view') as View | null;

    const [view, setView] = useState<View>(() => {
        if (viewParam) return viewParam;
        const savedView = localStorage.getItem('lastActiveView') as View
        return savedView || 'admin'
    });

    // 3-Tier State: Hospital Admin 'Drill Down' Clinic ID
    const [selectedClinicId, setSelectedClinicId] = useState<string | null>(() => {
        if (viewParam === 'clinic-admin' && clinics.length > 0) {
            return clinics[0].id;
        }
        return null;
    });

    // Sync query parameter when changed
    useEffect(() => {
        if (viewParam && viewParam !== view) {
            setView(viewParam);
            if (viewParam === 'admin') {
                setSelectedClinicId(null);
            } else if (viewParam === 'clinic-admin' && clinics.length > 0) {
                setSelectedClinicId(clinics[0].id);
            }
        }
    }, [viewParam, clinics]);

    useEffect(() => {
        if (view) {
            localStorage.setItem('lastActiveView', view)
        }
    }, [view])

    useEffect(() => {
        if (!loading && profile) {
            // Router logic processing
            // Each role has a set of valid views (matching their sidebar menu).
            // Only redirect to the default if the current view is NOT in their allowed set.
            // This prevents losing the user's position when the component remounts
            // (e.g. tab switch, minimize, auth state re-trigger).

            const clinicalViews: View[] = ['doctor-consultation', 'emergency-triage', 'ayush-center', 'patient-kiosk', 'clinic-admin'];

            // 1. CRITICAL: Clinic Admin Bypass (Gatekeeper Fix)
            // Allow entry even if clinic_id is null (The Dashboard will handle the "No Clinic" state)
            if (profile.role === 'CLINIC_ADMIN') {
                const clinicAdminViews: View[] = ['admin', 'pos', 'staff', 'attendance', 'shift-management', 'inventory-dashboard', 'ipd', 'settings', ...clinicalViews];
                if (!clinicAdminViews.includes(view)) {
                    setView('admin');
                }
                return;
            }

            // 1b. CRITICAL: Clinic Staff & Clinic-Linked Doctors Bypass
            if ((profile.role === 'CLINIC_STAFF' || profile.role === 'DOCTOR') && profile.clinic_id && !profile.hospital_id) {
                const clinicStaffViews: View[] = ['pos', 'staff', 'inventory-dashboard', 'ipd', ...clinicalViews];
                if (!clinicStaffViews.includes(view)) {
                    setView('pos');
                }
                return;
            }

            // 1c. Hospital-Linked Doctors
            if (profile.role === 'DOCTOR' && profile.hospital_id) {
                const doctorViews: View[] = ['admin', 'ipd', 'pos', 'inventory-dashboard', ...clinicalViews];
                if (!doctorViews.includes(view)) {
                    setView('admin');
                }
                return;
            }

            // 2. Setup Redirect for Orphaned Hospital Admins ONLY
            if ((profile.role === 'ADMIN' || profile.role === 'HOSPITAL_ADMIN') && !profile.hospital_id) {
                if (view !== 'setup') setView('setup');
            }

            // 2b. Hospital Admin — allow all their sidebar views
            else if (['ADMIN', 'HOSPITAL_ADMIN'].includes(profile.role)) {
                const hospitalAdminViews: View[] = ['admin', 'inventory-dashboard', 'staff', 'shift-management', 'earnings', 'billing', 'procurement', 'expenses', 'equipments', 'ipd', 'ca-suite', 'settings', 'setup', 'pos', 'attendance', 'medicine-migration', ...clinicalViews];
                
                // Force 'admin' if starting (selection) OR in POS without a clinic context
                if (view === 'selection' || (view === 'pos' && !selectedClinicId)) {
                    setView('admin');
                } else if (!hospitalAdminViews.includes(view)) {
                    setView('admin');
                }
            }

            // 2c. Super Admin — allow all their sidebar views
            else if (['SUPER_ADMIN', 'OWNER'].includes(profile.role)) {
                const superAdminViews: View[] = ['admin', 'hospitals', 'audit_logs', 'billing', 'settings', ...clinicalViews];
                if (!superAdminViews.includes(view)) {
                    setView('admin');
                }
            }

            // 3. Default Routing (Only if view is generic 'selection' or 'setup' but shouldn't be)
            else if (view === 'selection' || (view === 'setup' && profile.hospital_id)) {
                if (['ADMIN', 'SUPER_ADMIN', 'HOSPITAL_ADMIN', 'CLINIC_ADMIN'].includes(profile.role)) {
                    setView('admin');
                } else if (profile.role === 'CLINIC_STAFF' || (profile.role === 'DOCTOR' && profile.clinic_id)) {
                    setView('pos');
                } else if (profile.role === 'DOCTOR' && profile.hospital_id) {
                    setView('admin');
                }
            }
        } else if (!loading && !session) {
            setView('selection');
        }
    }, [loading, profile, session]); // Removed 'view' dependency to prevent redirect loops.

    // Used for Super Admin "Hospital X-Ray"
    const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);

    const navigateToHospital = (id: string) => {
        setSelectedHospitalId(id)
        setView('hospitals')
    }

    const handleBackFromDetails = () => {
        setSelectedHospitalId(null);
    };

    const guardedSetView = (nextView: View) => {
        if (nextView !== view && !confirmCbcNavigation()) return;
        setView(nextView);
    };

    const handleLogout = async () => {
        if (!confirmCbcNavigation()) return;
        try {
            await authService.signOut();
        } catch (err) {
            console.warn('Sign out error:', err);
        } finally {
            // Clear all session-related localStorage
            localStorage.removeItem('lastActiveView');
            // Remove auth tokens from localStorage
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth')) {
                    localStorage.removeItem(key);
                }
            });
            // Hard redirect to fully reset app state (avoids stale React state)
            window.location.href = window.location.origin + window.location.pathname + '#/login';
        }
    }

    // Auth checks are now handled by AppRouter, so we don't need them here.
    return (
        <AppLayout
            onLogout={handleLogout}
            view={view}
            setView={guardedSetView}
            lockNavigation={view === 'setup'}
            selectedClinicId={selectedClinicId}
            onSelectClinicId={setSelectedClinicId}
        >
            <Suspense fallback={<DashboardSkeleton />}>
                <AnimatePresence mode="wait">
                    <PageWrapper key={view}>
                    {/* ERROR STATE: Locked out if no Role */}
                    {view === 'selection' && !loading && profile && !['ADMIN', 'CLINIC_STAFF', 'SUPER_ADMIN', 'HOSPITAL_ADMIN', 'CLINIC_ADMIN', 'DOCTOR'].includes(profile?.role || '') && (
                        <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                            <Shield className="w-20 h-20 text-slate-200 mb-6" />
                            <h1 className="text-3xl font-bold text-slate-900">Access Restricted</h1>
                            <p className="text-slate-500 max-w-md mt-2">
                                Your account ({profile.email}) is active but has no assigned role.
                                <br />Current Role: <code className="bg-slate-100 px-2 py-1 rounded text-sm">{profile.role || 'NULL'}</code>
                            </p>
                        </div>
                    )}

                    {/* STAFF PORTAL VIEW (HR) */}
                    {view === 'staff' && (
                        <StaffPortal />
                    )}

                    {/* EARNINGS DASHBOARD (HR/ADMINS) */}
                    {view === 'earnings' && (
                        <EarningsDashboard />
                    )}

                    {/* POS/BILLING DASHBOARD */}
                    {view === 'pos' && (
                        <POSDashboard currentClinicId={selectedClinicId || undefined} onNavigate={setView} />
                    )}

                    {/* PROCUREMENT DASHBOARD */}
                    {view === 'procurement' && (['HOSPITAL_ADMIN', 'ADMIN', 'SUPER_ADMIN', 'OWNER'].includes(profile?.role || '')) && (
                        <ProcurementDashboard />
                    )}


                    {/* ATTENDANCE DASHBOARD */}
                    {view === 'attendance' && selectedClinicId && (
                        <ClinicAttendance clinicId={selectedClinicId} onNavigate={(v: string) => setView(v as View)} />
                    )}
                    {view === 'attendance' && profile?.role === 'CLINIC_ADMIN' && profile.clinic_id && (
                        <ClinicAttendance clinicId={profile.clinic_id} onNavigate={(v: string) => setView(v as View)} />
                    )}

                    {/* SHIFT MANAGEMENT */}
                    {view === 'shift-management' && (
                        (['HOSPITAL_ADMIN', 'ADMIN'].includes(profile?.role || '')) ? (
                            <HospitalShiftManagement />
                        ) : (
                            profile?.clinic_id ? (
                                <ShiftManagement clinicId={profile.clinic_id} />
                            ) : (
                                <div className="p-12 text-center text-slate-500">No Clinic Selected</div>
                            )
                        )
                    )}

                    {/* DASHBOARD ROUTER (3-TIER LOGIC) */}
                    {view === 'admin' && (
                        <>
                            {/* TIER 1: SUPER ADMIN */}
                            {(['SUPER_ADMIN', 'OWNER'].includes(profile?.role || '')) && (
                                <SuperAdminDashboard onView={navigateToHospital} />
                            )}

                            {/* TIER 2: HOSPITAL ADMIN */}
                            {(['HOSPITAL_ADMIN', 'ADMIN'].includes(profile?.role || '')) && (
                                selectedClinicId ? (
                                    // Showing Clinic View (Drill Down)
                                    <ClinicAdminDashboard clinicId={selectedClinicId} onBack={() => setSelectedClinicId(null)} onNavigate={setView} />
                                ) : (
                                    // Showing Hospital HQ
                                    <HospitalDashboard onSelectClinic={setSelectedClinicId} />
                                )
                            )}

                            {/* TIER 3: CLINIC ADMIN */}
                            {(profile?.role === 'CLINIC_ADMIN') && (
                                profile.clinic_id ? (
                                    <ClinicAdminDashboard clinicId={profile.clinic_id} onNavigate={setView} />
                                ) : (
                                    <div className="p-12 text-center text-slate-500">
                                        <h2 className="text-xl font-bold text-slate-800">No Clinic Assigned</h2>
                                        <p className="mb-4">Please contact your Hospital Administrator.</p>

                                        <Button
                                            variant="outline"
                                            className="border-slate-300 text-slate-600 hover:text-blue-600 hover:border-blue-300"
                                            onClick={async () => {
                                                // 1. Search Staff Details
                                                const results = await dataService.list('staff_details', { filters: [{ field: 'user_id', operator: '==', value: profile.id }] });
                                                const staffRec = results[0];

                                                if (staffRec?.clinic_id) {
                                                    await dataService.update('profiles', profile.id, { clinic_id: staffRec.clinic_id });
                                                    window.location.reload();
                                                    return;
                                                }

                                                alert("Could not automatically find your clinic linkage. Please report this to support.");
                                            }}
                                        >
                                            Check for Linked Clinic (Auto-Fix)
                                        </Button>
                                    </div>
                                )
                            )}
                            {/* TIER 4: DOCTOR (Hospital Context) */}
                            {(profile?.role === 'DOCTOR') && profile.hospital_id && (
                                <HospitalDashboard onSelectClinic={setSelectedClinicId} />
                            )}
                        </>
                    )}

                    {/* SETUP VIEW (Onboarding) */}
                    {view === 'setup' && (
                        <AdminSetup userProfile={profile} onComplete={() => window.location.reload()} />
                    )}

                    {/* Inventory Dashboard */}
                    {view === 'inventory-dashboard' && (
                        <InventoryDashboard onNavigate={setView} />
                    )}

                    {/* HOSPITALS REGISTRY & DETAILS */}
                    {view === 'hospitals' && (
                        selectedHospitalId ? (
                            // X-RAY VIEW
                            <HospitalDetails
                                hospitalId={selectedHospitalId}
                                onBack={handleBackFromDetails}
                            />
                        ) : (
                            // REGISTRY VIEW
                            <HospitalsRegistry onView={navigateToHospital} />
                        )
                    )}

                    {view === 'audit_logs' && (
                        <AuditLogs />
                    )}

                {view === 'medicine-migration' && isHospitalAdmin && (
                    <MedicineMigration onBack={() => setView('inventory-dashboard')} />
                )}

                    {view === 'billing' && (
                        <div className="max-w-4xl mx-auto">
                            {['SUPER_ADMIN', 'OWNER'].includes(profile?.role || '') ? (
                                <BillingOverview />
                            ) : (
                                <SubscriptionDashboard />
                            )}
                        </div>
                    )}

                    {view === 'expenses' && (
                        <ExpensesDashboard />
                    )}

                    {view === 'equipments' && (
                        <EquipmentsDashboard />
                    )}

                    {view === 'ca-suite' && (
                        <CAFinancialSuite />
                    )}

                    {view === 'clinic-admin' && (
                        <ClinicAdminDashboard 
                            clinicId={selectedClinicId || profile?.clinic_id || clinics[0]?.id || 'clinic-main'} 
                            onBack={() => {
                                setSelectedClinicId(null);
                                setView('admin');
                            }} 
                            onNavigate={setView} 
                        />
                    )}

                    {view === 'ipd' && (
                        <IPDDashboard />
                    )}

                    {view === 'doctor-consultation' && (
                        <DoctorConsultation 
                            onSendToPos={() => guardedSetView('pos')}
                            onAdmitToIpd={() => guardedSetView('ipd')}
                        />
                    )}

                    {view === 'emergency-triage' && (
                        <EmergencyTriage 
                            onAdmitToIpd={() => guardedSetView('ipd')}
                        />
                    )}

                    {view === 'ayush-center' && (
                        <AyushDashboard 
                            onSendToPos={() => guardedSetView('pos')}
                        />
                    )}

                    {view === 'patient-kiosk' && (
                        <PatientKiosk 
                            onNavigate={(targetView: any) => setView(targetView)}
                        />
                    )}

                    {view === 'settings' && (
                        <SettingsDashboard />
                    )}
                </PageWrapper>
            </AnimatePresence>
            </Suspense>

            <Toaster />
        </AppLayout>

    )
}

function AnalyticsTracker() {
    const location = useLocation();

    useEffect(() => {
        // Correctly handle HashRouter paths
        const path = location.pathname + location.search + location.hash;
        console.log('[GA4] Logging pageview:', path); // DEBUG
        logPageView(path);
    }, [location]);

    return null;
}

function SeoManager() {
    const location = useLocation();

    useEffect(() => {
        const currentPath = location.pathname.startsWith('/app') ? '/app/*' : location.pathname;
        const seoConfig = currentPath === '/app/*'
            ? {
                ...DEFAULT_SEO,
                title: 'AYUSETU App',
                path: '/app',
                robots: 'noindex, nofollow' as const
            }
            : (SEO_ROUTES[currentPath] || DEFAULT_SEO);

        const canonicalUrl = `${SEO_BASE_URL}${seoConfig.path === '/' ? '' : seoConfig.path}`;
        document.title = seoConfig.title;

        const updateMeta = (selector: string, attr: 'name' | 'property', value: string, content: string) => {
            const existing = document.head.querySelector<HTMLMetaElement>(selector);
            if (existing) {
                existing.setAttribute('content', content);
                return;
            }
            const meta = document.createElement('meta');
            meta.setAttribute(attr, value);
            meta.setAttribute('content', content);
            document.head.appendChild(meta);
        };

        const updateLink = (selector: string, rel: string, href: string) => {
            const existing = document.head.querySelector<HTMLLinkElement>(selector);
            if (existing) {
                existing.setAttribute('href', href);
                return;
            }
            const link = document.createElement('link');
            link.setAttribute('rel', rel);
            link.setAttribute('href', href);
            document.head.appendChild(link);
        };

        updateMeta('meta[name="description"]', 'name', 'description', seoConfig.description);
        updateMeta('meta[name="robots"]', 'name', 'robots', seoConfig.robots);
        updateMeta('meta[property="og:title"]', 'property', 'og:title', seoConfig.title);
        updateMeta('meta[property="og:description"]', 'property', 'og:description', seoConfig.description);
        updateMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
        updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seoConfig.title);
        updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seoConfig.description);
        updateLink('link[rel="canonical"]', 'canonical', canonicalUrl);

        const jsonLdId = 'route-seo-jsonld';
        const existingScript = document.getElementById(jsonLdId);
        const jsonLdPayload = {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: seoConfig.title,
            description: seoConfig.description,
            url: canonicalUrl,
            isPartOf: {
                '@type': 'WebSite',
                name: 'AYUSETU',
                url: SEO_BASE_URL
            }
        };

        if (existingScript) {
            existingScript.textContent = JSON.stringify(jsonLdPayload);
            return;
        }

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = jsonLdId;
        script.textContent = JSON.stringify(jsonLdPayload);
        document.head.appendChild(script);
    }, [location.pathname]);

    return null;
}

function AppRouter() {
    const { loading, isPasswordRecovery } = useHospital();
    const location = useLocation();

    if (loading) {
        return <WorkspaceSkeleton />
    }

    const isResetPath = window.location.hash.startsWith('#/reset-password');

    if (isPasswordRecovery || isResetPath) {
        return (
            <>
                <ResetPasswordPage />
                <Toaster />
            </>
        )
    }

    return (
        <>
            <SeoManager />
            <AnalyticsTracker />
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
                    <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
                    <Route path="/news" element={<PageWrapper><NewsPage /></PageWrapper>} />
                    <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
                    <Route path="/clinic-operations" element={<PageWrapper><ClinicOperationsPage /></PageWrapper>} />
                    <Route path="/hospital-command-center" element={<PageWrapper><HospitalCommandCenterPage /></PageWrapper>} />
                    <Route path="/privacy" element={<PageWrapper><PrivacyPage /></PageWrapper>} />
                    <Route path="/careers" element={<PageWrapper><CareersPage /></PageWrapper>} />
                    <Route path="/support" element={<PageWrapper><SupportPage /></PageWrapper>} />
                    <Route path="/login" element={<Navigate to="/app" />} />
                    <Route path="/register" element={<Navigate to="/app" />} />
                    <Route path="/kiosk" element={<div className="min-h-screen bg-slate-100 py-6"><PatientKiosk /></div>} />
                    <Route path="/app/*" element={<AppContent />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AnimatePresence>
        </>
    )
}

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class WorkspaceErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Workspace crash caught by ErrorBoundary:', error, errorInfo);
    }

    handleReload = () => {
        sessionStorage.removeItem('dhaaga_chunk_retry_active');
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white">
                    <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center shadow-2xl">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Workspace Recovery</h2>
                        <p className="text-sm text-slate-400 mb-6">
                            A new deployment or module update occurred. Click below to refresh your workspace bundle.
                        </p>
                        <button
                            onClick={this.handleReload}
                            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 px-4 rounded-xl transition shadow-lg shadow-emerald-900/30"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reload Workspace
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

function Main() {
    return (
        <Router>
            <WebsiteLocalizationRuntime />
            <WebsiteLanguageSelect />
            <TourProvider>
                <ProductTour />
                <WorkspaceErrorBoundary>
                    <Suspense fallback={<WorkspaceSkeleton />}>
                        <AppRouter />
                    </Suspense>
                </WorkspaceErrorBoundary>
            </TourProvider>
        </Router>
    );
}

function App() {
    return (
        <HospitalProvider>
            <Main />
        </HospitalProvider>
    )
}

export default App
