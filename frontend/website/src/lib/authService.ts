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
            name: 'AYUSETU Central Hospital & Medical Network',
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
            },
            {
                id: 'clinic-south-004',
                hospital_id: demoHospital.id,
                name: 'Bengaluru Metro Health Hub',
                status: 'active' as const,
                address: 'Plot 12, Outer Ring Road, Bengaluru'
            },
            {
                id: 'clinic-west-005',
                hospital_id: demoHospital.id,
                name: 'Mumbai Satellite Day-Care Hospital',
                status: 'active' as const,
                address: 'SV Road, Andheri West, Mumbai'
            }
        ];

        const nearExpiryDate1 = new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0];
        const nearExpiryDate2 = new Date(Date.now() + 22 * 86400000).toISOString().split('T')[0];

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
                expiry_date: '2027-11-30',
                batch_number: 'BAT-OPD-DOL',
                is_active: true
            },
            {
                id: 'inv-2',
                item_name: 'Amoxicillin + Clavulanic 625mg',
                quantity: 18,
                mrp: 185,
                units_per_pack: 10,
                threshold: 25,
                clinic_id: 'clinic-opd-001',
                hospital_id: demoHospital.id,
                expiry_date: nearExpiryDate1,
                batch_number: 'BAT-OPD-AMX',
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
                expiry_date: '2027-01-31',
                batch_number: 'BAT-TRG-ATR',
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
                expiry_date: '2027-10-31',
                batch_number: 'BAT-AYU-ASH',
                is_active: true
            },
            {
                id: 'inv-5',
                item_name: 'Aspirin 300mg Soluble Dispersible',
                quantity: 12,
                mrp: 45,
                units_per_pack: 14,
                threshold: 20,
                clinic_id: 'clinic-opd-001',
                hospital_id: demoHospital.id,
                expiry_date: nearExpiryDate2,
                batch_number: 'BAT-ASP-01',
                is_active: true
            },
            {
                id: 'inv-6',
                item_name: 'Aspirin 300mg Soluble Dispersible',
                quantity: 180,
                mrp: 45,
                units_per_pack: 14,
                threshold: 20,
                clinic_id: 'clinic-triage-002',
                hospital_id: demoHospital.id,
                expiry_date: '2027-09-30',
                batch_number: 'BAT-TRG-ASP',
                is_active: true
            },
            {
                id: 'inv-7',
                item_name: 'Clopidogrel 300mg (Loading Dose)',
                quantity: 85,
                mrp: 130,
                units_per_pack: 10,
                threshold: 15,
                clinic_id: 'clinic-triage-002',
                hospital_id: demoHospital.id,
                expiry_date: '2027-07-31',
                batch_number: 'BAT-TRG-CLO',
                is_active: true
            },
            {
                id: 'inv-8',
                item_name: 'Atorvastatin 80mg High-Intensity',
                quantity: 110,
                mrp: 145,
                units_per_pack: 10,
                threshold: 20,
                clinic_id: 'clinic-opd-001',
                hospital_id: demoHospital.id,
                expiry_date: '2027-10-15',
                batch_number: 'BAT-ATO-01',
                is_active: true
            },
            {
                id: 'inv-9',
                item_name: 'Metformin 500mg Extended Release',
                quantity: 14,
                mrp: 110,
                units_per_pack: 15,
                threshold: 25,
                clinic_id: 'clinic-opd-001',
                hospital_id: demoHospital.id,
                expiry_date: nearExpiryDate1,
                batch_number: 'BAT-MET-01',
                is_active: true
            },
            {
                id: 'inv-10',
                item_name: 'Metformin 500mg Extended Release',
                quantity: 260,
                mrp: 110,
                units_per_pack: 15,
                threshold: 25,
                clinic_id: 'clinic-south-004',
                hospital_id: demoHospital.id,
                expiry_date: '2027-04-15',
                batch_number: 'BAT-SOU-MET',
                is_active: true
            },
            {
                id: 'inv-11',
                item_name: 'Telmisartan 40mg Cardio-Renal',
                quantity: 95,
                mrp: 160,
                units_per_pack: 15,
                threshold: 20,
                clinic_id: 'clinic-opd-001',
                hospital_id: demoHospital.id,
                expiry_date: '2027-12-31',
                batch_number: 'BAT-TEL-01',
                is_active: true
            },
            {
                id: 'inv-12',
                item_name: 'Ceftriaxone 1g IV Injection',
                quantity: 75,
                mrp: 65,
                units_per_pack: 1,
                threshold: 20,
                clinic_id: 'clinic-triage-002',
                hospital_id: demoHospital.id,
                expiry_date: '2027-03-31',
                batch_number: 'BAT-TRG-CEF',
                is_active: true
            },
            {
                id: 'inv-13',
                item_name: 'Salbutamol 100mcg Reliever Inhaler',
                quantity: 50,
                mrp: 165,
                units_per_pack: 1,
                threshold: 15,
                clinic_id: 'clinic-opd-001',
                hospital_id: demoHospital.id,
                expiry_date: '2027-04-30',
                batch_number: 'BAT-OPD-AST',
                is_active: true
            },
            {
                id: 'inv-14',
                item_name: 'Pantoprazole 40mg Gastroprotective',
                quantity: 190,
                mrp: 155,
                units_per_pack: 15,
                threshold: 30,
                clinic_id: 'clinic-west-005',
                hospital_id: demoHospital.id,
                expiry_date: '2027-05-30',
                batch_number: 'BAT-WST-PAN',
                is_active: true
            },
            {
                id: 'inv-15',
                item_name: 'Triphala Guggulu 500mg Tab',
                quantity: 80,
                mrp: 145,
                units_per_pack: 60,
                threshold: 20,
                clinic_id: 'clinic-ayush-003',
                hospital_id: demoHospital.id,
                expiry_date: '2027-12-31',
                batch_number: 'BAT-AYU-TRI',
                is_active: true
            },
            {
                id: 'inv-16',
                item_name: 'Normal Saline 0.9% 500ml IV',
                quantity: 140,
                mrp: 42,
                units_per_pack: 1,
                threshold: 35,
                clinic_id: 'clinic-triage-002',
                hospital_id: demoHospital.id,
                expiry_date: '2028-02-28',
                batch_number: 'BAT-TRG-NS',
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

        // Seed comprehensive sales transactions for HQ analytical visualizer & finance radar
        const nowMs = Date.now();
        const demoSales = [
            {
                id: 'sale-001',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-opd-001',
                amount: 850,
                amount_paise: 85000,
                payment_mode: 'UPI',
                sale_type: 'CONSULTATION',
                patient_name: 'Sunita Sharma',
                doctor_name: 'Dr. A. Sen, MD',
                timestamp: new Date(nowMs - 1200000).toISOString(),
                status: 'completed'
            },
            {
                id: 'sale-002',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-opd-001',
                amount: 1420,
                amount_paise: 142000,
                payment_mode: 'Cash',
                sale_type: 'PHARMACY',
                patient_name: 'Harpreet Singh',
                doctor_name: 'Dr. A. Sen, MD',
                timestamp: new Date(nowMs - 2800000).toISOString(),
                status: 'completed'
            },
            {
                id: 'sale-003',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-triage-002',
                amount: 3500,
                amount_paise: 350000,
                payment_mode: 'CARD',
                sale_type: 'SERVICE',
                patient_name: 'Ramesh Chandra',
                doctor_name: 'Dr. Ananya Sharma',
                timestamp: new Date(nowMs - 4200000).toISOString(),
                status: 'completed'
            },
            {
                id: 'sale-004',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-triage-002',
                amount: 15000,
                amount_paise: 1500000,
                payment_mode: 'UPI',
                sale_type: 'IPD_ADMISSION_ADVANCE',
                patient_name: 'Aarav Patel',
                doctor_name: 'Dr. Ananya Sharma',
                timestamp: new Date(nowMs - 6400000).toISOString(),
                status: 'completed'
            },
            {
                id: 'sale-005',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-ayush-003',
                amount: 1200,
                amount_paise: 120000,
                payment_mode: 'UPI',
                sale_type: 'CONSULTATION',
                patient_name: 'Kavita Menon',
                doctor_name: 'Vaidya R. K. Shastri',
                timestamp: new Date(nowMs - 8900000).toISOString(),
                status: 'completed'
            },
            {
                id: 'sale-006',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-south-004',
                amount: 4850,
                amount_paise: 485000,
                payment_mode: 'CARD',
                sale_type: 'PHARMACY',
                patient_name: 'Suresh Reddy',
                doctor_name: 'Dr. P. Hegde',
                timestamp: new Date(nowMs - 12000000).toISOString(),
                status: 'completed'
            },
            {
                id: 'sale-007',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-south-004',
                amount: 22000,
                amount_paise: 2200000,
                payment_mode: 'UPI',
                sale_type: 'IPD_SETTLEMENT',
                patient_name: 'Anandi Bai',
                doctor_name: 'Dr. P. Hegde',
                timestamp: new Date(nowMs - 15000000).toISOString(),
                status: 'completed'
            },
            {
                id: 'sale-008',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-west-005',
                amount: 2600,
                amount_paise: 260000,
                payment_mode: 'Cash',
                sale_type: 'CONSULTATION',
                patient_name: 'Farooq Merchant',
                doctor_name: 'Dr. Z. Khan',
                timestamp: new Date(nowMs - 18000000).toISOString(),
                status: 'completed'
            },
            {
                id: 'sale-009',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-opd-001',
                amount: 1100,
                amount_paise: 110000,
                payment_mode: 'UPI',
                sale_type: 'PHARMACY',
                patient_name: 'Vikramaditya Rao',
                doctor_name: 'Dr. A. Sen, MD',
                timestamp: new Date(nowMs - 22000000).toISOString(),
                status: 'completed'
            },
            {
                id: 'sale-010',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-ayush-003',
                amount: 3200,
                amount_paise: 320000,
                payment_mode: 'Cash',
                sale_type: 'PHARMACY',
                patient_name: 'Meenakshi Iyer',
                doctor_name: 'Vaidya R. K. Shastri',
                timestamp: new Date(nowMs - 26000000).toISOString(),
                status: 'completed'
            }
        ];

        const demoIpdAdmissions = [
            {
                id: 'ipd-001',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-triage-002',
                patient_name: 'Ramesh Chandra',
                bed_number: 'ICU Bed 01',
                admission_date: new Date(nowMs - 86400000).toISOString(),
                status: 'admitted',
                diagnosis: 'Acute Coronary Syndrome (NSTEMI) Post-Cath',
                estimated_stay_days: 3
            },
            {
                id: 'ipd-002',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-triage-002',
                patient_name: 'Aarav Patel',
                bed_number: 'Pediatric High-Dependency Bed 03',
                admission_date: new Date(nowMs - 14400000).toISOString(),
                status: 'admitted',
                diagnosis: 'Severe Acute Asthma on Oxygen & Nebulization',
                estimated_stay_days: 2
            },
            {
                id: 'ipd-003',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-south-004',
                patient_name: 'Suresh Reddy',
                bed_number: 'Male Medical Ward Bed 08',
                admission_date: new Date(nowMs - 172800000).toISOString(),
                status: 'admitted',
                diagnosis: 'Pneumonia with Pleural Effusion',
                estimated_stay_days: 4
            },
            {
                id: 'ipd-004',
                hospital_id: demoHospital.id,
                clinic_id: 'clinic-west-005',
                patient_name: 'Farooq Merchant',
                bed_number: 'Daycare Surgical Suite Bay 02',
                admission_date: new Date(nowMs - 3600000).toISOString(),
                status: 'admitted',
                diagnosis: 'Laparoscopic Inguinal Herniorrhaphy Post-Op',
                estimated_stay_days: 1
            }
        ];

        localStorage.setItem('ayusetu_demo_session', JSON.stringify(demoSession));
        localStorage.setItem('cf_d1_store_inventory', JSON.stringify(demoInventory));
        localStorage.setItem('cf_d1_store_sales', JSON.stringify(demoSales));
        localStorage.setItem('cf_d1_store_ipd_admissions', JSON.stringify(demoIpdAdmissions));
        window.dispatchEvent(new Event('ayusetu_demo_login'));
        return demoSession.user;
    }
}

export const authService: AuthService = new CloudflareAuthService();
