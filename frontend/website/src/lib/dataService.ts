import { CLOUDFLARE_API_BASE } from './supabase';

export interface DataService {
    get: (table: string, id: string) => Promise<any>;
    list: (table: string, options?: {
        filters?: any;
        filterLogic?: 'and' | 'or';
        sort?: { column: string; ascending?: boolean };
        limit?: number;
        select?: string;
    }, context?: any) => Promise<any[]>;
    create: (table: string, data: any) => Promise<any>;
    createMany: (table: string, data: any[]) => Promise<any[]>;
    update: (table: string, id: string, data: any) => Promise<any>;
    remove: (table: string, id: string) => Promise<void>;
    removeByFilters: (table: string, filters: any) => Promise<void>;
    callRpc: (name: string, params: any) => Promise<any>;
    invokeFunction: (name: string, options?: any) => Promise<any>;
    count: (table: string, filters?: any) => Promise<number>;
    subscribe: (table: string, callback: (payload: any) => void, event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*') => () => void;
    getFinancialLedger: (hospitalId: string, options: { startDate?: string; endDate?: string; clinicId?: string }) => Promise<any[]>;
    getFinancialStatement: (hospitalId: string, type: 'PL' | 'BS', date: string) => Promise<any>;
    updateAuditLock: (hospitalId: string, lockDate: string) => Promise<void>;
    getIntakeQueue?: (options?: { status?: string; clinicId?: string }) => Promise<any[]>;
    submitEncounter?: (encounterData: any) => Promise<any>;
    updateEncounterStatus?: (id: string, updateData: { status?: string; bay?: string | null; assigned_doctor?: string | null; [key: string]: any }) => Promise<any>;
    submitPrescription?: (prescriptionData: any) => Promise<any>;
    getPrescriptions?: (options?: { status?: string; clinicId?: string }) => Promise<any[]>;
    submitPosSale?: (saleData: {
        clinicId?: string;
        prescriptionId?: string;
        encounterId?: string;
        patientId?: string;
        items?: any[];
        paymentMethod?: string;
        units?: number;
        totalSalePaise?: number;
        [key: string]: any;
    }) => Promise<any>;
    getInventoryRadar?: (options?: { clinicId?: string; stock?: number }) => Promise<any>;
    getOpsLedgerSummary?: (options?: { clinicId?: string }) => Promise<any>;
}

// Normalize filters
const normalizeFilters = (filters: any) => {
    if (!filters) return [];
    if (Array.isArray(filters)) {
        return filters.map(f => ({
            column: f.column || f.field || f.key || f.name,
            operator: f.operator || f.op || 'eq',
            value: f.value
        }));
    }
    return Object.entries(filters).map(([column, value]) => ({
        column,
        operator: 'eq',
        value
    }));
};

class CloudflareDataService implements DataService {
    private getStorageKey(table: string): string {
        return `cf_d1_store_${table}`;
    }

    private getLocalData(table: string): any[] {
        try {
            const raw = localStorage.getItem(this.getStorageKey(table));
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    private setLocalData(table: string, data: any[]): void {
        try {
            localStorage.setItem(this.getStorageKey(table), JSON.stringify(data));
            window.dispatchEvent(new CustomEvent('cf_table_change', { detail: { table } }));
        } catch (e) {
            console.warn('Storage quota exceeded on table:', table, e);
        }
    }

    async get(table: string, id: string) {
        const records = this.getLocalData(table);
        const item = records.find((r: any) => r.id === id);
        return item || null;
    }

    async list(table: string, optionsInput?: any, context?: any) {
        const options = Array.isArray(optionsInput) ? { filters: optionsInput } : optionsInput;
        let records = this.getLocalData(table);

        const filters = normalizeFilters(options?.filters);
        if (filters.length > 0) {
            records = records.filter(item => {
                const matches = filters.map(f => {
                    const val = item[f.column];
                    if (f.operator === '==' || f.operator === 'eq') return val === f.value;
                    if (f.operator === 'in') return Array.isArray(f.value) && f.value.includes(val);
                    if (f.operator === 'ilike') return String(val || '').toLowerCase().includes(String(f.value || '').toLowerCase());
                    if (f.operator === '<' || f.operator === 'lt') return val < f.value;
                    if (f.operator === '>' || f.operator === 'gt') return val > f.value;
                    if (f.operator === '<=' || f.operator === 'lte') return val <= f.value;
                    if (f.operator === '>=' || f.operator === 'gte') return val >= f.value;
                    return true;
                });
                return options?.filterLogic === 'or' ? matches.some(Boolean) : matches.every(Boolean);
            });
        }

        if (context) {
            records = records.filter(item => {
                return Object.entries(context).every(([k, v]) => item[k] === v);
            });
        }

        if (options?.sort) {
            const col = options.sort.column;
            const asc = options.sort.ascending ?? true;
            records.sort((a, b) => {
                if (a[col] < b[col]) return asc ? -1 : 1;
                if (a[col] > b[col]) return asc ? 1 : -1;
                return 0;
            });
        }

        if (options?.limit) {
            records = records.slice(0, options.limit);
        }

        return records;
    }

    async create(table: string, data: any) {
        const records = this.getLocalData(table);
        const newRecord = {
            id: data.id || `cf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            created_at: new Date().toISOString(),
            ...data
        };
        records.push(newRecord);
        this.setLocalData(table, records);

        if (table === 'encounters') {
            try {
                const res = await fetch(`${CLOUDFLARE_API_BASE}/intake/encounter`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newRecord)
                });
                if (res.ok) {
                    const serverJson = await res.json();
                    if (serverJson?.encounter) {
                        const idx = records.findIndex(r => r.id === newRecord.id);
                        if (idx !== -1) {
                            records[idx] = { ...newRecord, ...serverJson.encounter };
                            this.setLocalData(table, records);
                            return records[idx];
                        }
                    }
                }
            } catch (err) {
                console.warn('Backend encounter sync notice:', err);
            }
        }

        return newRecord;
    }

    async createMany(table: string, data: any[]) {
        const records = this.getLocalData(table);
        const createdList = data.map(item => ({
            id: item.id || `cf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            created_at: new Date().toISOString(),
            ...item
        }));
        records.push(...createdList);
        this.setLocalData(table, records);
        return createdList;
    }

