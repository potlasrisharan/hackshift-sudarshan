import "package:flutter/material.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";

class ClinicalManagementScreen extends StatefulWidget {
  final String? clinicId;
  final String? clinicName;
  final String? occupancy;
  final String? status;

  const ClinicalManagementScreen({
    super.key,
    this.clinicId,
    this.clinicName,
    this.occupancy,
    this.status,
  });

  @override
  State<ClinicalManagementScreen> createState() => _ClinicalManagementScreenState();
}

class _ClinicalManagementScreenState extends State<ClinicalManagementScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _barcodeController = TextEditingController();

  final List<Map<String, dynamic>> _inventory = [
    {
      "item": "Febuxostat 40mg",
      "batch": "BAT-2026-F40",
      "shelf": "Shelf A-12",
      "expiry": "11/2026",
      "daysLeft": 28,
      "stock": 420,
      "status": "EXPIRING IN 30D",
      "warn": true,
    },
    {
      "item": "Colchicine 0.5mg",
      "batch": "BAT-2026-C05",
      "shelf": "Shelf B-04",
      "expiry": "04/2028",
      "daysLeft": 560,
      "stock": 95,
      "status": "OPTIMAL",
      "warn": false,
    },
    {
      "item": "Metformin 500mg SR",
      "batch": "BAT-2026-M50",
      "shelf": "Shelf C-02",
      "expiry": "09/2027",
      "daysLeft": 340,
      "stock": 310,
      "status": "OPTIMAL",
      "warn": false,
    },
    {
      "item": "Pantoprazole 40mg",
      "batch": "BAT-2026-P40",
      "shelf": "Shelf A-03",
      "expiry": "12/2026",
      "daysLeft": 58,
      "stock": 38,
      "status": "LOW STOCK",
      "warn": true,
    },
  ];

  final List<Map<String, dynamic>> _shifts = const [
    {"staff": "Dr. Ananya Sharma", "role": "Senior Consultant Physician", "shift": "08:00 - 16:00", "status": "ON DUTY"},
    {"staff": "Nurse Priya Nair", "role": "Triage & Emergency Lead", "shift": "08:00 - 16:00", "status": "ON DUTY"},
    {"staff": "Pharmacist Rajesh", "role": "Dispensary & FEFO Head", "shift": "10:00 - 18:00", "status": "ON DUTY"},
    {"staff": "Dr. Vikas Verma", "role": "Consultant Physician", "shift": "16:00 - 00:00", "status": "UPCOMING"},
  ];

  final List<String> _scannedItems = [
    "Febuxostat 40mg (10 tabs)",
    "Colchicine 0.5mg (10 tabs)",
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _barcodeController.dispose();
    super.dispose();
  }

  void _simulateBarcodeScan() {
    setState(() {
      _scannedItems.add("Yograj Guggulu (BAT-2026-Y01 · Shelf Y-01)");
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        backgroundColor: AppColors.medicalTeal,
        content: Text("Barcode 8901234567890 Scanned: Yograj Guggulu added to POS Cart."),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final String activeClinicName = widget.clinicName ?? "AyuSetu North Satellite Clinic (OPD)";
    final String activeStatus = widget.status ?? "OPTIMAL";
    final bool isHighLoad = activeStatus == "HIGH LOAD";

    return AppScaffoldShell(
      isLight: true,
      title: AppStrings.clinicalManagement,
      subtitle: activeClinicName,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: const BoxDecoration(
              color: AppColors.clinicalCard,
              border: Border(bottom: BorderSide(color: AppColors.clinicalBorder, width: 1)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: AppColors.medicalTeal.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.hub_rounded, size: 16, color: AppColors.medicalTeal),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        activeClinicName,
                        style: const TextStyle(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w700,
                          color: AppColors.clinicalTextDark,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                      const Text(
                        "Linked to AyuSetu Central Hospital Network (HQ)",
                        style: TextStyle(
                          fontSize: 10.5,
                          color: AppColors.clinicalTextMuted,
                          fontWeight: FontWeight.w500,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2.5),
                  decoration: BoxDecoration(
                    color: isHighLoad ? const Color(0xFFFEE2E2) : const Color(0xFFDCFCE7),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    activeStatus,
                    style: TextStyle(
                      fontSize: 9.5,
                      fontWeight: FontWeight.w800,
                      color: isHighLoad ? const Color(0xFFDC2626) : const Color(0xFF16A34A),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Container(
            decoration: const BoxDecoration(
              color: AppColors.clinicalCard,
              border: Border(bottom: BorderSide(color: AppColors.clinicalBorder, width: 1)),
            ),
            child: TabBar(
              controller: _tabController,
              indicatorColor: AppColors.medicalTeal,
              labelColor: AppColors.medicalTeal,
              unselectedLabelColor: AppColors.clinicalTextMuted,
              labelStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
              unselectedLabelStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
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
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      children: [
        // FEFO Radar Status Banner
        Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFFFFBEB),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFFDE68A)),
          ),
          child: Row(
            children: [
              const Icon(Icons.radar_rounded, color: Color(0xFFD97706), size: 20),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text(
                      "FEFO Expiry Countdown Radar",
                      style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: Color(0xFF92400E)),
                    ),
                    Text(
                      "1 batch expiring within 30 days · First-Expiry First-Out auto-routed to OPD dispensing",
                      style: TextStyle(fontSize: 11, color: Color(0xFFB45309)),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        for (final item in _inventory) _buildInventoryCard(item),
      ],
    );
  }

  Widget _buildInventoryCard(Map<String, dynamic> item) {
    final bool isWarning = item["warn"] as bool;
    final int days = item["daysLeft"] as int;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.clinicalCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isWarning ? const Color(0xFFFDE68A) : AppColors.clinicalBorder,
          width: 1,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x060F172A),
            blurRadius: 4,
            offset: Offset(0, 1.5),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item["item"] as String,
                  style: const TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.clinicalTextDark,
                  ),
                ),
                const SizedBox(height: 3),
                Wrap(
                  spacing: 6,
                  runSpacing: 2,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        item["shelf"] as String? ?? "Shelf A",
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.clinicalTextSub),
                      ),
                    ),
                    Text(
                      "Batch ${item['batch']} · Exp: ${item['expiry']}",
                      style: const TextStyle(fontSize: 11, color: AppColors.clinicalTextMuted),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                "${item['stock']} units",
                style: const TextStyle(
                  fontSize: 13.5,
                  fontWeight: FontWeight.w700,
                  color: AppColors.clinicalTextDark,
                ),
              ),
              const SizedBox(height: 3),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: isWarning ? const Color(0xFFFEF3C7) : const Color(0xFFDCFCE7),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  "${days}d left · ${item['status']}",
                  style: TextStyle(
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                    color: isWarning ? const Color(0xFFD97706) : const Color(0xFF16A34A),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPosTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Barcode / Item Scanner Box
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.clinicalCard,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.clinicalBorder, width: 1),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x060F172A),
                  blurRadius: 6,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: const [
                        Icon(Icons.qr_code_scanner_rounded, color: AppColors.medicalTeal, size: 18),
                        SizedBox(width: 8),
                        Text(
                          "Fast Item / Barcode Scanner",
                          style: TextStyle(
                            fontSize: 13.5,
                            fontWeight: FontWeight.w700,
                            color: AppColors.clinicalTextDark,
                          ),
                        ),
                      ],
                    ),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.medicalTeal,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                      ),
                      icon: const Icon(Icons.barcode_reader, size: 14),
                      label: const Text("Scan Barcode", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
                      onPressed: _simulateBarcodeScan,
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  "Active Scanned Items (${_scannedItems.length})",
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.clinicalTextMuted),
                ),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: [
                    for (final s in _scannedItems)
                      Chip(
                        label: Text(s, style: const TextStyle(fontSize: 11, color: AppColors.clinicalTextDark)),
                        backgroundColor: AppColors.clinicalBg,
                        side: const BorderSide(color: AppColors.clinicalBorder),
                        padding: EdgeInsets.zero,
                        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          // Cashless POS Terminal Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.clinicalCard,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.clinicalBorder, width: 1),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x060F172A),
                  blurRadius: 6,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    Expanded(
                      child: Text(
                        "Cashless POS Terminal",
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: AppColors.clinicalTextDark,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    SizedBox(width: 8),
                    AyuSetuLogoBadge(height: 18),
                  ],
                ),
                const SizedBox(height: 12),
                _buildReceiptRow("Patient Token", "T-102 (Ramesh Chandra)"),
                _buildReceiptRow("Prescribed Items", "Febuxostat 40mg + Colchicine 0.5mg"),
                _buildReceiptRow("Ayushman PM-JAY Coverage", "100% Cashless Subsidy"),
                const Divider(color: AppColors.clinicalBorder, height: 20),
                _buildReceiptRow("Total Ledger Entry", "₹40,000 paise (₹400.00)", isBold: true),
                _buildReceiptRow("Patient Payable", "₹0.00", isBold: true, highlightColor: const Color(0xFF16A34A)),
              ],
            ),
          ),
          const SizedBox(height: 18),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.medicalTeal,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              icon: const Icon(Icons.print_rounded, color: Colors.white, size: 18),
              label: const FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(
                  "Generate ABDM Claim & Print Invoice",
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5),
                ),
              ),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    backgroundColor: AppColors.medicalTeal,
                    content: Text("Double-entry ledger posted to D1. Dispensing receipt printed."),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 12),
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
              style: const TextStyle(fontSize: 12.5, color: AppColors.clinicalTextSub),
            ),
          ),
          const SizedBox(width: 8),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: TextStyle(
                fontSize: 12.5,
                fontWeight: isBold ? FontWeight.w700 : FontWeight.w500,
                color: highlightColor ?? AppColors.clinicalTextDark,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildShiftsTab() {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      itemCount: _shifts.length,
      itemBuilder: (context, index) {
        final shift = _shifts[index];
        final bool isOnDuty = shift["status"] == "ON DUTY";

        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.clinicalCard,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.clinicalBorder, width: 1),
            boxShadow: const [
              BoxShadow(
                color: Color(0x060F172A),
                blurRadius: 4,
                offset: Offset(0, 1.5),
              ),
            ],
          ),
          child: Row(
            children: [
              CircleAvatar(
                backgroundColor: isOnDuty ? const Color(0xFFDCFCE7) : const Color(0xFFF1F5F9),
                child: Icon(
                  Icons.person,
                  color: isOnDuty ? const Color(0xFF16A34A) : AppColors.clinicalTextMuted,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      shift["staff"],
                      style: const TextStyle(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w700,
                        color: AppColors.clinicalTextDark,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      "${shift['role']} · ${shift['shift']}",
                      style: const TextStyle(fontSize: 11.5, color: AppColors.clinicalTextSub),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                decoration: BoxDecoration(
                  color: isOnDuty ? const Color(0xFFDCFCE7) : const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  shift["status"],
                  style: TextStyle(
                    fontSize: 9.5,
                    fontWeight: FontWeight.w800,
                    color: isOnDuty ? const Color(0xFF16A34A) : AppColors.clinicalTextMuted,
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
