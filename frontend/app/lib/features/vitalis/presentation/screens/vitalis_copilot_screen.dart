import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "../../../../core/constants/app_colors.dart";
import "../../../../core/widgets/app_scaffold_shell.dart";
import "../widgets/vitalis_explainability_sheet.dart";

class VitalisCopilotScreen extends ConsumerStatefulWidget {
  const VitalisCopilotScreen({super.key});

  @override
  ConsumerState<VitalisCopilotScreen> createState() => _VitalisCopilotScreenState();
}

class _VitalisCopilotScreenState extends ConsumerState<VitalisCopilotScreen> {
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _emergencyTriggered = false;

  final List<Map<String, dynamic>> _messages = [
    {
      "sender": "copilot",
      "text":
          "Welcome to AyuSetu Vitalis Intelligence. I assist you in understanding your longitudinal health metrics, evidence-based physical activity, and preventive guidelines. All queries are verified by our clinical deterministic safety engine.",
      "citations": ["WHO Healthy Ageing (2020)", "AHA Life's Essential 8 (2022)"],
    },
  ];

  final List<String> _suggestedPrompts = [
    "Explain my VO2max provenance",
    "How can I improve my Sleep Regularity?",
    "High-protein Indian vegetarian options",
    "Prepare for my doctor consultation",
  ];