    async update(table: string, id: string, data: any) {
        const records = this.getLocalData(table);
        const idx = records.findIndex(r => r.id === id || r.patient_id === id || r.token === id || r.token_number === id);
        if (idx !== -1) {
            records[idx] = { ...records[idx], ...data, updated_at: new Date().toISOString() };
            this.setLocalData(table, records);

            if (table === 'encounters') {
                try {
                    fetch(`${CLOUDFLARE_API_BASE}/intake/encounter/${encodeURIComponent(id)}/status`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    }).catch(() => {});
                } catch {
                    // Ignore network error in fallback
                }
            }

            return records[idx];
        }
        return null;
    }

    async remove(table: string, id: string) {
        const records = this.getLocalData(table).filter(r => r.id !== id);
        this.setLocalData(table, records);
    }

    async removeByFilters(table: string, filtersInput: any) {
        const filters = normalizeFilters(filtersInput?.filters || filtersInput);
        let records = this.getLocalData(table);
        records = records.filter(item => {
            return !filters.every(f => {
                if (f.operator === '==' || f.operator === 'eq') return item[f.column] === f.value;
                if (f.operator === 'in') return Array.isArray(f.value) && f.value.includes(item[f.column]);
                return false;
            });
        });
        this.setLocalData(table, records);
    }

