## `frontend/website/src/components/layout/AppLayout.tsx`
```
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHospital } from '@/context/HospitalContext'
import { NotificationsPanel } from '@/components/ui/NotificationsPanel'
import { requestNotificationPermission } from '@/lib/notifications'
import { useTour } from '@/context/TourContext'
import { DASHBOARD_TOUR_STEPS } from '@/tourSteps'
import { Play } from 'lucide-react'

interface AppLayoutProps {
    children: React.ReactNode
    onLogout: () => void
    view: string
    setView: (view: any) => void
    lockNavigation?: boolean
    selectedClinicId?: string | null
    onSelectClinicId?: (id: string | null) => void
}

export function AppLayout({ 
    children, 
    onLogout, 
    view, 
    setView, 
    lockNavigation = false,
    selectedClinicId = null,
    onSelectClinicId
}: AppLayoutProps) {
    const navigate = useNavigate();
    const { profile: userProfile, hospital, clinics, unseenCount } = useHospital()
    const { startTour, currentStepIndex, steps, isTourActive } = useTour()
    const role = userProfile?.role
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

    const isFullBleedPortal = ['doctor-consultation', 'emergency-triage', 'patient-kiosk'].includes(view);
    const CLINIC_VIEWS = ['clinic-admin', 'pos', 'attendance', 'shift-management', 'inventory-dashboard', 'staff', 'staff-management', 'earnings'];
    const isClinicPortal = CLINIC_VIEWS.includes(view) || (selectedClinicId !== null && view !== 'admin');

    const getPortalMeta = () => {
        if (view === 'patient-kiosk') {
            return {
                number: '01',
                name: 'Patient Health Portal & Kiosk',
                badge: 'PORTAL 1 · PERSONAL RECORDS & KIOSK',
                badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
                dotClass: 'bg-amber-500'
            };
        }
        if (view === 'doctor-consultation') {
            return {
                number: '02',
                name: 'Doctor Consultation (OPD)',
                badge: 'PORTAL 2 · CLINICIAN OPD COCKPIT',
                badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
                dotClass: 'bg-teal-500'
            };
        }
        if (view === 'emergency-triage') {
            return {
                number: '03',
                name: 'Emergency Triage (STAT)',
                badge: 'PORTAL 3 · EMERGENCY DEPARTMENT',
                badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
                dotClass: 'bg-rose-500 animate-ping'
            };
        }
        if (isClinicPortal) {
            return {
                number: '05',
                name: 'Clinic Operations & POS',
                badge: 'PORTAL 5 · CLINIC OPERATIONS',
                badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
                dotClass: 'bg-blue-500'
            };
        }
        return {
            number: '04',
            name: 'Headquarters Command Center',
            badge: 'PORTAL 4 · HQ GROUP COMMAND',
            badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
            dotClass: 'bg-indigo-500'
        };
    };

    const portalMeta = getPortalMeta();

    const autoStartAttempted = useRef(false);

    useEffect(() => {
        if (!role || view === 'selection' || view === 'setup' || lockNavigation) return;
        if (autoStartAttempted.current) return;

        const hasCompletedTour = localStorage.getItem('aarogya_nidhi_tour_completed');
        const isDesktop = window.innerWidth >= 768;

        if (!hasCompletedTour && isDesktop) {
            autoStartAttempted.current = true;
            const timer = setTimeout(() => {
                startTour(DASHBOARD_TOUR_STEPS);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [role, view, lockNavigation, startTour]);

    // Sync tour steps with app view for internal navigation
    useEffect(() => {
        if (!isTourActive || steps.length === 0) return;
        const currentStep = steps[currentStepIndex];
        if (currentStep && currentStep.route && currentStep.route !== view) {
            // Check if context already navigated the browser route. 
            // If we are already in /app, we just need to set the local view state.
            const possibleViews = [
                'selection', 'staff', 'admin', 'clinic-admin', 'inventory-dashboard', 'setup',
                'hospitals', 'audit_logs', 'pos', 'attendance', 'earnings',
                'settings', 'billing', 'shift-management', 'procurement',
                'expenses', 'equipments', 'ipd', 'ca-suite',
                'doctor-consultation', 'emergency-triage', 'ayush-center', 'patient-kiosk'
            ];
            if (possibleViews.includes(currentStep.route)) {
                setView(currentStep.route);
            }
        }
    }, [isTourActive, currentStepIndex, steps, setView, view]);


    // Helper for Navigation Items
    const NavItem = ({ icon, label, active, onClick, disabled, id }: any) => (
        <button
            id={id}
            onClick={() => {
                if (!disabled) {
                    onClick()
                    setIsMobileMenuOpen(false)
                }
            }}
            disabled={disabled}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group
                ${disabled ? 'opacity-50 cursor-not-allowed text-slate-400' :
                    active
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-500 hover:bg-slate-200/50'}
                `}
        >
            <span className={`material-symbols-outlined ${active ? '' : ''}`}>{icon}</span>
            <span className={`text-sm ${active ? 'font-semibold' : 'font-medium'}`}>{label}</span>
            {disabled && <span className="material-symbols-outlined text-[16px] ml-auto opacity-50">lock</span>}
        </button>
    )

    // Dynamic Branding
    const myClinic = userProfile?.clinic_id ? clinics.find(c => c.id === userProfile.clinic_id) : null

    const getBrandName = () => {
        if (['SUPER_ADMIN', 'OWNER'].includes(role || '')) return 'SaaS Control';
        if (role === 'CLINIC_ADMIN' && myClinic) return myClinic.name;
        return hospital?.name || 'Aarogya Nidhi';
    }

    const getBrandSubtitle = () => {
        if (['SUPER_ADMIN', 'OWNER'].includes(role || '')) return 'System Admin';
        if (role === 'CLINIC_ADMIN') return 'Clinic Manager';
        return 'Hospital OS';
    }

    const isClinicPaused = myClinic?.status === 'paused' && role !== 'SUPER_ADMIN' && role !== 'OWNER';

    if (isClinicPaused) {
        return (
            <div className="text-slate-900 h-screen w-screen flex overflow-hidden bg-slate-50 font-sans">
                <div className="w-full h-full flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center ring-1 ring-slate-200">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-3xl text-red-600">block</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Clinic Paused</h2>
                        <p className="text-slate-600 mb-8">
                            Your clinic has been paused by the hospital administrator.
                            You cannot access the system until it is unpaused.
                        </p>
                        <button
                            onClick={onLogout}
                            className="w-full bg-slate-100 text-slate-700 font-medium py-3 rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="text-slate-900 h-screen w-screen flex overflow-hidden bg-white font-sans">

            {/* MOBILE OVERLAY */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* SIDEBAR - HIDDEN FOR FULL-BLEED CLINICAL PORTALS (DOCTOR, NURSE, KIOSK) */}
            {!isFullBleedPortal && (
            <aside className={`
                w-64 bg-sidebar border-r border-slate-200 flex flex-col shrink-0 h-screen fixed lg:static z-50
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isClinicPortal ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                            <span className="material-symbols-outlined text-white text-xl">
                                {isClinicPortal ? 'local_hospital' : 'domain'}
                            </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-bold text-sm tracking-tight truncate max-w-[150px]">
                                {getBrandName()}
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold truncate">
                                {isClinicPortal ? 'Portal 05 · Clinic' : 'Portal 04 · HQ Group'}
                            </span>
                        </div>
                    </div>
                    <button className="lg:hidden text-slate-500" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-2 space-y-1">
                    {/* HQ COMMAND CENTER MENU (PORTAL 04) */}
                    {!isClinicPortal && (
                        <>
                            <NavItem
                                id="tour-dashboard"
                                icon="domain"
                                label="HQ Command Center"
                                active={(view as string) === 'admin'}
                                onClick={() => {
                                    onSelectClinicId?.(null);
                                    setView('admin');
                                }}
                                disabled={false}
                            />
                            <NavItem
                                id="tour-hospitals"
                                icon="domain"
                                label="Hospitals Registry"
                                active={(view as string) === 'hospitals'}
                                onClick={() => setView('hospitals')}
                            />
                            <NavItem
                                icon="shield_person"
                                label="Audit Logs"
                                active={(view as string) === 'audit_logs'}
                                onClick={() => setView('audit_logs')}
                            />
                            <NavItem
                                icon="account_balance"
                                label="Finance Suite"
                                active={(view as string) === 'ca-suite'}
                                onClick={() => setView('ca-suite')}
                            />
                            <NavItem
                                icon="shopping_cart_checkout"
                                label="Central Procurement"
                                active={(view as string) === 'procurement'}
                                onClick={() => setView('procurement')}
                            />
                            <NavItem
                                icon="payments"
                                label="Group Expenses"
                                active={(view as string) === 'expenses'}
                                onClick={() => setView('expenses')}
                            />
                            <NavItem
                                icon="conveyor_belt"
                                label="Equipments Listing"
                                active={(view as string) === 'equipments'}
                                onClick={() => setView('equipments')}
                            />
                            <NavItem
                                id="tour-billing"
                                icon="receipt_long"
                                label="Subscription & Billing"
                                active={(view as string) === 'billing'}
                                onClick={() => setView('billing')}
                            />
                        </>
                    )}

                    {/* CLINIC OPERATIONS & POS MENU (PORTAL 05) */}
                    {isClinicPortal && (
                        <>
                            <NavItem
                                icon="local_hospital"
                                label="Clinic Operations Hub"
                                active={(view as string) === 'clinic-admin'}
                                onClick={() => setView('clinic-admin')}
                            />
                            <NavItem
                                icon="point_of_sale"
                                label="Billing & POS"
                                active={(view as string) === 'pos'}
                                onClick={() => setView('pos')}
                            />
                            <NavItem
                                id="tour-inventory"
                                icon="inventory"
                                label="Inventory Control"
                                active={(view as string) === 'inventory-dashboard'}
                                onClick={() => setView('inventory-dashboard')}
                            />
                            <NavItem
                                id="tour-staff"
                                icon="badge"
                                label="Staff Management"
                                active={(view as string) === 'staff' || (view as string) === 'staff-management'}
                                onClick={() => setView('staff')}
                            />
                            <NavItem
                                icon="how_to_reg"
                                label="Attendance"
                                active={(view as string) === 'attendance'}
                                onClick={() => setView('attendance')}
                            />
                            <NavItem
                                id="tour-shifts"
                                icon="schedule"
                                label="Shift Management"
                                active={(view as string) === 'shift-management'}
                                onClick={() => setView('shift-management')}
                            />
                            <NavItem
                                icon="hotel"
                                label="IPD Inpatients"
                                active={(view as string) === 'ipd'}
                                onClick={() => setView('ipd')}
                            />
                            <NavItem
                                id="tour-earnings"
                                icon="account_balance_wallet"
                                label="Earnings & Ledger"
                                active={(view as string) === 'earnings'}
                                onClick={() => setView('earnings')}
                            />
                        </>
                    )}

                </div>

                <div className="p-4 border-t border-slate-200 mt-auto shrink-0 bg-white">
                    {/* SETTINGS MENU ITEM - FIXED TO BOTTOM */}
                    {['ADMIN', 'HOSPITAL_ADMIN', 'CLINIC_ADMIN', 'SUPER_ADMIN', 'OWNER'].includes(role || '') && (
                        <div className="mb-2">
                            <NavItem
                                id="tour-settings"
                                icon="settings"
                                label="Settings"
                                active={view === 'settings'}
                                onClick={() => setView('settings')}
                                disabled={lockNavigation}
                            />
                        </div>
                    )}

                    <button
                        onClick={onLogout}
                        className="w-full text-left flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-slate-50 rounded-lg transition-colors active:bg-slate-100"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
                            {userProfile?.full_name?.[0] || 'U'}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-xs font-semibold truncate">{userProfile?.full_name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{getBrandSubtitle()}</p>
                        </div>
                        <span className="material-symbols-outlined text-red-500 text-lg group-hover:text-red-700" title="Sign Out">logout</span>
                    </button>
                </div>
            </aside>
            )}

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 overflow-y-auto bg-white flex flex-col relative w-full">

                {/* HEADER */}
                {view !== 'patient-kiosk' && (
                <header className="h-20 border-b border-slate-100 flex items-center justify-between px-4 lg:px-12 sticky top-0 bg-white/95 backdrop-blur-md z-30 shrink-0">
                    <div className="flex items-center gap-4">
                        {!isFullBleedPortal && (
                            <button className="lg:hidden p-2.5 -ml-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all flex items-center justify-center" onClick={() => setIsMobileMenuOpen(true)}>
                                <span className="material-symbols-outlined text-[24px]">menu</span>
                            </button>
                        )}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${portalMeta.badgeClass}`}>
                                    {portalMeta.badge}
                                </span>
                            </div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight capitalize leading-none">
                                {portalMeta.name}
                            </h1>
                        </div>
                    </div>

                    {/* DEDICATED EXIT TO PORTALS BUTTON - STITCH MINIMAL TASTE */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                onSelectClinicId?.(null);
                                navigate('/');
                            }}
                            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700 hover:text-slate-950 text-xs font-semibold tracking-tight shadow-sm transition-all duration-150 cursor-pointer active:scale-95"
                            title="Return to Portal Selection (Choose a different dashboard)"
                        >
                            <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-slate-700 group-hover:-translate-x-0.5 transition-all">arrow_back</span>
                            <span>Exit to Portals</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => startTour(DASHBOARD_TOUR_STEPS)}
                            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100/50 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                        >
                            <Play className="w-3.5 h-3.5" />
                            Replay Demo
                        </button>
                        {/* Notifications */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            {Notification.permission !== 'granted' && (
                                <button
                                    onClick={async () => {
                                        const granted = await requestNotificationPermission();
                                        if (granted) {
                                            // Refresh component state or show success
                                            window.location.reload();
                                        }
                                    }}
                                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                                    title="Enable Desktop Notifications"
                                >
                                    <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                                    Enable Desktop Alerts
                                </button>
                            )}
                            <button
                                onClick={() => setIsNotificationsOpen(true)}
                                className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all active:scale-95 group"
                            >
                                <span className="material-symbols-outlined text-2xl group-hover:rotate-[15deg] transition-transform">notifications</span>
                                {unseenCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white group-hover:scale-110 transition-transform">
                                        {unseenCount > 99 ? '99+' : unseenCount}
                                    </span>
                                )}
                            </button>
                        </div>
                        <NotificationsPanel
                            open={isNotificationsOpen}
                            onClose={() => setIsNotificationsOpen(false)}
                            onNavigate={setView}
                        />
                        {/* We leave the top right action area primarily to the child components, 
                        but we can provide a container for them if needed later. */}
                    </div>
                </header>
                )}

                {/* SCROLLABLE INNER CONTENT */}
                <div className={view === 'patient-kiosk' ? "flex-1 w-full" : "flex-1 p-4 lg:p-12 lg:pt-6 max-w-[1600px] w-full mx-auto"}>
                    {children}
                </div>
            </main>
        </div>
    )
}

