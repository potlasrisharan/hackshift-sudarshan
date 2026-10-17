import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:go_router/go_router.dart";
import "package:kiosk_app/core/constants/app_colors.dart";
import "package:kiosk_app/features/intake/presentation/providers/intake_provider.dart";

class ConverseScreen extends ConsumerStatefulWidget {
  const ConverseScreen({super.key});

  @override
  ConsumerState<ConverseScreen> createState() => _ConverseScreenState();
}

class _ConverseScreenState extends ConsumerState<ConverseScreen> {
  final TextEditingController _textController = TextEditingController();

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(intakeProvider.notifier).sendPatientSpeech("Namaste doctor, mujhe ghutno mein dard hai.");
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(intakeProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "Step 2: Voice Interview",
          overflow: TextOverflow.ellipsis,
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.canPop() ? context.pop() : context.go("/identify"),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.document_scanner),
            tooltip: "Proceed to Document Scan",
            onPressed: () => context.push("/scan"),
          )
        ],
      ),
      body: Column(
        children: [
          if (state.redFlagTriggered)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
              color: AppColors.error,
              child: Row(
                children: const [
                  Icon(Icons.warning, color: Colors.white, size: 28),
                  SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      "EMERGENCY RED-FLAG INTERCEPTED (<150ms): Acute cardiac/chest pain symptom detected. Priority triage alerted.",
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ),
                ],
              ),
            ),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                const Text("Clinical Ontology: ", style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                const SizedBox(width: 8),
                ChoiceChip(
                  label: const Text("Hybrid (SOCRATES + Dashavidha)"),
                  selected: state.systemType == "HYBRID",
                  onSelected: (val) => ref.read(intakeProvider.notifier).setSystemType("HYBRID"),
                ),
                const SizedBox(width: 8),
                ChoiceChip(
                  label: const Text("Ayurvedic (Dashavidha)"),
                  selected: state.systemType == "AYURVEDIC",
                  onSelected: (val) => ref.read(intakeProvider.notifier).setSystemType("AYURVEDIC"),
                ),
                const SizedBox(width: 16),
                const Icon(Icons.record_voice_over, color: AppColors.primaryLight, size: 16),
                const SizedBox(width: 6),
                const Text("Sarvam Saaras v3", style: TextStyle(fontSize: 12, color: AppColors.primaryLight)),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: state.chatMessages.length,
              itemBuilder: (context, idx) {
                final m = state.chatMessages[idx];
                final isPatient = m["role"] == "patient";
                return Align(
                  alignment: isPatient ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 6),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    constraints: const BoxConstraints(maxWidth: 600),
                    decoration: BoxDecoration(
                      color: isPatient ? AppColors.primary : AppColors.surface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: isPatient ? AppColors.primaryLight : AppColors.surfaceElevated),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          isPatient ? "Patient (Voice/Touch)" : "AYUSETU Clinical Scribe",
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: isPatient ? Colors.white70 : AppColors.primaryLight,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(m["text"]!, style: const TextStyle(fontSize: 14, color: Colors.white)),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          if (state.currentOptions.isNotEmpty)
            Container(
              height: 48,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: state.currentOptions.length,
                separatorBuilder: (_, index) => const SizedBox(width: 8),
                itemBuilder: (context, idx) {
                  final opt = state.currentOptions[idx];
                  return ActionChip(
                    label: Text(opt, style: const TextStyle(fontSize: 12)),
                    onPressed: () {
                      ref.read(intakeProvider.notifier).sendPatientSpeech(opt);
                    },
                  );
                },
              ),
            ),
          const SizedBox(height: 6),
          SafeArea(
            top: false,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              color: AppColors.surface,
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _textController,
                      style: const TextStyle(fontSize: 13),
                      decoration: InputDecoration(
                        hintText: "Speak or type symptom...",
                        hintStyle: const TextStyle(fontSize: 12),
                        filled: true,
                        fillColor: AppColors.background,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                        prefixIcon: const Icon(Icons.mic, color: AppColors.primaryLight, size: 20),
                        suffixIcon: IconButton(
                          icon: const Icon(Icons.send, color: AppColors.primaryLight, size: 20),
                          onPressed: () {
                            if (_textController.text.trim().isNotEmpty) {
                              ref.read(intakeProvider.notifier).sendPatientSpeech(_textController.text);
                              _textController.clear();
                            }
                          },
                        ),
                      ),
                      onSubmitted: (val) {
                        if (val.trim().isNotEmpty) {
                          ref.read(intakeProvider.notifier).sendPatientSpeech(val);
                          _textController.clear();
                        }
                      },
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.ayushGreen,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                    ),
                    onPressed: () => context.push("/scan"),
                    child: const Text("Next ➔", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
