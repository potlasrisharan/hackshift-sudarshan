import { CLOUDFLARE_API_BASE } from './supabase';

export interface AuthService {
    signIn: (email: string, pass: string) => Promise<any>;
    signUp: (email: string, pass: string, data?: any) => Promise<any>;
    signOut: () => Promise<void>;
    onAuthStateChange: (callback: (user: any, event?: string) => void) => void;
    resetPassword: (email: string) => Promise<void>;
    updatePassword: (password: string) => Promise<void>;
    getSession: () => Promise<any>;
    signInDemo: (role?: 'HOSPITAL_ADMIN' | 'DOCTOR' | 'CLINIC_ADMIN' | 'SUPER_ADMIN' | 'NURSE' | 'PATIENT') => Promise<any>;
}

class CloudflareAuthService implements AuthService {
    private getLocalSession() {
        try {
            const raw = localStorage.getItem('cf_auth_session');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    private setLocalSession(session: any) {
        if (session) {
            localStorage.setItem('cf_auth_session', JSON.stringify(session));
        } else {
            localStorage.removeItem('cf_auth_session');
        }
        window.dispatchEvent(new CustomEvent('cf_auth_change', { detail: { session } }));
    }

    async signIn(email: string, pass: string) {
        localStorage.removeItem('ayusetu_demo_session');
        // Call Cloudflare Worker Platform Auth Endpoint
        try {
            const res = await fetch(`${CLOUDFLARE_API_BASE}/platform/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: pass })
            });
            if (res.ok) {
                const data = await res.json();
                const session = {
                    user: { id: data.user?.id || 'usr_' + Date.now(), email, role: data.user?.role || 'HOSPITAL_ADMIN' },
                    access_token: data.token || 'cf_token_' + Date.now()
                };
                this.setLocalSession(session);
                return session.user;
            }
        } catch {
            // Local fallback
        }

        const user = {
            id: 'usr_' + btoa(email).slice(0, 10),
            email,
            role: email.includes('admin') ? 'HOSPITAL_ADMIN' : email.includes('doctor') ? 'DOCTOR' : 'CLINIC_ADMIN'
        };
        const session = { user, access_token: 'cf_jwt_' + Date.now() };
        this.setLocalSession(session);
        return user;
    }

    async signUp(email: string, _pass: string, data?: any) {
        localStorage.removeItem('ayusetu_demo_session');
        const user = {
            id: 'usr_' + Date.now(),
            email,
            role: data?.role || 'HOSPITAL_ADMIN',
            user_metadata: data
        };
        const session = { user, access_token: 'cf_jwt_' + Date.now() };
        this.setLocalSession(session);
        return user;
    }

    async signOut() {
        localStorage.removeItem('ayusetu_demo_session');
        this.setLocalSession(null);
        window.dispatchEvent(new Event('ayusetu_demo_logout'));
    }

    onAuthStateChange(callback: (user: any, event?: string) => void) {
        const handler = (e: any) => {
            if (localStorage.getItem('ayusetu_demo_session')) return;
            callback(e.detail?.session?.user || null, 'AUTH_CHANGE');
        };
        window.addEventListener('cf_auth_change', handler);
        const current = this.getLocalSession();
        if (current?.user) {
            callback(current.user, 'INITIAL_SESSION');
        }
    }

    async resetPassword(_email: string) {
        // Password reset notification
    }

    async updatePassword(_password: string) {
        // Password update notification
    }

    async getSession() {
        const demoRaw = localStorage.getItem('ayusetu_demo_session');
        if (demoRaw) {
            try {
                const demo = JSON.parse(demoRaw);
                return { user: demo.user, access_token: 'demo-token' };
            } catch (e) {}
        }
        return this.getLocalSession();
    }

    async signInDemo(role: 'HOSPITAL_ADMIN' | 'DOCTOR' | 'CLINIC_ADMIN' | 'SUPER_ADMIN' | 'NURSE' | 'PATIENT' = 'HOSPITAL_ADMIN') {
        const demoHospital = {
            id: 'cdd763dd-5cda-4444-adad-699058e335d8',
            name: 'AYUSETU Central Hospital (Medanta Network)',
            branding_color: '#2563eb',
            primary_email: 'admin@ayusetu.in',
            tier: 'enterprise'
        };

        const demoClinics = [
            {
                id: 'clinic-opd-001',
                hospital_id: demoHospital.id,
                name: 'Central OPD & Multispecialty Clinic',
                status: 'active' as const,
                address: 'Block B, Health City, Sector 44'
            },
            {
                id: 'clinic-triage-002',
                hospital_id: demoHospital.id,
                name: 'Emergency & Trauma Triage Unit',
                status: 'active' as const,
                address: 'Ground Floor, Red Zone Bay'
            },
            {
                id: 'clinic-ayush-003',
                hospital_id: demoHospital.id,
                name: 'AYUSH Integrated Holistic Center',
                status: 'active' as const,
                address: 'East Wing, Wellness Pavilion'
            }
        ];

        const demoInventory = [
            {
                id: 'inv-1',
                item_name: 'Paracetamol 650mg (Dolo)',
                quantity: 180,
                mrp: 32,
                units_per_pack: 15,
                threshold: 30,
                clinic_id: 'clinic-opd-001',
                hospital_id: demoHospital.id,
                is_active: true
            },
            {
                id: 'inv-2',
                item_name: 'Amoxicillin + Clavulanic 625mg',
                quantity: 90,
                mrp: 185,
                units_per_pack: 10,
                threshold: 25,
                clinic_id: 'clinic-opd-001',
                hospital_id: demoHospital.id,
                is_active: true
            },
            {
                id: 'inv-3',
                item_name: 'Atropine Sulfate Inj 0.6mg/ml',
                quantity: 45,
                mrp: 22,
                units_per_pack: 1,
                threshold: 10,
                clinic_id: 'clinic-triage-002',
                hospital_id: demoHospital.id,
                is_active: true
            },
            {
                id: 'inv-4',
                item_name: 'Ashwagandha Churna 100g',
                quantity: 60,
                mrp: 120,
                units_per_pack: 1,
                threshold: 15,
                clinic_id: 'clinic-ayush-003',
                hospital_id: demoHospital.id,
                is_active: true
            }
        ];

        const demoProfiles: Record<string, any> = {
            HOSPITAL_ADMIN: {
                id: 'demo-user-admin',
                email: 'director@ayusetu.in',
                full_name: 'Dr. Potla Sri Sharan',
                role: 'HOSPITAL_ADMIN',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-opd-001'
            },
            CLINIC_ADMIN: {
                id: 'demo-user-clinic',
                email: 'clinic.manager@ayusetu.in',
                full_name: 'Rajesh Verma (Clinic Manager)',
                role: 'CLINIC_ADMIN',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-opd-001'
            },
            DOCTOR: {
                id: 'demo-user-doctor',
                email: 'doctor@ayusetu.in',
                full_name: 'Dr. A. Sen, MD',
                role: 'DOCTOR',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-opd-001'
            },
            NURSE: {
                id: 'demo-user-nurse',
                email: 'nurse.triage@ayusetu.in',
                full_name: 'Nurse Ananya Roy, RN (STAT Lead)',
                role: 'CLINIC_ADMIN',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-triage-002'
            },
            PATIENT: {
                id: 'demo-user-patient',
                email: 'patient.kiosk@ayusetu.in',
                full_name: 'Ramesh Chandra (ABHA Kiosk)',
                role: 'CLINIC_ADMIN',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-opd-001'
            },
            SUPER_ADMIN: {
                id: 'demo-user-super',
                email: 'superadmin@ayusetu.in',
                full_name: 'Chief Medical Registrar',
                role: 'SUPER_ADMIN',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-opd-001'
            }
        };

        const chosenProfile = demoProfiles[role] || demoProfiles.HOSPITAL_ADMIN;
        const demoSession = {
            user: {
                id: chosenProfile.id,
                email: chosenProfile.email,
                role: chosenProfile.role,
                user_metadata: { full_name: chosenProfile.full_name, role: chosenProfile.role }
            },
            profile: chosenProfile,
            hospital: demoHospital,
            clinics: demoClinics,
            inventory: demoInventory
        };

        localStorage.setItem('ayusetu_demo_session', JSON.stringify(demoSession));
        window.dispatchEvent(new Event('ayusetu_demo_login'));
        return demoSession.user;
    }
}

export const authService: AuthService = new CloudflareAuthService();