```

## `frontend/website/src/components/landing/Navbar.tsx`
```

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ReactGA from "react-ga4";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Solutions', path: 'offers', isSection: true },
    { name: 'Pricing', path: 'pricing', isSection: true },
    { name: 'About', path: '/about', isSection: false },
    { name: 'News', path: '/news', isSection: false },
    { name: 'Contact', path: '/contact', isSection: false },
  ];

  const navigate = useNavigate();

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.name === 'Pricing') {
      ReactGA.event({
        category: "Navigation",
        action: "Clicked Pricing",
      });
    }

    if (link.isSection) {
      if (location.pathname !== '/') {
        navigate('/');
        // Give it a moment to mount the LandingPage
        setTimeout(() => {
          const element = document.getElementById(link.path);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        const element = document.getElementById(link.path);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm py-3 border-b border-slate-100' : 'bg-white py-4 border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-white text-xl">local_hospital</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">Aarogya Nidhi</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.isSection ? (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-primary' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {link.name}
                </Link>
              )
            ))}
            <Link
              to="/app"
              onClick={() => {
                ReactGA.event({
                  category: "App Engagement",
                  action: "Clicked Launch Dashboards",
                });
                if (!localStorage.getItem('lastActiveView')) {
                  localStorage.setItem('lastActiveView', 'admin');
                }
              }}
              className="bg-primary hover:opacity-90 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all text-white flex items-center gap-1.5"
            >
              <span>Launch Dashboards</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-primary"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 top-[73px] bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] bg-white border-b border-slate-100 p-6 space-y-6 shadow-2xl z-50 animate-in fade-in slide-in-from-top-4 flex flex-col h-[calc(100vh-73px)] overflow-y-auto">
          <div className="space-y-4">
            {navLinks.map((link) => (
              link.isSection ? (
                <button
                  key={link.name}
                  onClick={() => {
                    handleNavClick(link);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-lg font-bold text-slate-700 hover:text-primary py-3 border-b border-slate-50"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-lg font-bold text-slate-700 hover:text-primary py-3 border-b border-slate-50"
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>
          <div className="pt-4 mt-auto pb-8">
            <Link
              to="/app"
              onClick={() => {
                ReactGA.event({
                  category: "App Engagement",
                  action: "Clicked Launch Dashboards",
                });
                if (!localStorage.getItem('lastActiveView')) {
                  localStorage.setItem('lastActiveView', 'admin');
                }
              }}
              className="block w-full bg-primary hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-bold text-center shadow-lg transition-colors"
            >
              Launch Dashboards (No Login)
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

```

## `frontend/website/src/components/landing/Footer.tsx`
```

import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 py-16 pb-24 md:pb-16 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-sm transform rotate-45"></div>
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">Aarogya Nidhi</span>
            </Link>
            <p className="text-slate-600 max-w-xs mb-8 leading-relaxed">
              Revolutionizing healthcare management through integrated technology. Empowering providers, improving lives.
            </p>
            <div className="flex space-x-5 text-slate-400">
              <a href="#" className="hover:text-primary transition-colors"><Linkedin className="w-6 h-6" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Twitter className="w-6 h-6" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Facebook className="w-6 h-6" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Instagram className="w-6 h-6" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-6">Solutions</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/clinic-operations" className="text-slate-600 hover:text-primary transition-colors">Clinic Interface</Link></li>
              <li><Link to="/hospital-command-center" className="text-slate-600 hover:text-primary transition-colors">Hospital Interface</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="text-slate-600 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-slate-600 hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/news" className="text-slate-600 hover:text-primary transition-colors">News & Press</Link></li>
              <li><Link to="/contact" className="text-slate-600 hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-slate-600 hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold mb-6">Connect</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/support" className="text-slate-600 hover:text-primary transition-colors">Support Portal</Link></li>
              <li><Link to="/support" className="text-slate-600 hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            &copy; 2026 Aarogya Nidhi. All rights reserved. A Healthcare Solutions Company.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

```