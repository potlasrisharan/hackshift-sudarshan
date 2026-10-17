import { SymbolIcon } from "@/components/ui/SymbolIcon";
import { useState, useEffect, useMemo } from 'react'
import {
    RefreshCw,
    Search,
    X,
    TrendingUp,
    TrendingDown,
    ArrowLeft,
    ShieldCheck,
    AlertTriangle,
    Clock,
    Receipt,
    Package,
    Users,
    Zap,
    ChevronRight,
    FileText,
    CheckCircle2,
    Building2,
    MapPin,
    UserCheck,
    Radio
} from 'lucide-react'
import { dataService as db } from '@/lib/dataService'
import { getStartOfTodayIST } from '@/lib/utils'
import { useHospital } from '@/context/HospitalContext'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ReceiptModal } from '@/components/ui/ReceiptModal'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts'

type View = 'selection' | 'staff' | 'admin' | 'inventory-dashboard' | 'setup' | 'hospitals' | 'audit_logs' | 'pos' | 'shift-management' | 'ipd';

interface ClinicAdminDashboardProps {
    clinicId: string;
    onBack?: () => void;
    onNavigate?: (view: View) => void;
}

const PAYMENT_COLOR_MAP: Record<string, { fill: string; gradStart: string; gradEnd: string; badge: string }> = {
    UPI: { fill: '#6366f1', gradStart: '#818cf8', gradEnd: '#4f46e5', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    CASH: { fill: '#10b981', gradStart: '#34d399', gradEnd: '#059669', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    CARD: { fill: '#3b82f6', gradStart: '#60a5fa', gradEnd: '#2563eb', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    INSURANCE: { fill: '#8b5cf6', gradStart: '#a78bfa', gradEnd: '#7c3aed', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
    IPD_BILL: { fill: '#f59e0b', gradStart: '#fbbf24', gradEnd: '#d97706', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    OTHER: { fill: '#64748b', gradStart: '#94a3b8', gradEnd: '#475569', badge: 'bg-slate-50 text-slate-700 border-slate-200' }
};

export function ClinicAdminDashboard({ clinicId, onBack, onNavigate }: ClinicAdminDashboardProps) {
    const { inventory, managedClinic, setPendingRestockId } = useHospital()
    const [stats, setStats] = useState({ revenue: 0, transactions: 0, staffCount: 0 })
    const [dailySales, setDailySales] = useState<any[]>([])
    const [weeklyData, setWeeklyData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [clinicData, setClinicData] = useState<any>(managedClinic || null)
    const [managerName, setManagerName] = useState<string>('Unassigned')
    const [lastSyncTime, setLastSyncTime] = useState<string>('Just now')

    // Search and Filters
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedSaleType, setSelectedSaleType] = useState<string>('all')
    const [selectedPaymentMode, setSelectedPaymentMode] = useState<string>('all')
    const [dateRange, setDateRange] = useState<'week' | 'month'>('week')
    const [activePieIndex, setActivePieIndex] = useState<number | null>(null)

    // Receipt View State
    const [selectedReceiptSale, setSelectedReceiptSale] = useState<any>(null)
    const [selectedReceiptItems, setSelectedReceiptItems] = useState<any[]>([])
    const [isReceiptLoading, setIsReceiptLoading] = useState(false)

    // Stock Detail Modal State
    const [selectedStockItem, setSelectedStockItem] = useState<any>(null)

    // Filtered Inventory for this clinic
    const clinicInventory = useMemo(() => {
        return inventory.filter((i: any) => i.clinic_id === clinicId)
    }, [inventory, clinicId])

    // Aggregated low stock calculation (per item name)
    const lowStock = useMemo(() => {
        const groups = new Map();
        clinicInventory.forEach(item => {
            const name = item.item_name?.trim();
            if (!name) return;
            if (!groups.has(name)) {
                groups.set(name, { ...item, total_quantity: 0 });
            }
            const record = groups.get(name);
            record.total_quantity += (item.quantity || 0);
        });

        return Array.from(groups.values()).filter((i: any) => i.total_quantity < (i.threshold || 10));
    }, [clinicInventory]);

    // Drift Radar Telemetry: Near-expiry batches (<30 days countdown)
    const nearExpiryBatches = useMemo(() => {
        const now = new Date();
        const thirtyDaysAhead = new Date();
        thirtyDaysAhead.setDate(thirtyDaysAhead.getDate() + 30);

        return clinicInventory
            .filter((item: any) => {
                if (!item.expiry_date || (item.quantity || 0) <= 0) return false;
                const exp = new Date(item.expiry_date);
                return !isNaN(exp.getTime()) && exp <= thirtyDaysAhead;
            })
            .map((item: any) => {
                const exp = new Date(item.expiry_date);
                const diffTime = exp.getTime() - now.getTime();
                const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return {
                    ...item,
                    daysRemaining
                };
            })
            .sort((a, b) => a.daysRemaining - b.daysRemaining);
    }, [clinicInventory]);

    // Critical Out of Stock (< 40% of threshold or <= 3 units)
    const criticalStock = useMemo(() => {
        return lowStock
            .filter((item: any) => item.total_quantity <= Math.max(3, Math.floor((item.threshold || 10) * 0.4)))
            .sort((a: any, b: any) => a.total_quantity - b.total_quantity);
    }, [lowStock]);

    // Payment Mode Distribution (for Recharts Donut)
    const paymentBreakdown = useMemo(() => {
        const modes: Record<string, { count: number; amount: number; label: string; key: string }> = {
            UPI: { count: 0, amount: 0, label: 'UPI / Digital', key: 'UPI' },
            CASH: { count: 0, amount: 0, label: 'Cash Currency', key: 'CASH' },
            CARD: { count: 0, amount: 0, label: 'Card / POS', key: 'CARD' },
            INSURANCE: { count: 0, amount: 0, label: 'Insurance / TPA', key: 'INSURANCE' },
            IPD_BILL: { count: 0, amount: 0, label: 'IPD / Credit', key: 'IPD_BILL' }
        };

        dailySales.forEach((sale: any) => {
            const rawMode = (sale.payment_mode || '').toUpperCase();
            const amt = Number(sale.amount) || 0;

            if (rawMode.includes('UPI') || rawMode === 'ONLINE') {
                modes.UPI.count += 1;
                modes.UPI.amount += amt;
            } else if (rawMode.includes('CASH')) {
                modes.CASH.count += 1;
                modes.CASH.amount += amt;
            } else if (rawMode.includes('CARD') || rawMode === 'DEBIT' || rawMode === 'CREDIT_CARD') {
                modes.CARD.count += 1;
                modes.CARD.amount += amt;
            } else if (rawMode.includes('INSUR') || rawMode === 'TPA') {
                modes.INSURANCE.count += 1;
                modes.INSURANCE.amount += amt;
            } else if (rawMode.includes('IPD')) {
                modes.IPD_BILL.count += 1;
                modes.IPD_BILL.amount += amt;
            } else {
                modes.CASH.count += 1;
                modes.CASH.amount += amt;
            }
        });

        const list = Object.values(modes).filter(m => m.count > 0 || m.amount > 0);
        return list.length > 0 ? list.map(m => ({ ...m, name: m.label, value: m.amount })) : [
            { key: 'UPI', name: 'UPI / Digital', value: 0, count: 0, amount: 0, label: 'UPI / Digital' },
            { key: 'CASH', name: 'Cash Currency', value: 0, count: 0, amount: 0, label: 'Cash Currency' }
        ];
    }, [dailySales]);

    // Average ticket & digital vs cash metrics
    const transactionMetrics = useMemo(() => {
        let cashCount = 0;
        let digitalCount = 0;
        dailySales.forEach(s => {
            const m = (s.payment_mode || '').toUpperCase();
            if (m.includes('CASH')) cashCount++;
            else digitalCount++;
        });
        const avgTicket = stats.transactions > 0 ? Math.round(stats.revenue / stats.transactions) : 0;
        return { cashCount, digitalCount, avgTicket };
    }, [dailySales, stats.transactions, stats.revenue]);

    // Dynamic Revenue Trend Pill
    const revenueTrend = useMemo(() => {
        if (!weeklyData || weeklyData.length <= 1) return { percent: '+14.2%', positive: true };
        const pastDays = weeklyData.slice(0, -1);
        const avgDaily = pastDays.length > 0
            ? pastDays.reduce((acc, d) => acc + (d.revenue || 0), 0) / pastDays.length
            : 0;

        if (avgDaily <= 0) return { percent: '+100%', positive: true };
        const diff = ((stats.revenue - avgDaily) / avgDaily) * 100;
        const sign = diff >= 0 ? '+' : '';
        return {
            percent: `${sign}${diff.toFixed(1)}%`,
            positive: diff >= 0
        };
    }, [weeklyData, stats.revenue]);

    // Filtered Live Transactions Table
    const filteredTransactions = useMemo(() => {
        return dailySales.filter((sale: any) => {
            // Text Search
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchesQuery =
                    sale.patient_name?.toLowerCase().includes(q) ||
                    sale.doctor_name?.toLowerCase().includes(q) ||
                    sale.sale_type?.toLowerCase().includes(q) ||
                    sale.payment_mode?.toLowerCase().includes(q) ||
                    sale.id?.toLowerCase().includes(q);
                if (!matchesQuery) return false;
            }

            // Sale Type Filter
            if (selectedSaleType !== 'all') {
                const st = (sale.sale_type || '').toUpperCase();
                if (selectedSaleType === 'IPD' && !st.includes('IPD')) return false;
                if (selectedSaleType !== 'IPD' && st !== selectedSaleType) return false;
            }

            // Payment Mode Filter
            if (selectedPaymentMode !== 'all') {
                const pm = (sale.payment_mode || '').toUpperCase();
                if (!pm.includes(selectedPaymentMode)) return false;
            }

            return true;
        });
    }, [dailySales, searchQuery, selectedSaleType, selectedPaymentMode]);

    useEffect(() => {
        fetchData();

        // Real-time listener for sales in this clinic via Cloudflare DataService
        const unsubscribe = db.subscribe('sales', (payload) => {
            if (payload.clinic_id === clinicId) {
                fetchData(true);
            }
        }, '*');

        return () => unsubscribe();
    }, [clinicId, managedClinic, dateRange]);

    const fetchData = async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        else setRefreshing(true);

        try {
            // 1. Clinic Metadata
            if (managedClinic && managedClinic.id === clinicId) {
                setClinicData(managedClinic);
            } else if (!clinicData) {
                const clinic = await db.get('clinics', clinicId);
                if (clinic) setClinicData(clinic);
            }

            const startOfDay = getStartOfTodayIST();
            const rangeDays = dateRange === 'week' ? 7 : 30;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - rangeDays);
            startDate.setHours(0, 0, 0, 0);

            // 2. Sales Records via dataService (Cloudflare D1 Storage)
            const allSales = await db.list('sales', {
                filters: [
                    { column: 'clinic_id', operator: '==', value: clinicId },
                    { column: 'timestamp', operator: '>=', value: startDate.toISOString() }
                ],
                sort: { column: 'timestamp', ascending: true }
            });

            if (allSales) {
                // Today's Sales
                const todaySales = allSales
                    .filter((s: any) => new Date(s.timestamp) >= new Date(startOfDay))
                    .reverse();
                setDailySales(todaySales);

                const revenue = todaySales
                    .filter((s: any) => s.payment_mode !== 'IPD_BILL')
                    .reduce((sum: number, s: any) => sum + (Number(s.amount) || 0), 0);
                const transactions = todaySales.length;

                // Aggregate Historic Data for Glassmorphic Chart
                const chartMap: Record<string, { name: string; fullDate: string; visits: number; revenue: number }> = {};

                for (let i = rangeDays - 1; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dateKey = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                    chartMap[dateKey] = {
                        name: dateKey,
                        fullDate: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
                        visits: 0,
                        revenue: 0
                    };
                }

                allSales.forEach((sale: any) => {
                    const d = new Date(sale.timestamp);
                    const dayName = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                    if (chartMap[dayName]) {
                        chartMap[dayName].visits += 1;
                        if (sale.payment_mode !== 'IPD_BILL') {
                            chartMap[dayName].revenue += (Number(sale.amount) || 0);
                        }
                    }
                });

                setWeeklyData(Object.values(chartMap));

                // 3. Active Staff on Duty
                const staffCount = await db.count('staff_details', {
                    filters: [
                        { column: 'clinic_id', operator: '==', value: clinicId },
                        { column: 'status', operator: '==', value: 'Active' }
                    ]
                });

                setStats({
                    revenue,
                    transactions,
                    staffCount: staffCount || 0
                });
            }

            // 4. Clinic Administrator Profile
            const managers = await db.list('profiles', {
                filters: [
                    { column: 'clinic_id', operator: '==', value: clinicId },
                    { column: 'role', operator: '==', value: 'CLINIC_ADMIN' }
                ],
                limit: 1
            });

            if (managers && managers[0]) {
                setManagerName(managers[0].full_name || managers[0].email || 'Clinic Lead');
            }

            const now = new Date();
            setLastSyncTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));

        } catch (err) {
            console.error("Dashboard Telemetry Error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // 1-Click Tax Receipt Modal Handler
    const openReceipt = async (sale: any) => {
        setSelectedReceiptSale(sale);
        setSelectedReceiptItems([]);
        setIsReceiptLoading(true);
        try {
            const itemsData = await db.list('sale_items', {
                filters: [{ column: 'sale_id', operator: '==', value: sale.id }]
            });

            if (itemsData) {
                const formattedItems = await Promise.all(itemsData.map(async (item: any) => {
                    let itemName = 'Standard Item';
                    if (item.inventory_id) {
                        const invDoc = await db.get('inventory', item.inventory_id);
                        itemName = invDoc?.item_name || 'Generic Item';
                    }
                    const priceValue = item.price !== undefined ? item.price : item.unit_price;
                    return {
                        item_name: itemName,
                        quantity: Number(item.quantity) || 1,
                        price: Number(priceValue) || 0
                    };
                }));
                setSelectedReceiptItems(formattedItems);
            }
        } catch (error) {
            console.error('Error fetching receipt items:', error);
        } finally {
            setIsReceiptLoading(false);
        }
    };

    // Fast Reorder Action
    const handleFastReorder = (itemId: string) => {
        if (setPendingRestockId) {
            setPendingRestockId(itemId);
        }
        onNavigate?.('inventory-dashboard');
    };

    if (loading) {
        return (
            <div className="flex flex-col h-[75vh] items-center justify-center gap-4">
                <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                    <Building2 className="w-6 h-6 text-blue-600 absolute" />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-sm font-bold text-slate-800">Calibrating Clinic Telemetry...</p>
                    <p className="text-xs text-slate-400">Loading Cloudflare D1 real-time operations data</p>
                </div>
            </div>
        );
    }

    const totalPeriodRevenue = weeklyData.reduce((sum, d) => sum + (d.revenue || 0), 0);
    const totalPeriodVisits = weeklyData.reduce((sum, d) => sum + (d.visits || 0), 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-[1600px] mx-auto pb-12">
            {/* 1. SINGLE CLINIC OPERATIONS COCKPIT HEADER */}
            <div className="relative bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 lg:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start sm:items-center gap-4">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200/80 active:scale-95 flex items-center justify-center text-slate-700 transition-all shadow-sm"
                                title="Back to Network Overview"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 ring-4 ring-blue-50">
                                <Building2 className="w-7 h-7" />
                            </div>
                            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                            </span>
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                    {clinicData?.name || 'Clinic Operations Hub'}
                                </h1>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Operational
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-100 text-slate-600">
                                    ID: {clinicId.slice(0, 8)}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mt-1.5">
                                <span className="flex items-center gap-1 text-slate-600 font-semibold">
                                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                    {clinicData?.location || clinicData?.address || 'Main Health Facility'}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1 text-slate-600">
                                    <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                                    Manager: <strong className="text-slate-800">{managerName}</strong>
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1 text-slate-400">
                                    <Radio className="w-3 h-3 text-emerald-500" />
                                    Synced: {lastSyncTime}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Cockpit Actions Cluster */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fetchData(true)}
                            disabled={refreshing}
                            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-xs font-bold text-slate-700 transition-all disabled:opacity-50"
                            title="Force Telemetry Sync"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
                            <span className="hidden sm:inline">Sync Cloudflare D1</span>
                        </button>

                        <button
                            onClick={() => onNavigate?.('pos')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all"
                        >
                            <Zap className="w-3.5 h-3.5" />
                            <span>Quick POS Checkout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. QUICK NAV BAR (1-CLICK DOCK) */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-3 border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <SymbolIcon className="material-symbols-outlined text-blue-600 text-[18px]">bolt</SymbolIcon>
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Fast Navigation</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">1-Click Direct Hub Access</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    <button
                        onClick={() => onNavigate?.('pos')}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-md hover:shadow-blue-500/20 active:scale-[0.98] transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <SymbolIcon className="material-symbols-outlined text-[22px]">point_of_sale</SymbolIcon>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold leading-tight truncate">POS Billing</p>
                            <p className="text-[10px] text-blue-100 truncate mt-0.5">Counter Checkout</p>
                        </div>
                    </button>

                    <button
                        onClick={() => onNavigate?.('inventory-dashboard')}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm active:scale-[0.98] transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <SymbolIcon className="material-symbols-outlined text-[22px]">inventory_2</SymbolIcon>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold leading-tight truncate">Inventory Control</p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">FEFO & Batches</p>
                        </div>
                    </button>

                    <button
                        onClick={() => onNavigate?.('staff')}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm active:scale-[0.98] transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <SymbolIcon className="material-symbols-outlined text-[22px]">badge</SymbolIcon>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold leading-tight truncate">Staff Attendance</p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">Roster & Logs</p>
                        </div>
                    </button>

                    <button
                        onClick={() => onNavigate?.('shift-management')}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm active:scale-[0.98] transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <SymbolIcon className="material-symbols-outlined text-[22px]">schedule</SymbolIcon>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold leading-tight truncate">Shift Management</p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">Duty Timetable</p>
                        </div>
                    </button>

                    <button
                        onClick={() => onNavigate?.('ipd')}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/60 hover:border-slate-300 hover:shadow-sm active:scale-[0.98] transition-all text-left group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <SymbolIcon className="material-symbols-outlined text-[22px]">hotel</SymbolIcon>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold leading-tight truncate">IPD Inpatients</p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">Beds & Admissions</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* 3. EXECUTIVE METRIC CARDS (4-CARD GRID) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* CARD 1: TODAY'S REVENUE */}
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer group flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                                        <SymbolIcon className="material-symbols-outlined text-2xl">payments</SymbolIcon>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${revenueTrend.positive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                                        {revenueTrend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {revenueTrend.percent}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Revenue</p>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                                        ₹{stats.revenue.toLocaleString('en-IN')}
                                    </h3>
                                    <p className="text-[11px] text-slate-400 font-medium">Net settled collections today</p>
                                </div>
                            </div>
                            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] text-slate-500 font-medium">Inspect breakdown</span>
                                <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                    View Modal →
                                </span>
                            </div>
                        </div>
                    </DialogTrigger>

                    {/* Today's Transactions Dialog View */}
                    <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col bg-white text-slate-900 rounded-3xl border-0 shadow-2xl p-6">
                        <DialogHeader className="border-b border-slate-100 pb-4">
                            <div className="flex items-center justify-between">
                                <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <SymbolIcon className="material-symbols-outlined text-blue-600">receipt_long</SymbolIcon>
                                    Today's Revenue Journal & Settlements
                                </DialogTitle>
                                <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                                    Total ₹{stats.revenue.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </DialogHeader>

                        <div className="flex-1 overflow-auto mt-4 pr-1">
                            {dailySales.length === 0 ? (
                                <div className="text-center py-16 text-slate-400 font-medium">
                                    <Receipt className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                                    No transactions recorded yet today.
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">Patient Details</th>
                                                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider">Classification & Mode</th>
                                                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                                                <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-center w-16">Receipt</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {dailySales.map((sale: any) => (
                                                <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-4 py-3.5">
                                                        <p className="font-bold text-slate-900">{sale.patient_name || 'Walk-in Patient'}</p>
                                                        <p className="text-[11px] text-slate-400 mt-0.5">Dr. {sale.doctor_name || 'Staff'}</p>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                                {sale.sale_type || 'GENERAL'}
                                                            </span>
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                                                                {sale.payment_mode || 'CASH'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right font-black text-slate-900 text-sm">
                                                        ₹{(Number(sale.amount) || 0).toLocaleString('en-IN')}
                                                    </td>
                                                    <td className="px-4 py-3.5 text-center">
                                                        <button
                                                            onClick={() => openReceipt(sale)}
                                                            className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                            title="View Tax Receipt"
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* CARD 2: TOTAL TRANSACTIONS */}
                <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                                <Receipt className="w-6 h-6" />
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Avg ₹{transactionMetrics.avgTicket.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Transactions</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                                {stats.transactions} <span className="text-base font-semibold text-slate-400">Bills</span>
                            </h3>
                            <p className="text-[11px] text-slate-400 font-medium">Today's billing counter volume</p>
                        </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            {transactionMetrics.digitalCount} Digital
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            {transactionMetrics.cashCount} Cash
                        </span>
                    </div>
                </div>

                {/* CARD 3: ACTIVE STAFF ON DUTY */}
                <div
                    onClick={() => onNavigate?.('staff')}
                    className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-emerald-200 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                >
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Active Roster
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Staff on Duty</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                                {stats.staffCount} <span className="text-base font-semibold text-slate-400">Personnel</span>
                            </h3>
                            <p className="text-[11px] text-slate-400 font-medium">Nurses, Pharmacists & Front Desk</p>
                        </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex -space-x-2 overflow-hidden">
                            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-blue-500 text-[10px] text-white font-bold flex items-center justify-center">DR</div>
                            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-emerald-500 text-[10px] text-white font-bold flex items-center justify-center">RN</div>
                            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-purple-500 text-[10px] text-white font-bold flex items-center justify-center">PH</div>
                            {stats.staffCount > 3 && (
                                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-slate-100 ring-2 ring-white text-[10px] font-bold text-slate-600">
                                    +{stats.staffCount - 3}
                                </div>
                            )}
                        </div>
                        <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                            Manage Roster →
                        </span>
                    </div>
                </div>

                {/* CARD 4: LOW STOCK ALERTS */}
                <div
                    onClick={() => onNavigate?.('inventory-dashboard')}
                    className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-amber-200 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                >
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${lowStock.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate?.('inventory-dashboard');
                                }}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors"
                            >
                                Fast Restock
                            </button>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Alert Items</p>
                            <h3 className={`text-3xl font-black tracking-tight ${lowStock.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {lowStock.length} <span className="text-base font-semibold text-slate-400">SKUs</span>
                            </h3>
                            <p className="text-[11px] text-slate-400 font-medium">
                                {criticalStock.length > 0 ? `${criticalStock.length} critical depleted (<5 units)` : 'All shelf levels within target'}
                            </p>
                        </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${lowStock.length > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${Math.min(100, Math.max(15, (lowStock.length / (clinicInventory.length || 1)) * 100))}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold uppercase">
                            <span>{lowStock.length > 0 ? 'Action Required' : 'Optimal'}</span>
                            <span className="text-blue-600 group-hover:translate-x-0.5 transition-transform">Control Hub →</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. GLASSMORPHIC CHARTS (RECHARTS): REVENUE TRAJECTORY + PAYMENT MODES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* REVENUE & VOLUME TRAJECTORY (AREA CHART - 7 COLS) */}
                <div className="lg:col-span-8 bg-white/95 backdrop-blur-xl p-7 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Revenue & Patient Flow Trajectory</h2>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Consolidated telemetry over selected timeframe • {totalPeriodVisits} visits logged
                                </p>
                            </div>

                            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60 self-start sm:self-auto">
                                <button
                                    onClick={() => setDateRange('week')}
                                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${dateRange === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    Last 7 Days
                                </button>
                                <button
                                    onClick={() => setDateRange('month')}
                                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${dateRange === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    Last 30 Days
                                </button>
                            </div>
                        </div>

                        {/* Chart KPI Sub-pills */}
                        <div className="grid grid-cols-3 gap-3 mb-6 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Period Revenue</p>
                                <p className="text-base font-black text-slate-900 mt-0.5">₹{totalPeriodRevenue.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Daily Average</p>
                                <p className="text-base font-black text-slate-900 mt-0.5">
                                    ₹{Math.round(totalPeriodRevenue / (dateRange === 'week' ? 7 : 30)).toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Visits</p>
                                <p className="text-base font-black text-blue-600 mt-0.5">{totalPeriodVisits}</p>
                            </div>
                        </div>

                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="clinicRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                                        tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                                    />
                                    <Tooltip
                                        content={({ active, payload }: any) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/60 backdrop-blur-md text-xs animate-in zoom-in-95">
                                                        <p className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                                                            {data.fullDate || data.name}
                                                        </p>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center justify-between gap-4">
                                                                <span className="text-slate-300">Revenue:</span>
                                                                <span className="font-black text-blue-400 text-sm">₹{Number(data.revenue || 0).toLocaleString('en-IN')}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between gap-4">
                                                                <span className="text-slate-400">Total Visits:</span>
                                                                <span className="font-bold text-white">{data.visits || 0}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#clinicRevenueGradient)"
                                        name="Daily Revenue"
                                        animationDuration={1200}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* PAYMENT MODE DISTRIBUTION (DONUT CHART - 4 COLS) */}
                <div className="lg:col-span-4 bg-white/95 backdrop-blur-xl p-7 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-lg font-black text-slate-900 tracking-tight">Payment Channel Split</h2>
                                <p className="text-xs text-slate-500 mt-0.5">UPI, Cash, Cards & Credits</p>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Today</span>
                        </div>

                        {/* DONUT CHART WITH CENTER METRIC */}
                        <div className="relative my-2 flex items-center justify-center">
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <PieChart>
                                        <defs>
                                            {paymentBreakdown.map((item, idx) => {
                                                const colors = PAYMENT_COLOR_MAP[item.key] || PAYMENT_COLOR_MAP.OTHER;
                                                return (
                                                    <linearGradient key={`pie-grad-${idx}`} id={`pie-grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor={colors.gradStart} />
                                                        <stop offset="100%" stopColor={colors.gradEnd} />
                                                    </linearGradient>
                                                );
                                            })}
                                        </defs>
                                        <Pie
                                            data={paymentBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={58}
                                            outerRadius={80}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="#ffffff"
                                            strokeWidth={2}
                                            onMouseEnter={(_, index) => setActivePieIndex(index)}
                                            onMouseLeave={() => setActivePieIndex(null)}
                                        >
                                            {paymentBreakdown.map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={`url(#pie-grad-${index})`}
                                                    style={{
                                                        transform: activePieIndex === index ? 'scale(1.05)' : 'scale(1)',
                                                        transformOrigin: 'center',
                                                        transition: 'transform 0.2s ease-out'
                                                    }}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            content={({ active, payload }: any) => {
                                                if (active && payload && payload.length) {
                                                    const entry = payload[0].payload;
                                                    const totalAmt = paymentBreakdown.reduce((sum, p) => sum + p.value, 0);
                                                    const pct = totalAmt > 0 ? ((entry.value / totalAmt) * 100).toFixed(1) : '0';
                                                    return (
                                                        <div className="bg-slate-900/95 text-white px-3 py-2 rounded-xl shadow-2xl border border-slate-700/60 backdrop-blur-md text-xs">
                                                            <p className="font-bold text-slate-200">{entry.name}</p>
                                                            <p className="font-black text-white text-sm mt-0.5">₹{entry.value.toLocaleString('en-IN')}</p>
                                                            <p className="text-slate-400 text-[10px]">{entry.count} txns ({pct}%)</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Collections</span>
                                <span className="text-base font-black text-slate-900 mt-0.5">₹{stats.revenue.toLocaleString('en-IN')}</span>
                                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                                    100% Settled
                                </span>
                            </div>
                        </div>

                        {/* Breakdown Channels Legend */}
                        <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                            {paymentBreakdown.map((mode) => {
                                const colors = PAYMENT_COLOR_MAP[mode.key] || PAYMENT_COLOR_MAP.OTHER;
                                const totalAmt = paymentBreakdown.reduce((sum, p) => sum + p.value, 0);
                                const pct = totalAmt > 0 ? ((mode.value / totalAmt) * 100).toFixed(0) : '0';

                                return (
                                    <div key={mode.key} className="flex items-center justify-between text-xs py-1">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.fill }} />
                                            <span className="font-semibold text-slate-700">{mode.label}</span>
                                            <span className="text-[10px] text-slate-400">({mode.count})</span>
                                        </div>
                                        <div className="flex items-center gap-2 font-bold text-slate-900">
                                            <span>₹{mode.value.toLocaleString('en-IN')}</span>
                                            <span className="text-[10px] font-medium text-slate-400 w-8 text-right">{pct}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. DRIFT RADAR: INVENTORY TELEMETRY SECTION */}
            <div className="bg-white/95 backdrop-blur-xl p-7 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                                <Radio className="w-5 h-5 animate-pulse" />
                            </div>
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                            </span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-black text-slate-900 tracking-tight">Drift Radar: Inventory Telemetry</h2>
                                <span className="text-[10px] font-bold bg-amber-100/70 text-amber-800 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    FEFO Active
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Automated expiry surveillance (&lt;30 days), critical stock depletion & fast reorder dispatch
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onNavigate?.('inventory-dashboard')}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                        >
                            <Package className="w-3.5 h-3.5 text-slate-500" />
                            <span>Open Inventory Dashboard</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* PANEL A: NEAR-EXPIRY BATCHES (<30 DAYS) */}
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-amber-600" />
                                    <h3 className="text-sm font-bold text-slate-900">Near-Expiry Batches (&lt; 30 Days)</h3>
                                </div>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${nearExpiryBatches.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {nearExpiryBatches.length} {nearExpiryBatches.length === 1 ? 'Batch' : 'Batches'}
                                </span>
                            </div>

                            {nearExpiryBatches.length === 0 ? (
                                <div className="p-8 text-center bg-white rounded-xl border border-slate-200/60">
                                    <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                                    <p className="text-xs font-bold text-slate-800">Shelf Health 100% Clear</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Zero batches expiring within 30 days. FEFO rotation optimal.</p>
                                </div>
                            ) : (
                                <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                                    {nearExpiryBatches.slice(0, 5).map((batch: any) => {
                                        const isCritical = batch.daysRemaining <= 7;
                                        return (
                                            <div
                                                key={batch.id}
                                                className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/60 hover:border-amber-200 transition-all shadow-sm"
                                            >
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs font-bold text-slate-900 truncate">{batch.item_name}</p>
                                                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                                            {batch.batch_number ? `B: ${batch.batch_number}` : 'Batch Ref'}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                                        Quantity left: <strong className="text-slate-800">{batch.quantity} units</strong> • Exp: {batch.expiry_date}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className={`text-[11px] font-black px-2 py-1 rounded-lg ${isCritical ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-amber-100 text-amber-800'}`}>
                                                        {batch.daysRemaining <= 0 ? 'Expired' : `${batch.daysRemaining}d left`}
                                                    </span>
                                                    <button
                                                        onClick={() => handleFastReorder(batch.id)}
                                                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                                                        title="FEFO Restock / Review"
                                                    >
                                                        <Package className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Rule: First-Expiry-First-Out (FEFO) Priority</span>
                            <span className="font-semibold text-amber-700">Expedite dispense before discard</span>
                        </div>
                    </div>

                    {/* PANEL B: CRITICAL OUT-OF-STOCK & FAST REORDER */}
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                                    <h3 className="text-sm font-bold text-slate-900">Critical Out-of-Stock Depletions</h3>
                                </div>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${criticalStock.length > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {criticalStock.length} {criticalStock.length === 1 ? 'Item' : 'Items'} Critical
                                </span>
                            </div>

                            {criticalStock.length === 0 ? (
                                <div className="p-8 text-center bg-white rounded-xl border border-slate-200/60">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                                    <p className="text-xs font-bold text-slate-800">Adequate Stock Buffer</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">No critical shortages below minimum safety stock.</p>
                                </div>
                            ) : (
                                <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                                    {criticalStock.slice(0, 5).map((item: any) => {
                                        const deficit = Math.max(0, (item.threshold || 10) - (item.total_quantity || 0));
                                        const percentage = Math.round(((item.total_quantity || 0) / (item.threshold || 10)) * 100);

                                        return (
                                            <div
                                                key={item.id}
                                                className="p-3 bg-white rounded-xl border border-slate-200/60 hover:border-rose-200 transition-all shadow-sm space-y-2"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-slate-900 truncate">{item.item_name}</p>
                                                        <p className="text-[10px] text-slate-400">
                                                            Available: <strong className="text-rose-600 font-bold">{item.total_quantity} units</strong> • Threshold: {item.threshold || 10} • Deficit: <strong className="text-rose-600 font-bold">{deficit} units</strong>
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            onClick={() => setSelectedStockItem(item)}
                                                            className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg transition-colors"
                                                        >
                                                            Inspect
                                                        </button>
                                                        <button
                                                            onClick={() => handleFastReorder(item.id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-black text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
                                                        >
                                                            <Zap className="w-3 h-3" />
                                                            Fast Reorder
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex">
                                                    <div
                                                        className="h-1.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500"
                                                        style={{ width: `${Math.min(100, Math.max(8, percentage))}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Deficit Target: Safety threshold buffer</span>
                            <span className="font-semibold text-rose-600">Immediate PO recommendation</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. LIVE TRANSACTIONS STREAM & SEARCH TABLE */}
            <div className="bg-white/95 backdrop-blur-xl p-7 rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <SymbolIcon className="material-symbols-outlined text-blue-600">receipt_long</SymbolIcon>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">Live Counter Transactions & Settlements</h2>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Real-time streaming ledger of today's pharmacy, consultation, and IPD billings
                        </p>
                    </div>

                    {/* Real-time Search Box */}
                    <div className="relative w-full lg:w-96">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            placeholder="Search patient, clinician, sale type, invoice #..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Pills Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    {/* Sale Type Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Type:</span>
                        {['all', 'PHARMACY', 'CONSULTATION', 'IPD', 'SERVICES'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedSaleType(type)}
                                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${selectedSaleType === type ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {type === 'all' ? 'All Types' : type}
                            </button>
                        ))}
                    </div>

                    {/* Payment Mode Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Mode:</span>
                        {['all', 'UPI', 'CASH', 'CARD', 'IPD_BILL'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setSelectedPaymentMode(mode)}
                                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${selectedPaymentMode === mode ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {mode === 'all' ? 'All Modes' : mode === 'IPD_BILL' ? 'IPD Credit' : mode}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TRANSACTIONS TABLE */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-5 py-3.5">Invoice # & Time</th>
                                <th className="px-5 py-3.5">Patient Details</th>
                                <th className="px-5 py-3.5">Clinician / Staff</th>
                                <th className="px-5 py-3.5">Category</th>
                                <th className="px-5 py-3.5">Payment Mode</th>
                                <th className="px-5 py-3.5 text-right">Settled Amount</th>
                                <th className="px-5 py-3.5 text-center w-24">Tax Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-slate-400">
                                        <div className="space-y-1">
                                            <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
                                            <p className="text-sm font-semibold text-slate-700">No matching transactions</p>
                                            <p className="text-xs text-slate-400">Try adjusting your search query or channel filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((sale: any) => {
                                    const modeColor = PAYMENT_COLOR_MAP[(sale.payment_mode || '').toUpperCase()] || PAYMENT_COLOR_MAP.OTHER;
                                    const saleTime = sale.timestamp ? new Date(sale.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Today';

                                    return (
                                        <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-5 py-3.5 font-mono">
                                                <span className="font-bold text-slate-900">#{sale.id?.slice(0, 8)}</span>
                                                <p className="text-[10px] text-slate-400 font-sans mt-0.5">{saleTime}</p>
                                            </td>

                                            <td className="px-5 py-3.5">
                                                <p className="font-bold text-slate-900">{sale.patient_name || 'Walk-in Patient'}</p>
                                                {sale.patient_phone && (
                                                    <p className="text-[10px] text-slate-400">{sale.patient_phone}</p>
                                                )}
                                            </td>

                                            <td className="px-5 py-3.5 font-medium text-slate-600">
                                                Dr. {sale.doctor_name || 'Staff Attendant'}
                                            </td>

                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                                                    sale.sale_type === 'PHARMACY'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : sale.sale_type === 'CONSULTATION'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                    {sale.sale_type || 'GENERAL'}
                                                </span>
                                            </td>

                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${modeColor.badge}`}>
                                                    {sale.payment_mode === 'IPD_BILL' ? 'IPD CREDIT' : sale.payment_mode || 'CASH'}
                                                </span>
                                            </td>

                                            <td className="px-5 py-3.5 text-right font-black text-slate-900 text-sm">
                                                <span className={sale.payment_mode === 'IPD_BILL' ? 'text-amber-600 font-semibold italic' : ''}>
                                                    ₹{(Number(sale.amount) || 0).toLocaleString('en-IN')}
                                                </span>
                                            </td>

                                            <td className="px-5 py-3.5 text-center">
                                                <button
                                                    onClick={() => openReceipt(sale)}
                                                    disabled={isReceiptLoading}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-[11px] font-bold transition-all shadow-sm active:scale-95"
                                                    title="View Full Tax Receipt"
                                                >
                                                    <FileText className="w-3.5 h-3.5" />
                                                    <span>Receipt</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                        {filteredTransactions.length > 0 && (
                            <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-900">
                                <tr>
                                    <td colSpan={5} className="px-5 py-3.5 text-right text-xs uppercase tracking-wider text-slate-500">
                                        Filtered Volume ({filteredTransactions.length} items) • Total:
                                    </td>
                                    <td className="px-5 py-3.5 text-right text-base font-black text-blue-600">
                                        ₹{filteredTransactions.reduce((acc, s) => acc + (Number(s.amount) || 0), 0).toLocaleString('en-IN')}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>

            {/* 7. RECEIPT MODAL PREVIEW */}
            {selectedReceiptSale && (
                <ReceiptModal
                    open={!!selectedReceiptSale}
                    onClose={() => setSelectedReceiptSale(null)}
                    sale={selectedReceiptSale}
                    items={selectedReceiptItems}
                />
            )}

            {/* 8. STOCK ITEM INSPECTION & REORDER MODAL */}
            <Dialog open={!!selectedStockItem} onOpenChange={(open) => !open && setSelectedStockItem(null)}>
                <DialogContent className="sm:max-w-md bg-white border border-slate-200 shadow-2xl p-0 overflow-hidden rounded-3xl text-slate-900">
                    {selectedStockItem && (
                        <div>
                            <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-amber-200 flex items-center justify-center text-amber-600">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg font-black text-slate-900">Stock Telemetry Review</DialogTitle>
                                    <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mt-0.5">
                                        FEFO Replenishment Recommended
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="flex items-center gap-3 p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl">
                                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-900 text-sm truncate">{selectedStockItem.item_name}</p>
                                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                                            {selectedStockItem.batch_number && (
                                                <span className="font-mono">Batch: {selectedStockItem.batch_number}</span>
                                            )}
                                            {selectedStockItem.expiry_date && (
                                                <span>• Exp: {selectedStockItem.expiry_date}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Stock</p>
                                        <p className="text-2xl font-black text-amber-600 mt-1">{(selectedStockItem as any).total_quantity || selectedStockItem.quantity || 0}</p>
                                        <p className="text-[10px] text-slate-400">units</p>
                                    </div>
                                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Threshold</p>
                                        <p className="text-2xl font-black text-slate-900 mt-1">{selectedStockItem.threshold || 10}</p>
                                        <p className="text-[10px] text-slate-400">safety min</p>
                                    </div>
                                    <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-100 text-center">
                                        <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Deficit</p>
                                        <p className="text-2xl font-black text-rose-600 mt-1">
                                            {Math.max(0, (selectedStockItem.threshold || 10) - ((selectedStockItem as any).total_quantity || selectedStockItem.quantity || 0))}
                                        </p>
                                        <p className="text-[10px] text-rose-400">units short</p>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase">
                                        <span>Current Buffer Level</span>
                                        <span className="text-amber-600">
                                            {Math.round((((selectedStockItem as any).total_quantity || selectedStockItem.quantity || 0) / (selectedStockItem.threshold || 10)) * 100)}% of buffer
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="h-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
                                            style={{
                                                width: `${Math.min(100, Math.round((((selectedStockItem as any).total_quantity || selectedStockItem.quantity || 0) / (selectedStockItem.threshold || 10)) * 100))}%`
                                            }}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedStockItem(null);
                                        handleFastReorder(selectedStockItem.id);
                                    }}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 text-xs flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <Zap className="w-4 h-4" />
                                    Dispatch Reorder via Inventory Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
