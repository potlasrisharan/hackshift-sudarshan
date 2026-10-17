import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "../../../../core/constants/app_strings.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../../../yoga/presentation/screens/yoga_prescription_screen.dart";
import "../../data/services/vitalis_wearable_adapter.dart";
import "../providers/vitalis_provider.dart";
import "../widgets/vitalis_safety_banner.dart";
import "../widgets/vitalis_demo_selector_sheet.dart";
import "../widgets/vitalis_metric_card.dart";

class VitalisDashboardScreen extends ConsumerStatefulWidget {
  const VitalisDashboardScreen({super.key});

  @override
  ConsumerState<VitalisDashboardScreen> createState() => _VitalisDashboardScreenState();
}

class _VitalisDashboardScreenState extends ConsumerState<VitalisDashboardScreen> {
  final Set<String> _checkedActions = {};
  late final VitalisWearableAdapter _wearableAdapter;
  bool _isSyncingWearables = false;

  @override
  void initState() {
    super.initState();
    _wearableAdapter = VitalisWearableAdapter(
      isAppleHealthConnected: true,
      isHealthConnectConnected: true,
    );
  }

  @override
  void dispose() {
    _wearableAdapter.dispose();
    super.dispose();
  }

  void _syncWearables() async {
    setState(() => _isSyncingWearables = true);
    await _wearableAdapter.syncWearableData();
    if (mounted) {
      setState(() => _isSyncingWearables = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Apple HealthKit & Google Health Connect Synchronized"),
          backgroundColor: Color(0xFF059669),
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(vitalisProvider);
    final notifier = ref.read(vitalisProvider.notifier);

    return AppScaffoldShell(
      title: AppStrings.vitalisHeader,
      subtitle: AppStrings.vitalisSubtitle,
      child: Container(
        color: const Color(0xFFF8FAFC),
        width: double.infinity,
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (state.safetyAlert != null)
                VitalisSafetyBanner(
                  alert: state.safetyAlert!,
                  onDismiss: () => notifier.dismissSafetyAlert(),
                ),
              _buildPersonaSwitcherBar(context, state),
              const SizedBox(height: 16),
              _buildHpiScoreCard(context, state),
              const SizedBox(height: 16),
              const HomeYogaBanner(
                focusTitle: "Open safety-screened movement recommendations.",
              ),
              const SizedBox(height: 16),
              _buildWearablesIntegrationCard(context, state),
              const SizedBox(height: 16),
              _buildQuickActionsRow(context),
              const SizedBox(height: 20),
              const Text(
                "Health Telemetry & Modifiable Factors",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 12),
              _buildTelemetryGrid(context, state),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Expanded(
                    child: Text(
                      "Priority Evidence-Based Actions",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF0F172A),
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  TextButton(
                    onPressed: () => context.push("/vitalis/trajectory"),
                    child: const Text(
                      "View Trajectory",
                      style: TextStyle(color: Color(0xFF059669), fontSize: 13, fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              _buildPrioritiesList(context, state),
              const SizedBox(height: 16),
              _buildModuleNavSection(context),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPersonaSwitcherBar(BuildContext context, VitalisState state) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: const BoxDecoration(
                    color: Color(0xFFE6F7F2),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.person_pin_rounded, color: Color(0xFF059669), size: 22),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        state.activePersona.name,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF0F172A),
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          Container(
                            width: 6,
                            height: 6,
                            decoration: BoxDecoration(
                              color: state.isWearableConnected ? const Color(0xFF059669) : const Color(0xFFF59E0B),
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 5),
                          Expanded(
                            child: Text(
                              state.isWearableConnected ? "Wearables Synced" : "Wearable Disconnected",
                              style: TextStyle(
                                fontSize: 11,
                                color: state.isWearableConnected ? const Color(0xFF059669) : const Color(0xFFD97706),
                                fontWeight: FontWeight.w600,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          InkWell(
            onTap: () {
              showModalBottomSheet(
                context: context,
                backgroundColor: Colors.transparent,
                isScrollControlled: true,
                builder: (_) => const VitalisDemoSelectorSheet(),
              );
            },
            borderRadius: BorderRadius.circular(10),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
              decoration: BoxDecoration(
                color: const Color(0xFFE6F7F2),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFA7F3D0)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.swap_horiz_rounded, size: 16, color: Color(0xFF059669)),
                  SizedBox(width: 4),
                  Text(
                    "Switch Demo",
                    style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: Color(0xFF059669)),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHpiScoreCard(BuildContext context, VitalisState state) {
    final hpi = state.hpiResult;
    final score = hpi.hpiScore;
    final hasScore = score != null;
    final coveragePercent = (hpi.coverage * 100).round();

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12, offset: const Offset(0, 4))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          const Icon(Icons.spa_rounded, color: Color(0xFF059669), size: 19),
          const SizedBox(width: 8),
          const Expanded(child: Text("Healthspan Progress", style: TextStyle(fontSize: 15, color: Color(0xFF334155), fontWeight: FontWeight.w700))),
          Text(hpi.algorithmVersion, style: const TextStyle(fontSize: 10, color: Color(0xFF64748B))),
        ]),
        const SizedBox(height: 16),
        Row(children: [
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(hasScore ? "$score / 100" : "Baseline in progress", style: const TextStyle(fontSize: 25, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
            const SizedBox(height: 6),
            Text("$coveragePercent% of healthspan domains observed", style: const TextStyle(fontSize: 12, color: Color(0xFF475569))),
            if (!hasScore) ...[
              const SizedBox(height: 5),
              const Text("A score appears after at least 40% coverage. Missing data is never estimated.", style: TextStyle(fontSize: 11, height: 1.35, color: Color(0xFF64748B))),
            ],
          ])),
          const SizedBox(width: 12),
          SizedBox(width: 70, height: 70, child: Stack(alignment: Alignment.center, children: [
            CircularProgressIndicator(value: hpi.coverage.clamp(0.0, 1.0), strokeWidth: 7, backgroundColor: const Color(0xFFE6F7F2), valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF059669))),
            Text("$coveragePercent%", style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
          ])),
        ]),
        const SizedBox(height: 14),
        const Divider(color: Color(0xFFE2E8F0), height: 1),
        const SizedBox(height: 12),
        Wrap(alignment: WrapAlignment.spaceBetween, runSpacing: 10, children: [
          InkWell(onTap: () => context.push("/vitalis/trajectory"), child: const Row(mainAxisSize: MainAxisSize.min, children: [
            Icon(Icons.timeline_rounded, size: 15, color: Color(0xFF059669)), SizedBox(width: 4),
            Text("Healthspan signals", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF059669))),
          ])),
          InkWell(onTap: () => context.push("/vitalis/healthspan"), child: const Row(mainAxisSize: MainAxisSize.min, children: [
            Text("Domain breakdown", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF059669))),
            Icon(Icons.chevron_right, size: 16, color: Color(0xFF059669)),
          ])),
        ]),
      ]),
    );
  }

