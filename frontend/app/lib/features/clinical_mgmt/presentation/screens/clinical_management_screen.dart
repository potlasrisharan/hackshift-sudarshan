import "package:flutter/material.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";

class ClinicalManagementScreen extends StatefulWidget {
  const ClinicalManagementScreen({super.key});

  @override
  State<ClinicalManagementScreen> createState() => _ClinicalManagementScreenState();
}

class _ClinicalManagementScreenState extends State<ClinicalManagementScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<Map<String, dynamic>> _inventory = const [
    {"item": "Yograj Guggulu 500mg", "batch": "BAT-2026-Y89", "expiry": "11/2026", "stock": 420, "status": "EXPIRING IN 30D", "warn": true},
    {"item": "Dashamularishta 450ml", "batch": "BAT-2026-D12", "expiry": "04/2028", "stock": 95, "status": "OPTIMAL", "warn": false},
    {"item": "Shatavari Churna 100g", "batch": "BAT-2026-S44", "expiry": "09/2027", "stock": 310, "status": "OPTIMAL", "warn": false},
    {"item": "Triphala Churna 250g", "batch": "BAT-2026-T01", "expiry": "12/2026", "stock": 38, "status": "LOW STOCK", "warn": true},
  ];

  final List<Map<String, dynamic>> _shifts = const [
    {"staff": "Dr. Ananya Sharma", "role": "Senior Ayurvedic Clinician", "shift": "08:00 - 16:00", "status": "ON DUTY"},
    {"staff": "Nurse Priya Nair", "role": "Triage & Emergency Lead", "shift": "08:00 - 16:00", "status": "ON DUTY"},
    {"staff": "Pharmacist Rajesh", "role": "Dispensary & FEFO Head", "shift": "10:00 - 18:00", "status": "ON DUTY"},
    {"staff": "Dr. Vikas Verma", "role": "Consultant Physician", "shift": "16:00 - 00:00", "status": "UPCOMING"},
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffoldShell(
      title: AppStrings.clinicalManagement,
      subtitle: "Operations, FEFO & Fast POS",
      child: Column(
        children: [
          Container(
            color: AppColors.surface,
            child: TabBar(
              controller: _tabController,
              indicatorColor: AppColors.primaryLight,
              labelColor: AppColors.primaryLight,
              unselectedLabelColor: AppColors.textSecondary,
              tabs: const [
                Tab(text: "Inventory FEFO"),
                Tab(text: "Quick POS"),
                Tab(text: "Staff Shifts"),
              ],
            ),
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildInventoryTab(),
                _buildPosTab(),
                _buildShiftsTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInventoryTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _inventory.length,
      itemBuilder: (context, index) {
        final item = _inventory[index];
        final bool isWarning = item["warn"] as bool;

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isWarning ? AppColors.warning.withValues(alpha: 0.5) : AppColors.surfaceElevated,
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item["item"],
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      "Batch ${item['batch']} · Exp: ${item['expiry']}",
                      style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    "${item['stock']} units",
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 2),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: (isWarning ? AppColors.warning : AppColors.success).withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      item["status"],
                      style: TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.w800,
                        color: isWarning ? AppColors.warning : AppColors.success,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildPosTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.surfaceElevated),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Cashless POS Terminal",
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                ),
                const SizedBox(height: 12),
                _buildReceiptRow("Patient Token", "T-102 (Ramesh Chandra)"),
                _buildReceiptRow("Prescribed Items", "Yograj Guggulu + Dashamularishta"),
                _buildReceiptRow("Ayushman PM-JAY Coverage", "100% Cashless Subsidy"),
                const Divider(color: AppColors.surfaceElevated, height: 24),
                _buildReceiptRow("Total Ledger Entry", "₹40,000 paise (₹400.00)", isBold: true),
                _buildReceiptRow("Patient Payable", "₹0.00", isBold: true, highlightColor: AppColors.success),
              ],
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.ayushGreen,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              icon: const Icon(Icons.print_rounded, color: Colors.white),
              label: const FittedBox(
                fit: BoxFit.scaleDown,
                child: Text("Generate ABDM Claim & Print Invoice", style: TextStyle(fontWeight: FontWeight.w700)),
              ),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    backgroundColor: AppColors.success,
                    content: Text("Double-entry ledger posted to D1. Dispensing receipt printed."),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReceiptRow(String label, String value, {bool isBold = false, Color? highlightColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
            ),
          ),
          const SizedBox(width: 8),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: TextStyle(
                fontSize: 13,
                fontWeight: isBold ? FontWeight.w700 : FontWeight.w500,
                color: highlightColor ?? AppColors.textPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildShiftsTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _shifts.length,
      itemBuilder: (context, index) {
        final shift = _shifts[index];
        final bool isOnDuty = shift["status"] == "ON DUTY";

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.surfaceElevated),
          ),
          child: Row(
            children: [
              CircleAvatar(
                backgroundColor: isOnDuty ? AppColors.success.withValues(alpha: 0.2) : AppColors.surfaceElevated,
                child: Icon(
                  Icons.person,
                  color: isOnDuty ? AppColors.success : AppColors.textMuted,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      shift["staff"],
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                    ),
                    Text(
                      "${shift['role']} · ${shift['shift']}",
                      style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: (isOnDuty ? AppColors.success : AppColors.surfaceElevated).withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  shift["status"],
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: isOnDuty ? AppColors.success : AppColors.textSecondary,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
