import "package:flutter/material.dart";
import "package:go_router/go_router.dart";
import "../constants/app_colors.dart";

class AyuSetuLogoBadge extends StatelessWidget {
  final double height;
  final EdgeInsetsGeometry padding;
  final double borderRadius;
  final bool showText;

  const AyuSetuLogoBadge({
    super.key,
    this.height = 20,
    this.padding = const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
    this.borderRadius = 8,
    this.showText = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 4,
            offset: const Offset(0, 1.5),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Image.asset(
            "assets/images/ayusetu_logo.png",
            height: height,
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) => Container(
              padding: const EdgeInsets.all(2),
              decoration: BoxDecoration(
                color: const Color(0xFF087D71),
                borderRadius: BorderRadius.circular(4),
              ),
              child: const Icon(
                Icons.healing_rounded,
                size: 12,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class AppScaffoldShell extends StatelessWidget {
  final Widget child;
  final String title;
  final String? subtitle;
  final List<Widget>? actions;
  final bool isLight;

  const AppScaffoldShell({
    super.key,
    required this.child,
    required this.title,
    this.subtitle,
    this.actions,
    this.isLight = true,
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

    final Color bgColor = isLight ? AppColors.clinicalBg : AppColors.background;
    final Color appBarBg = isLight ? AppColors.clinicalCard : AppColors.surface;
    final Color titleColor = isLight ? AppColors.clinicalTextDark : AppColors.textPrimary;
    final Color subtitleColor = isLight ? AppColors.medicalTeal : AppColors.primaryLight;
    final Color iconColor = isLight ? AppColors.clinicalTextDark : AppColors.textPrimary;
    final Color actionIconColor = isLight ? AppColors.clinicalTextMuted : AppColors.textSecondary;

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: appBarBg,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        shape: isLight
            ? const Border(bottom: BorderSide(color: AppColors.clinicalBorder, width: 1))
            : null,
        leading: canPop
            ? Padding(
                padding: const EdgeInsets.all(8.0),
                child: Material(
                  color: isLight ? const Color(0xFFF1F5F9) : AppColors.surfaceElevated,
                  borderRadius: BorderRadius.circular(10),
                  child: Tooltip(
                    message: "Back",
                    child: InkWell(
                      borderRadius: BorderRadius.circular(10),
                      onTap: () {
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
                      child: Center(
                        child: Icon(
                          Icons.arrow_back_ios_new_rounded,
                          color: iconColor,
                          size: 16,
                        ),
                      ),
                    ),
                  ),
                ),
              )
            : Padding(
                padding: const EdgeInsets.all(8.0),
                child: Material(
                  color: isLight ? const Color(0xFFF1F5F9) : AppColors.surfaceElevated,
                  borderRadius: BorderRadius.circular(10),
                  child: Tooltip(
                    message: "All Portals",
                    child: InkWell(
                      borderRadius: BorderRadius.circular(10),
                      onTap: () {
                        try {
                          context.go("/");
                        } catch (_) {}
                      },
                      child: Center(
                        child: Icon(
                          Icons.grid_view_rounded,
                          color: actionIconColor,
                          size: 18,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
        title: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.w700,
                color: titleColor,
                letterSpacing: -0.3,
              ),
            ),
            if (subtitle != null)
              Text(
                subtitle!,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 11,
                  color: subtitleColor,
                  fontWeight: FontWeight.w600,
                ),
              ),
          ],
        ),
        actions: [
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 10, horizontal: 4),
            child: AyuSetuLogoBadge(height: 20),
          ),
          if (actions != null)
            ...actions!
          else
            IconButton(
              icon: Icon(Icons.apps_rounded, color: actionIconColor),
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
    final isClinical = currentRoute.startsWith("/nurse") ||
        currentRoute.startsWith("/hq") ||
        currentRoute.startsWith("/clinical");

    if (isClinical) {
      int currentIndex = 0;
      if (currentRoute.startsWith("/nurse")) currentIndex = 0;
      if (currentRoute.startsWith("/hq")) currentIndex = 1;
      if (currentRoute.startsWith("/clinical")) currentIndex = 2;

      final navBar = NavigationBar(
        backgroundColor: isLight ? AppColors.clinicalCard : null,
        indicatorColor: isLight ? AppColors.medicalTeal.withValues(alpha: 0.15) : null,
        selectedIndex: currentIndex,
        onDestinationSelected: (idx) {
          switch (idx) {
            case 0:
              context.go("/nurse");
              break;
            case 1:
              context.go("/hq");
              break;
            case 2:
              context.go("/clinical");
              break;
          }
        },
        destinations: [
          NavigationDestination(
            icon: Icon(Icons.local_hospital_outlined, color: isLight ? AppColors.clinicalTextMuted : null),
            selectedIcon: Icon(Icons.local_hospital, color: isLight ? AppColors.medicalTeal : null),
            label: "Nurse",
          ),
          NavigationDestination(
            icon: Icon(Icons.analytics_outlined, color: isLight ? AppColors.clinicalTextMuted : null),
            selectedIcon: Icon(Icons.analytics, color: isLight ? AppColors.medicalTeal : null),
            label: "HQ",
          ),
          NavigationDestination(
            icon: Icon(Icons.inventory_2_outlined, color: isLight ? AppColors.clinicalTextMuted : null),
            selectedIcon: Icon(Icons.inventory_2, color: isLight ? AppColors.medicalTeal : null),
            label: "Operations",
          ),
        ],
      );

      if (isLight) {
        return Container(
          decoration: const BoxDecoration(
            border: Border(top: BorderSide(color: AppColors.clinicalBorder, width: 1)),
          ),
          child: navBar,
        );
      }
      return navBar;
    }

    // Unified Patient Bottom Navigation (Home, Records, Health, Yoga)
    int currentIndex = 0;
    if (currentRoute.startsWith("/prescription")) {
      currentIndex = 1;
    } else if (currentRoute.startsWith("/vitalis") ||
        currentRoute.startsWith("/her") ||
        currentRoute.startsWith("/longevity") ||
        currentRoute.startsWith("/womens-health")) {
      currentIndex = 2;
    } else if (currentRoute.startsWith("/yoga")) {
      currentIndex = 3;
    } else if (currentRoute == "/") {
      currentIndex = 0;
    }

    final navBar = NavigationBar(
      backgroundColor: isLight ? AppColors.clinicalCard : null,
      indicatorColor: isLight ? AppColors.medicalTeal.withValues(alpha: 0.15) : null,
      selectedIndex: currentIndex,
      onDestinationSelected: (idx) {
        switch (idx) {
          case 0:
            context.go("/");
            break;
          case 1:
            context.go("/prescription");
            break;
          case 2:
            context.go("/vitalis");
            break;
          case 3:
            context.go("/yoga");
            break;
        }
      },
      destinations: [
        NavigationDestination(
          icon: Icon(Icons.home_outlined, color: isLight ? AppColors.clinicalTextMuted : null),
          selectedIcon: Icon(Icons.home_rounded, color: isLight ? AppColors.medicalTeal : null),
          label: "Home",
        ),
        NavigationDestination(
          icon: Icon(Icons.description_outlined, color: isLight ? AppColors.clinicalTextMuted : null),
          selectedIcon: Icon(Icons.description_rounded, color: isLight ? AppColors.medicalTeal : null),
          label: "Records",
        ),
        NavigationDestination(
          icon: Icon(Icons.favorite_outline, color: isLight ? AppColors.clinicalTextMuted : null),
          selectedIcon: Icon(Icons.favorite_rounded, color: isLight ? AppColors.medicalTeal : null),
          label: "Health",
        ),
        NavigationDestination(
          icon: Icon(Icons.self_improvement_outlined, color: isLight ? AppColors.clinicalTextMuted : null),
          selectedIcon: Icon(Icons.self_improvement_rounded, color: isLight ? AppColors.medicalTeal : null),
          label: "Yoga",
        ),
      ],
    );

    if (isLight) {
      return Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: AppColors.clinicalBorder, width: 1)),
        ),
        child: navBar,
      );
    }
    return navBar;
  }
}