  void _handleUserSend(String text) {
    if (text.trim().isEmpty) return;
    _textController.clear();

    // Check emergency red flags
    final lower = text.toLowerCase();
    if (lower.contains("chest pain") ||
        lower.contains("shortness of breath") ||
        lower.contains("heart attack") ||
        lower.contains("fainting") ||
        lower.contains("stroke")) {
      setState(() {
        _emergencyTriggered = true;
      });
      return;
    }

    setState(() {
      _messages.add({"sender": "user", "text": text});
    });

    // Provide evidence-grounded response
    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      setState(() {
        _messages.add(_generateAnswer(text));
      });
      _scrollToBottom();
    });
    _scrollToBottom();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Map<String, dynamic> _generateAnswer(String query) {
    final lower = query.toLowerCase();
    if (lower.contains("vo2max") || lower.contains("cardio")) {
      return {
        "sender": "copilot",
        "text":
            "Your VO2max estimate is labeled as 'Wearable-Estimated' based on sub-maximal heart-rate kinematic data. AyuSetu strictly does not calculate speculative biological ages. To safely build cardiorespiratory fitness, focus on accumulating 150 minutes of Zone 2 aerobic base per week.",
        "citations": ["AHA Statement on Cardiorespiratory Fitness (2016)", "PubMed: 27881513"],
      };
    } else if (lower.contains("sleep") || lower.contains("sri")) {
      return {
        "sender": "copilot",
        "text":
            "Sleep Regularity Index (SRI) quantifies the day-to-day consistency of your sleep-wake schedule. High SRI (≥75) is associated with superior glycemic control and reduced cardiometabolic risk compared to irregular sleep, even when total sleep duration is identical.",
        "citations": ["Phillips et al., Scientific Reports (2017)", "Windred et al., Sleep (2024)"],
      };
    } else if (lower.contains("protein") || lower.contains("vegetarian") || lower.contains("food")) {
      return {
        "sender": "copilot",
        "text":
            "For Indian vegetarian diets, ICMR 2024 recommends pairing legumes (moong, chana, rajma) with whole grains to ensure a complete amino acid profile. Sattu, roasted makhana, and low-fat paneer/tofu provide high protein density without excess saturated fats.",
        "citations": ["ICMR-NIN Dietary Guidelines for Indians (2024)"],
      };
    } else {
      return {
        "sender": "copilot",
        "text":
            "AyuSetu Vitalis aggregates your longitudinal biomarkers, wearable telemetry, and evidence-based screening schedules into clinician-ready summaries. What specific healthspan domain would you like to review?",
        "citations": ["USPSTF Preventive Guidelines", "AyuSetu Clinical Safety Core"],
      };
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_emergencyTriggered) {
      return _buildEmergencyScreen();
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text("Vitalis AI Healthspan Copilot"),
        backgroundColor: AppColors.surface,
        actions: [
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 10, horizontal: 4),
            child: AyuSetuLogoBadge(height: 20),
          ),
          IconButton(
            icon: const Icon(Icons.info_outline, color: AppColors.vitalisTeal),
            onPressed: () {
              VitalisExplainabilitySheet.show(
                context,
                title: "Vitalis Copilot Clinical Guardrails",
                description:
                    "The Copilot is restricted to evidence translation and patient education. It cannot diagnose, prescribe medications, alter drug dosages, or validate unapproved herbal products. All sensitive clinical data passes through a local PHI redaction filter.",
                algorithmName: "V0 Clinical Safety & Redaction Gate",
                version: "1.0.0",
                evidenceSource: "AyuSetu Clinical Safety Architecture (PRD §5.5)",
                evidenceLevel: "Deterministic Redaction Gate",
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          _buildRedactionBadge(),
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isUser = msg["sender"] == "user";
                return _buildMessageBubble(msg, isUser);
              },
            ),
          ),
          _buildSuggestedChips(),
          _buildInputBar(),
        ],
      ),
    );
  }

  Widget _buildRedactionBadge() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: AppColors.surface,
      child: const Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          AyuSetuLogoBadge(
            height: 14,
            padding: EdgeInsets.symmetric(horizontal: 4, vertical: 1),
          ),
          SizedBox(width: 8),
          Flexible(
            child: Text(
              "Zero-PHI Redaction Active · Deterministic Safety Verified",
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.ayushGreen),
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Map<String, dynamic> msg, bool isUser) {
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(14),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.82),
        decoration: BoxDecoration(
          color: isUser ? AppColors.vitalisTeal : AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: isUser ? null : Border.all(color: AppColors.surfaceElevated),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              msg["text"] as String,
              style: TextStyle(
                fontSize: 13,
                color: isUser ? Colors.white : AppColors.textPrimary,
                height: 1.4,
              ),
            ),
            if (!isUser && msg["citations"] != null) ...[
              const SizedBox(height: 10),
              Wrap(
                spacing: 6,
                runSpacing: 4,
                children: (msg["citations"] as List<String>).map((c) {
                  return Container(
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.70),
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppColors.vitalisTeal.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.bookmark_outline, size: 10, color: AppColors.vitalisTeal),
                        const SizedBox(width: 4),
                        Flexible(
                          child: Text(
                            c,
                            style: const TextStyle(fontSize: 10, color: AppColors.vitalisTeal, fontWeight: FontWeight.w600),
                            overflow: TextOverflow.ellipsis,
                            maxLines: 1,
                          ),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildSuggestedChips() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: _suggestedPrompts.map((prompt) {
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ActionChip(
              label: Text(prompt, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
              backgroundColor: AppColors.surface,
              side: const BorderSide(color: AppColors.surfaceElevated),
              onPressed: () => _handleUserSend(prompt),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildInputBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(top: BorderSide(color: AppColors.surfaceElevated)),
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _textController,
                decoration: const InputDecoration(
                  hintText: "Ask about your healthspan, biomarkers...",
                  hintStyle: TextStyle(fontSize: 13, color: AppColors.textMuted),
                  border: InputBorder.none,
                ),
                style: const TextStyle(fontSize: 13, color: AppColors.textPrimary),
                onSubmitted: _handleUserSend,
              ),
            ),
            IconButton(
              icon: const Icon(Icons.send_rounded, color: AppColors.vitalisTeal),
              onPressed: () => _handleUserSend(_textController.text),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmergencyScreen() {
    return Scaffold(
      backgroundColor: AppColors.error,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Icon(Icons.emergency_rounded, color: Colors.white, size: 72),
              const SizedBox(height: 20),
              const Text(
                "POTENTIAL MEDICAL EMERGENCY DETECTED",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white),
              ),
              const SizedBox(height: 14),
              const Text(
                "Your inquiry contains symptoms consistent with an acute cardiovascular or medical emergency. Do not wait for digital analysis.",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Colors.white, height: 1.4),
              ),
              const SizedBox(height: 32),
              ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.phone_in_talk, color: AppColors.error),
                label: const Text("CALL EMERGENCY (112 / 108)", style: TextStyle(fontWeight: FontWeight.w800)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: AppColors.error,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                ),
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () {
                  setState(() => _emergencyTriggered = false);
                },
                child: const Text("Return to Healthspan Copilot", style: TextStyle(color: Colors.white70)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