    async callRpc(name: string, params: any) {
        // Handle client-side usage metric recalculation without triggering bogus 405 HTTP calls
        if (name === 'recount_usage_metric') {
            const metricKey = params?.p_metric_key;
            const hospitalId = params?.p_hospital_id;
            let current_value = 0;
            try {
                if (metricKey === 'staff_count') {
                    const staff = await this.list('staff', { filters: [{ column: 'hospital_id', operator: 'eq', value: hospitalId }] });
                    current_value = staff?.length || 1;
                } else if (metricKey === 'clinics_count') {
                    const clinics = await this.list('clinics', { filters: [{ column: 'hospital_id', operator: 'eq', value: hospitalId }] });
                    current_value = clinics?.length || 1;
                } else if (metricKey === 'inventory_items') {
                    const inv = await this.list('inventory', { filters: [{ column: 'hospital_id', operator: 'eq', value: hospitalId }] });
                    current_value = inv?.length || 0;
                }
            } catch {
                current_value = 1;
            }
            return { success: true, metric_key: metricKey, current_value };
        }

        // Only forward true deterministic algorithms to Cloudflare Worker
        const knownAlgorithms = [
            'sentinel', 'rx-to-shelf', 'rxToShelf', 'drift-radar', 'driftRadar',
            'threadpulse', 'threadPulse', 'her-safety-gate', 'vitalis-safety-gate'
        ];
        if (!knownAlgorithms.includes(name)) {
            return { success: true, name, params };
        }

        try {
            const res = await fetch(`${CLOUDFLARE_API_BASE}/algorithms/${name}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });
            if (res.ok) return await res.json();
        } catch {
            // fallback
        }
        return { success: true, name, params };
    }

    async invokeFunction(name: string, options?: any) {
        try {
            const res = await fetch(`${CLOUDFLARE_API_BASE}/${name}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(options?.body || {})
            });
            const data = await res.json();
            return { data, error: null };
        } catch (e: any) {
            return { data: null, error: e };
        }
    }

    async count(table: string, filtersInput?: any) {
        const items = await this.list(table, { filters: filtersInput });
        return items.length;
    }

    subscribe(table: string, callback: (payload: any) => void, _event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = 'INSERT') {
        const handler = (e: any) => {
            if (e.detail?.table === table) {
                callback({ table, timestamp: new Date().toISOString() });
            }
        };
        const storageHandler = (e: StorageEvent) => {
            if (e.key === this.getStorageKey(table)) {
                callback({ table, timestamp: new Date().toISOString() });
            }
        };
        window.addEventListener('cf_table_change', handler);
        window.addEventListener('storage', storageHandler);
        return () => {
            window.removeEventListener('cf_table_change', handler);
            window.removeEventListener('storage', storageHandler);
        };
    }

    async getFinancialLedger(hospitalId: string, options: { startDate?: string; endDate?: string; clinicId?: string }) {
        return this.list('financial_ledger', {
            filters: [
                { column: 'hospital_id', operator: 'eq', value: hospitalId },
                ...(options.clinicId && options.clinicId !== 'all' ? [{ column: 'clinic_id', operator: 'eq', value: options.clinicId }] : []),
                ...(options.startDate ? [{ column: 'entry_date', operator: 'gte', value: options.startDate }] : []),
                ...(options.endDate ? [{ column: 'entry_date', operator: 'lte', value: `${options.endDate}T23:59:59.999Z` }] : [])
            ],
            sort: { column: 'entry_date', ascending: false }
        });
    }

    async getFinancialStatement(hospitalId: string, type: 'PL' | 'BS', _date: string) {
        const ledger = await this.list('financial_ledger', {
            filters: [{ column: 'hospital_id', operator: 'eq', value: hospitalId }]
        });
        const revenue = ledger.filter(l => l.type === 'REVENUE').reduce((sum, l) => sum + (l.amount || 0), 0);
        const expenses = ledger.filter(l => l.type === 'EXPENSE').reduce((sum, l) => sum + (l.amount || 0), 0);
        return {
            report_type: type,
            revenue_paise: revenue * 100,
            expense_paise: expenses * 100,
            net_income_paise: (revenue - expenses) * 100,
            currency: 'INR'
        };
    }

    async updateAuditLock(hospitalId: string, lockDate: string) {
        const ledger = this.getLocalData('financial_ledger');
        ledger.forEach(item => {
            if (item.hospital_id === hospitalId && item.entry_date <= `${lockDate}T23:59:59.999Z`) {
                item.audit_locked = true;
            }
        });
        this.setLocalData('financial_ledger', ledger);
    }

    async getIntakeQueue(options?: { status?: string; clinicId?: string }) {
        try {
            const params = new URLSearchParams();
            if (options?.status) params.set('status', options.status);
            if (options?.clinicId) params.set('clinic_id', options.clinicId);
            const queryStr = params.toString() ? `?${params.toString()}` : '';
            const res = await fetch(`${CLOUDFLARE_API_BASE}/intake/queue${queryStr}`);
            if (res.ok) {
                const data = await res.json();
                const queue = data.queue || data.encounters || [];
                if (Array.isArray(queue) && queue.length > 0) {
                    const localRecords = this.getLocalData('encounters');
                    const merged = [...queue];
                    for (const loc of localRecords) {
                        if (!merged.some(m => m.id === loc.id || m.token === loc.token || m.token_number === loc.token_number)) {
                            merged.push(loc);
                        }
                    }
                    this.setLocalData('encounters', merged);
                    return queue;
                }
            }
        } catch (e) {
            console.warn('Backend queue fetch notice:', e);
        }
        let local = this.getLocalData('encounters');
        if (options?.status) {
            const statuses = options.status.split(',').map(s => s.trim().toUpperCase());
            local = local.filter((e: any) => statuses.includes(String(e.status).toUpperCase()));
        }
        return local;
    }

    async submitEncounter(encounterData: any) {
        return this.create('encounters', encounterData);
    }

    async updateEncounterStatus(id: string, updateData: { status?: string; bay?: string | null; assigned_doctor?: string | null; [key: string]: any }) {
        let serverResult = null;
        try {
            const res = await fetch(`${CLOUDFLARE_API_BASE}/intake/encounter/${encodeURIComponent(id)}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });
            if (res.ok) {
                const json = await res.json();
                serverResult = json.encounter;
            }
        } catch (e) {
            console.warn('Network updateEncounterStatus notice:', e);
        }
        const updated = await this.update('encounters', id, updateData);
        return serverResult || updated;
    }

    async submitPrescription(prescriptionData: any) {
        let serverResult = null;
        try {
            const res = await fetch(`${CLOUDFLARE_API_BASE}/prescriptions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prescriptionData)
            });
            if (res.ok) {
                serverResult = await res.json();
            }
        } catch (e) {
            console.warn('Backend prescription submission failed, saving locally:', e);
        }
        const localRx = await this.create('prescriptions', {
            ...prescriptionData,
            status: prescriptionData.status || 'SIGNED'
        });
        return serverResult || localRx;
    }

    async getPrescriptions(options?: { status?: string; clinicId?: string }): Promise<any[]> {
        const targetStatus = options?.status || 'SIGNED';
        const targetClinic = options?.clinicId || 'clinic-delhi-01';
        try {
            const params = new URLSearchParams();
            if (targetStatus) params.set('status', targetStatus);
            if (targetClinic) params.set('clinic_id', targetClinic);
            const res = await fetch(`${CLOUDFLARE_API_BASE}/prescriptions?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                const rxList = data.prescriptions || data.items || [];
                if (Array.isArray(rxList) && rxList.length > 0) {
                    const local = this.getLocalData('prescriptions');
                    const merged = [...rxList];
                    for (const loc of local) {
                        if (!merged.some(m => m.id === loc.id)) {
                            merged.push(loc);
                        }
                    }
                    this.setLocalData('prescriptions', merged);
                    return rxList;
                }
            }
        } catch (e) {
            console.warn('Backend prescriptions fetch notice:', e);
        }
        let local = this.getLocalData('prescriptions');
        if (targetStatus && targetStatus !== 'ALL') {
            local = local.filter((r: any) => !r.status || String(r.status).toUpperCase() === targetStatus.toUpperCase());
        }
        if (targetClinic && targetClinic !== 'all') {
            local = local.filter((r: any) => !r.clinicId && !r.clinic_id || r.clinicId === targetClinic || r.clinic_id === targetClinic);
        }
        return local;
    }

    async submitPosSale(saleData: {
        clinicId?: string;
        prescriptionId?: string;
        encounterId?: string;
        patientId?: string;
        items?: any[];
        paymentMethod?: string;
        units?: number;
        totalSalePaise?: number;
        [key: string]: any;
    }): Promise<any> {
        let serverResult = null;
        try {
            const res = await fetch(`${CLOUDFLARE_API_BASE}/ops/pos/sale`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(saleData)
            });
            if (res.ok) {
                serverResult = await res.json();
            }
        } catch (e) {
            console.warn('Backend POS sale submission notice:', e);
        }

        const localSale = await this.create('sales', {
            id: serverResult?.saleId || saleData.saleId || `sale_${Date.now()}`,
            clinic_id: saleData.clinicId || 'clinic-delhi-01',
            prescription_id: saleData.prescriptionId,
            encounter_id: saleData.encounterId,
            patient_id: saleData.patientId,
            sale_type: 'PHARMACY',
            payment_mode: saleData.paymentMethod || 'Cash',
            amount: typeof saleData.totalSalePaise === 'number' ? saleData.totalSalePaise / 100 : (saleData.amount || 0),
            amount_paise: saleData.totalSalePaise,
            timestamp: new Date().toISOString(),
            status: 'completed'
        });

        if (saleData.prescriptionId) {
            const rxList = this.getLocalData('prescriptions');
            const targetRx = rxList.find((r: any) => r.id === saleData.prescriptionId);
            if (targetRx) {
                targetRx.status = 'DISPENSED';
                targetRx.dispensed_at = new Date().toISOString();
                this.setLocalData('prescriptions', rxList);
            }
        }

        return serverResult || localSale;
    }

    async getInventoryRadar(options?: { clinicId?: string; stock?: number }): Promise<any> {
        const clinicId = options?.clinicId || 'clinic-delhi-01';
        try {
            const params = new URLSearchParams();
            params.set('clinic_id', clinicId);
            if (typeof options?.stock === 'number') params.set('stock', String(options.stock));
            const res = await fetch(`${CLOUDFLARE_API_BASE}/ops/inventory/radar?${params.toString()}`);
            if (res.ok) {
                return await res.json();
            }
        } catch (e) {
            console.warn('Backend inventory radar notice:', e);
        }
        return null;
    }

    async getOpsLedgerSummary(options?: { clinicId?: string }): Promise<any> {
        try {
            const params = new URLSearchParams();
            if (options?.clinicId && options.clinicId !== 'all') {
                params.set('clinic_id', options.clinicId);
            }
            const queryStr = params.toString() ? `?${params.toString()}` : '';
            const res = await fetch(`${CLOUDFLARE_API_BASE}/ops/ledger/summary${queryStr}`);
            if (res.ok) {
                return await res.json();
            }
        } catch (e) {
            console.warn('Backend ops ledger summary notice:', e);
        }
        return null;
    }
}

export const dataService: DataService = new CloudflareDataService();

