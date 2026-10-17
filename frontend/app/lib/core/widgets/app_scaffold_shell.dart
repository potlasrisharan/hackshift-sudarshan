import "package:flutter/material.dart";
import "package:go_router/go_router.dart";
import "../constants/app_colors.dart";

class AppScaffoldShell extends StatelessWidget {
  final Widget child;
  final String title;
  final String? subtitle;
  final List<Widget>? actions;

  const AppScaffoldShell({
    super.key,
    required this.child,
    required this.title,
    this.subtitle,
    this.actions,
  });

  @override
  Widget build(BuildContext context) {
    String currentRoute = "/";
    try {
      currentRoute = GoRouterState.of(context).uri.toString();
    } catch (_) {
      currentRoute = "/";
    }

    bool canPop = false;
    try {
      canPop = context.canPop();
    } catch (_) {
      try {
        canPop = Navigator.canPop(context);
      } catch (_) {
        canPop = false;
      }
    }

    return Scaffold(
      appBar: AppBar(
        leading: canPop
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded,
                    color: AppColors.textPrimary),
                tooltip: "Back",
                onPressed: () {
                  try {
                    if (context.canPop()) {
                      context.pop();
                      return;
                    }
                  } catch (_) {
                    if (Navigator.canPop(context)) {
                      Navigator.pop(context);
                      return;
                    }
                  }
                  try {
                    context.go("/");
                  } catch (_) {}
                },
              )
            : IconButton(
                icon: const Icon(Icons.grid_view_rounded,
                    color: AppColors.textSecondary),
                tooltip: "All Portals",
                onPressed: () {
                  try {
                    context.go("/");
                  } catch (_) {}
                },
              ),
        title: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: AppColors.textPrimary,
              ),
            ),
            if (subtitle != null)
              Text(
                subtitle!,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.primaryLight,
                  fontWeight: FontWeight.w500,
                ),
              ),
          ],
        ),
        actions: actions ??
            [
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Image.asset(
                    "assets/images/ayusetu_logo.png",
                    height: 22,
                    fit: BoxFit.contain,
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.apps_rounded, color: AppColors.textSecondary),
                tooltip: "Portals",
                onPressed: () => context.go("/"),
              ),
            ],
      ),
      body: SafeArea(child: child),
      bottomNavigationBar: _buildBottomNav(context, currentRoute),
    );
  }

  Widget? _buildBottomNav(BuildContext context, String currentRoute) {
    if (currentRoute == "/") return null;

    final isClinical = currentRoute.startsWith("/doctor") ||
        currentRoute.startsWith("/nurse") ||
        currentRoute.startsWith("/hq") ||
        currentRoute.startsWith("/clinical");

    final isWellness = currentRoute.startsWith("/yoga") ||
        currentRoute.startsWith("/longevity") ||
        currentRoute.startsWith("/womens-health") ||
        currentRoute.startsWith("/her");

    if (isClinical) {
      int currentIndex = 0;
      if (currentRoute.startsWith("/nurse")) currentIndex = 1;
      if (currentRoute.startsWith("/hq")) currentIndex = 2;
      if (currentRoute.startsWith("/clinical")) currentIndex = 3;

      return NavigationBar(
        selectedIndex: currentIndex,
        onDestinationSelected: (idx) {
          switch (idx) {
            case 0:
              context.go("/doctor");
              break;
            case 1:
              context.go("/nurse");
              break;
            case 2:
              context.go("/hq");
              break;
            case 3:
              context.go("/clinical");
              break;
          }
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.medical_services_outlined),
            selectedIcon: Icon(Icons.medical_services),
            label: "Doctor",
          ),
          NavigationDestination(
            icon: Icon(Icons.local_hospital_outlined),
            selectedIcon: Icon(Icons.local_hospital),
            label: "Nurse",
          ),
          NavigationDestination(
            icon: Icon(Icons.analytics_outlined),
            selectedIcon: Icon(Icons.analytics),
            label: "HQ",
          ),
          NavigationDestination(
            icon: Icon(Icons.inventory_2_outlined),
            selectedIcon: Icon(Icons.inventory_2),
            label: "Operations",
          ),
        ],
      );
    }

    if (isWellness) {
      int currentIndex = 0;
      if (currentRoute.startsWith("/longevity")) currentIndex = 1;
      if (currentRoute.startsWith("/womens-health") || currentRoute.startsWith("/her")) currentIndex = 2;

      return NavigationBar(
        selectedIndex: currentIndex,
        onDestinationSelected: (idx) {
          switch (idx) {
            case 0:
              context.go("/yoga");
              break;
            case 1:
              context.go("/longevity");
              break;
            case 2:
              context.go("/her");
              break;
          }
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.self_improvement_outlined),
            selectedIcon: Icon(Icons.self_improvement),
            label: "Yoga",
          ),
          NavigationDestination(
            icon: Icon(Icons.favorite_outline),
            selectedIcon: Icon(Icons.favorite),
            label: "Longevity",
          ),
          NavigationDestination(
            icon: Icon(Icons.female_outlined),
            selectedIcon: Icon(Icons.female),
            label: "HER / Women's",
          ),
        ],
      );
    }

    return null;
  }
}
