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
        const idx = records.findIndex(r => r.id === id);
        if (idx !== -1) {
            records[idx] = { ...records[idx], ...data, updated_at: new Date().toISOString() };
            this.setLocalData(table, records);
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
        // Forward algorithm calls to Cloudflare Worker
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
        window.addEventListener('cf_table_change', handler);
        return () => window.removeEventListener('cf_table_change', handler);
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
}

export const dataService: DataService = new CloudflareDataService();