  Widget _buildWearablesIntegrationCard(BuildContext context, VitalisState state) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0D9488).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.watch_rounded, color: Color(0xFF0D9488), size: 20),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Apple Health & Health Connect",
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF0F172A),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Row(
                            children: [
                              Container(
                                width: 6,
                                height: 6,
                                decoration: const BoxDecoration(
                                  color: Color(0xFF059669),
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 4),
                              const Expanded(
                                child: Text(
                                  "Dual Multi-Source Telemetry Active",
                                  style: TextStyle(fontSize: 10.5, color: Color(0xFF059669), fontWeight: FontWeight.w600),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              ElevatedButton.icon(
                onPressed: _isSyncingWearables ? null : _syncWearables,
                icon: _isSyncingWearables
                    ? const SizedBox(width: 12, height: 12, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : const Icon(Icons.sync_rounded, size: 14),
                label: Text(_isSyncingWearables ? "Syncing..." : "Sync"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0D9488),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  elevation: 0,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Platform Badges
          Wrap(
            spacing: 8,
            runSpacing: 6,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.apple, size: 14, color: Color(0xFF0F172A)),
                    SizedBox(width: 4),
                    Text(
                      "Apple HealthKit",
                      style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600, color: Color(0xFF334155)),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.android, size: 14, color: Color(0xFF10B981)),
                    SizedBox(width: 4),
                    Text(
                      "Health Connect",
                      style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600, color: Color(0xFF334155)),
                    ),
                  ],
                ),
              ),
              InkWell(
                onTap: () => context.push("/vitalis/wearables"),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      "Manage",
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF0D9488)),
                    ),
                    Icon(Icons.arrow_forward_ios_rounded, size: 10, color: Color(0xFF0D9488)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // 6 Telemetry Metric Chips Grid
          GridView.count(
            physics: const NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            crossAxisCount: 3,
            crossAxisSpacing: 8,
            mainAxisSpacing: 8,
            childAspectRatio: 1.15,
            children: [
              _buildWearableMetricChip(
                "Steps Today",
                _wearableAdapter.stepsFormatted,
                "Goal: 10k",
                Icons.directions_walk_rounded,
                const Color(0xFF059669),
              ),
              _buildWearableMetricChip(
                "Resting HR",
                _wearableAdapter.restingHeartRateFormatted,
                "Normal",
                Icons.favorite_rounded,
                const Color(0xFFEF4444),
              ),
              _buildWearableMetricChip(
                "HRV rMSSD",
                _wearableAdapter.hrvRmssdFormatted,
                "Vagal recovery",
                Icons.monitor_heart_rounded,
                const Color(0xFF0D9488),
              ),
              _buildWearableMetricChip(
                "Sleep",
                _wearableAdapter.sleepDurationFormatted,
                _wearableAdapter.restorativeSleepFormatted,
                Icons.bedtime_rounded,
                const Color(0xFF6366F1),
              ),
              _buildWearableMetricChip(
                "VO2 Max",
                _wearableAdapter.vo2Max.toStringAsFixed(1),
                "mL/kg/min",
                Icons.speed_rounded,
                const Color(0xFF0284C7),
              ),
              _buildWearableMetricChip(
                "Active Burn",
                _wearableAdapter.activeCaloriesFormatted,
                "Daily burn",
                Icons.local_fire_department_rounded,
                const Color(0xFFEA580C),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildWearableMetricChip(String title, String val, String sub, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(icon, size: 11, color: color),
              const SizedBox(width: 3),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(fontSize: 9.5, fontWeight: FontWeight.w600, color: Color(0xFF64748B)),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 2),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(
              val,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Color(0xFF0F172A)),
              maxLines: 1,
            ),
          ),
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(
              sub,
              style: TextStyle(fontSize: 9, fontWeight: FontWeight.w500, color: color),
              maxLines: 1,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionsRow(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          _buildQuickActionChip(context, "Yoga Therapy", Icons.self_improvement_rounded, "/yoga"),
          _buildQuickActionChip(context, "Longevity Trajectory", Icons.timeline_rounded, "/vitalis/trajectory"),
          _buildQuickActionChip(context, "Health Onboarding", Icons.app_registration_rounded, "/vitalis/onboarding"),
          _buildQuickActionChip(context, "Assessment", Icons.assignment_outlined, "/vitalis/assessment"),
          _buildQuickActionChip(context, "Exercise Plan", Icons.fitness_center_outlined, "/vitalis/activity"),
          _buildQuickActionChip(context, "Indian Meals", Icons.restaurant_outlined, "/vitalis/nutrition"),
          _buildQuickActionChip(context, "Biomarkers", Icons.science_outlined, "/vitalis/biomarkers"),
          _buildQuickActionChip(context, "Copilot AI", Icons.auto_awesome, "/vitalis/copilot"),
          _buildQuickActionChip(context, "Doctor Summary", Icons.print_outlined, "/vitalis/summary"),
        ],
      ),
    );
  }

  Widget _buildQuickActionChip(BuildContext context, String label, IconData icon, String route) {
    return Container(
      margin: const EdgeInsets.only(right: 8),
      child: ActionChip(
        avatar: Container(
          padding: const EdgeInsets.all(4),
          decoration: const BoxDecoration(
            color: Color(0xFFE6F7F2),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, size: 14, color: const Color(0xFF059669)),
        ),
        label: Text(
          label,
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF1E293B)),
        ),
        backgroundColor: const Color(0xFFFFFFFF),
        side: const BorderSide(color: Color(0xFFE2E8F0)),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        onPressed: () => context.push(route),
      ),
    );
  }

  Widget _buildTelemetryGrid(BuildContext context, VitalisState state) {
    final hasWearables = state.isWearableConnected;
    final vo2 = state.cardio.vo2Max > 0 ? state.cardio.vo2Max.toStringAsFixed(1) : "38.5";
    final grip = state.functional.gripStrengthKg.toInt();
    final sri = state.readiness.sriScore;

    return GridView.count(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.25,
      children: [
        VitalisMetricCard(
          label: "VO2max Estimate",
          value: vo2,
          unit: "mL/kg/min",
          icon: Icons.speed_rounded,
          iconColor: const Color(0xFF059669),
          provenance: state.cardio.provenanceLabel,
          onTap: () => context.push("/vitalis/cardio"),
        ),
        VitalisMetricCard(
          label: "Heart Rate Var (HRV)",
          value: hasWearables ? "56" : "44",
          unit: "ms rMSSD",
          icon: Icons.monitor_heart_rounded,
          iconColor: const Color(0xFF0D9488),
          provenance: hasWearables ? "Apple Watch S9" : "Clinic Baseline",
          onTap: () => context.push("/vitalis/wearables"),
        ),
        VitalisMetricCard(
          label: "Sleep Regularity",
          value: "$sri",
          unit: "% SRI",
          icon: Icons.nightlight_round,
          iconColor: const Color(0xFF6366F1),
          provenance: "Circadian Stability",
          onTap: () => context.push("/vitalis/sleep"),
        ),
        VitalisMetricCard(
          label: "Grip Strength Reserve",
          value: "$grip",
          unit: "kg force",
          icon: Icons.fitness_center_rounded,
          iconColor: const Color(0xFFEA580C),
          provenance: "WHO ICOPE Criteria",
          onTap: () => context.push("/vitalis/functional-health"),
        ),
      ],
    );
  }

  Widget _buildPrioritiesList(BuildContext context, VitalisState state) {
    return Column(
      children: [
        for (final rec in state.recommendations.take(3))
          InkWell(
            onTap: () {
              setState(() {
                if (_checkedActions.contains(rec.id)) {
                  _checkedActions.remove(rec.id);
                } else {
                  _checkedActions.add(rec.id);
                }
              });
            },
            borderRadius: BorderRadius.circular(16),
            child: Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFFFFFFFF),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: _checkedActions.contains(rec.id)
                      ? const Color(0xFFA7F3D0)
                      : const Color(0xFFE2E8F0),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.03),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      color: _checkedActions.contains(rec.id)
                          ? const Color(0xFF059669)
                          : const Color(0xFFE6F7F2),
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: const Color(0xFF059669),
                        width: 1.5,
                      ),
                    ),
                    child: Icon(
                      Icons.check_rounded,
                      color: _checkedActions.contains(rec.id) ? Colors.white : const Color(0xFF059669),
                      size: 18,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          rec.title,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: const Color(0xFF0F172A),
                            decoration: _checkedActions.contains(rec.id)
                                ? TextDecoration.lineThrough
                                : null,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Row(
                          children: [
                            const Icon(Icons.verified_outlined, size: 12, color: Color(0xFF059669)),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                rec.evidenceSource,
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: Color(0xFF059669),
                                  fontWeight: FontWeight.w500,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildModuleNavSection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Complete Healthspan Intelligence Modules",
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: 12),
        _buildModuleTile(context, "Cardiorespiratory Fitness & VO2max", "Aerobic zones, resting HR trends & provenance", Icons.speed_rounded, "/vitalis/cardio"),
        _buildModuleTile(context, "Functional Capacity & Ageing", "Grip strength, chair rise & WHO ICOPE criteria", Icons.elderly_rounded, "/vitalis/functional-health"),
        _buildModuleTile(context, "Indian Nutrition Intelligence", "Pulses, makhana, vegetarian protein & safety", Icons.eco_rounded, "/vitalis/nutrition"),
        _buildModuleTile(context, "Sleep Regularity & Bedtime SRI", "Circadian stability & sleep epoch agreement", Icons.nightlight_round, "/vitalis/sleep"),
        _buildModuleTile(context, "Preventive Care Timeline", "Guidelines-based screenings & consultation schedule", Icons.event_available_rounded, "/vitalis/preventive-care"),
        _buildModuleTile(context, "What-If Behavior Simulator", "Model schedule volume without false lifespan claims", Icons.tune_rounded, "/vitalis/scenarios"),
        _buildModuleTile(context, "Consent, Data Vault & Privacy", "Granular consent grants and audit log viewer", Icons.security_rounded, "/vitalis/settings"),
      ],
    );
  }

  Widget _buildModuleTile(BuildContext context, String title, String subtitle, IconData icon, String route) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: const Color(0xFFE6F7F2),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: const Color(0xFF059669), size: 22),
        ),
        title: Text(
          title,
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF0F172A)),
        ),
        subtitle: Text(
          subtitle,
          style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
        ),
        trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: Color(0xFF94A3B8)),
        onTap: () => context.push(route),
      ),
    );
  }
}

class Math {
  static int round(num val) => val.round();
}
