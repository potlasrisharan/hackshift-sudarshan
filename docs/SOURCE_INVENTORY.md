# Source inventory

Generated from source by `python3 scripts/discover.py`. This is a static inventory, not proof of runtime behaviour.

## project-1

### API declarations

| File | Method | Local route (prefix in router source) |
|---|---|---|

### Tables, RPC functions and triggers

**tables:** `audit_logs`, `bank_statements`, `beds`, `clinic_shifts`, `clinics`, `credit_debit_notes`, `daily_reports`, `inventory`, `ipd_admissions`, `patients`, `profiles`, `purchase_order_items`, `purchase_orders`, `sale_items`, `sales`, `staff_attendance`, `stock_logs`, `supplier_item_prices`, `supplier_payments`, `suppliers`, `wards`, `whatsapp_configs`, `whatsapp_logs`, `whatsapp_outbox`

**functions:** `admin_create_clinic_and_staff`, `capture_audit_log`, `deduct_inventory_on_sale`, `fn_mark_auto_absent`, `get_auth_hospital_id`, `get_financial_statement`, `handle_new_user`, `handle_whatsapp_notification_log`, `initialize_hospital_onboarding`, `is_admin`, `is_super_admin`, `log_cogs_to_ledger`, `process_sale`, `queue_whatsapp_notification`, `receive_purchase_order`, `unified_log_equipment_to_ledger`, `unified_log_expense_to_ledger`, `unified_log_payroll_to_ledger`, `unified_log_po_to_ledger`, `unified_log_sale_to_ledger`, `unified_log_supplier_payment_to_ledger`, `update_supplier_credit`, `update_updated_at_column`

**triggers:** `for`, `on_auth_user_created`, `on_sale_item_insert`, `sales_audit_trigger`, `tr_ipd_whatsapp`, `tr_ipd_whatsapp_notify`, `tr_note_credit_update`, `tr_opd_whatsapp_notify`, `tr_payment_credit_update`, `tr_po_credit_update`, `tr_sales_whatsapp`, `trg_log_cogs_after_sale_item`, `trg_unified_log_equipment`, `trg_unified_log_expense`, `trg_unified_log_payroll`, `trg_unified_log_po`, `trg_unified_log_sale`, `trg_unified_log_supplier_payment`, `update_purchase_orders_updated_at`, `update_suppliers_updated_at`

### UI source routes and entrypoints

- `project-1/index.html`
- `project-1/src/App.tsx`
- `project-1/src/pages/AboutPage.tsx`
- `project-1/src/pages/CareersPage.tsx`
- `project-1/src/pages/ClinicOperationsPage.tsx`
- `project-1/src/pages/ContactPage.tsx`
- `project-1/src/pages/HospitalCommandCenterPage.tsx`
- `project-1/src/pages/LandingPage.tsx`
- `project-1/src/pages/NewsPage.tsx`
- `project-1/src/pages/PrivacyPage.tsx`
- `project-1/src/pages/SupportPage.tsx`
- `project-1/src/pages/landing/About.tsx`
- `project-1/src/pages/landing/Careers.tsx`
- `project-1/src/pages/landing/ClinicOperations.tsx`
- `project-1/src/pages/landing/Contact.tsx`
- `project-1/src/pages/landing/HospitalCommandCenter.tsx`
- `project-1/src/pages/landing/News.tsx`
- `project-1/src/pages/landing/Privacy.tsx`
- `project-1/src/pages/landing/Solutions.tsx`
- `project-1/src/pages/landing/Support.tsx`

### Source file manifest (runtime files only)

- `project-1/Intro_Page/clinicos---healthcare-operations-platform/components/Offers.tsx`
- `project-1/jest.config.js`
- `project-1/migrations/024_shift_management.sql`
- `project-1/package.json`
- `project-1/postcss.config.js`
- `project-1/public/sw.js`
- `project-1/remotion.config.ts`
- `project-1/scripts/package.json`
- `project-1/scripts/whatsapp-gateway.js`
- `project-1/scripts/whatsapp_agent.py`
- `project-1/src/App.tsx`
- `project-1/src/components/AdminSetup.tsx`
- `project-1/src/components/AuditLogs.tsx`
- `project-1/src/components/CAFinancialSuite.tsx`
- `project-1/src/components/ClinicAdminDashboard.tsx`
- `project-1/src/components/ClinicAttendance.tsx`
- `project-1/src/components/EarningsDashboard.tsx`
- `project-1/src/components/EquipmentsDashboard.tsx`
- `project-1/src/components/ExpensesDashboard.tsx`
- `project-1/src/components/GlobalSearch.tsx`
- `project-1/src/components/HospitalDashboard.tsx`
- `project-1/src/components/HospitalDetails.tsx`
- `project-1/src/components/HospitalShiftManagement.tsx`
- `project-1/src/components/HospitalsRegistry.tsx`
- `project-1/src/components/IPDDashboard.tsx`
- `project-1/src/components/InventoryDashboard.tsx`
- `project-1/src/components/LoginPage.tsx`
- `project-1/src/components/MedicineMigration.tsx`
- `project-1/src/components/POSDashboard.tsx`
- `project-1/src/components/ProcurementDashboard.tsx`
- `project-1/src/components/ProductTour.tsx`
- `project-1/src/components/RegisterPage.tsx`
- `project-1/src/components/ResetPasswordPage.tsx`
- `project-1/src/components/SettingsDashboard.tsx`
- `project-1/src/components/ShiftManagement.tsx`
- `project-1/src/components/StaffPortal.tsx`
- `project-1/src/components/SuperAdminDashboard.tsx`
- `project-1/src/components/TaxInvoice.tsx`
- `project-1/src/components/WhatsAppSettings.tsx`
- `project-1/src/components/billing/Banners.tsx`
- `project-1/src/components/billing/BillingOverview.tsx`
- `project-1/src/components/billing/DowngradeResolutionModal.tsx`
- `project-1/src/components/billing/FeatureGate.tsx`
- `project-1/src/components/billing/SubscriptionDashboard.tsx`
- `project-1/src/components/billing/SubscriptionManager.tsx`
- `project-1/src/components/billing/TestimonialForm.tsx`
- `project-1/src/components/billing/UpgradeModal.tsx`
- `project-1/src/components/billing/UsageMeter.tsx`
- `project-1/src/components/billing/index.ts`
- `project-1/src/components/landing/FeaturesGrid.tsx`
- `project-1/src/components/landing/Footer.tsx`
- `project-1/src/components/landing/Hero.tsx`
- `project-1/src/components/landing/Navbar.tsx`
- `project-1/src/components/landing/Offers.tsx`
- `project-1/src/components/landing/PricingSection.tsx`
- `project-1/src/components/layout/AppLayout.tsx`
- `project-1/src/components/ui/DropdownMenu.tsx`
- `project-1/src/components/ui/NotificationsPanel.tsx`
- `project-1/src/components/ui/ReceiptBranding.tsx`
- `project-1/src/components/ui/ReceiptModal.tsx`
- `project-1/src/components/ui/alert.tsx`
- `project-1/src/components/ui/basic.tsx`
- `project-1/src/components/ui/card.tsx`
- `project-1/src/components/ui/checkbox.tsx`
- `project-1/src/components/ui/dialog.tsx`
- `project-1/src/components/ui/select.tsx`
- `project-1/src/components/ui/table.tsx`
- `project-1/src/components/ui/tabs.tsx`
- `project-1/src/components/ui/toast.tsx`
- `project-1/src/components/ui/toaster.tsx`
- `project-1/src/components/ui/tooltip.tsx`
- `project-1/src/components/ui/use-toast.ts`
- `project-1/src/context/HospitalContext.tsx`
- `project-1/src/context/TourContext.tsx`
- `project-1/src/hooks/useBillingActions.ts`
- `project-1/src/hooks/useSubscription.ts`
- `project-1/src/lib/analytics.ts`
- `project-1/src/lib/authService.ts`
- `project-1/src/lib/constants.ts`
- `project-1/src/lib/dataService.ts`
- `project-1/src/lib/notifications.ts`
- `project-1/src/lib/supabase.ts`
- `project-1/src/lib/tourSteps.ts`
- `project-1/src/lib/transitions.ts`
- `project-1/src/lib/utils.ts`
- `project-1/src/main.tsx`
- `project-1/src/pages/AboutPage.tsx`
- `project-1/src/pages/CareersPage.tsx`
- `project-1/src/pages/ClinicOperationsPage.tsx`
- `project-1/src/pages/ContactPage.tsx`
- `project-1/src/pages/HospitalCommandCenterPage.tsx`
- `project-1/src/pages/LandingPage.tsx`
- `project-1/src/pages/NewsPage.tsx`
- `project-1/src/pages/PrivacyPage.tsx`
- `project-1/src/pages/SupportPage.tsx`
- `project-1/src/pages/landing/About.tsx`
- `project-1/src/pages/landing/Careers.tsx`
- `project-1/src/pages/landing/ClinicOperations.tsx`
- `project-1/src/pages/landing/Contact.tsx`
- `project-1/src/pages/landing/HospitalCommandCenter.tsx`
- `project-1/src/pages/landing/News.tsx`
- `project-1/src/pages/landing/Privacy.tsx`
- `project-1/src/pages/landing/Solutions.tsx`
- `project-1/src/pages/landing/Support.tsx`
- `project-1/src/tourSteps.ts`
- `project-1/src/vite-env.d.ts`
- `project-1/supabase/functions/_types.d.ts`
- `project-1/supabase/functions/create-checkout/index.ts`
- `project-1/supabase/functions/deno.json`
- `project-1/supabase/functions/get-billing-portal/index.ts`
- `project-1/supabase/functions/import_map.json`
- `project-1/supabase/functions/manage-subscription/index.ts`
- `project-1/supabase/functions/reconcile-payments/index.ts`
- `project-1/supabase/functions/register-clinic-user/index.ts`
- `project-1/supabase/functions/send-billing-email/index.ts`
- `project-1/supabase/functions/send-whatsapp-notification/index.ts`
- `project-1/supabase/functions/webhook-razorpay/index.ts`
- `project-1/supabase/migrations/20260223_security_patch.sql`
- `project-1/supabase/migrations/20260227_add_settings_columns.sql`
- `project-1/supabase/migrations/20260302_clinics_rls_policy.sql`
- `project-1/supabase/migrations/20260302_hospital_onboarding_rpc.sql`
- `project-1/supabase/migrations/20260311_add_supplier_category.sql`
- `project-1/supabase/migrations/20260311_procurement_rpc.sql`
- `project-1/supabase/migrations/20260311_procurement_system.sql`
- `project-1/supabase/migrations/20260311_supplier_prices.sql`
- `project-1/supabase/migrations/20260313_add_discounts.sql`
- `project-1/supabase/migrations/20260313_fix_procurement_data_integrity.sql`
- `project-1/supabase/migrations/20260314_loose_pill_updates.sql`
- `project-1/supabase/migrations/20260315_b2b_invoicing.sql`
- `project-1/supabase/migrations/20260315_security_hardening.sql`
- `project-1/supabase/migrations/20260318_bank_reconciliation.sql`
- `project-1/supabase/migrations/20260318_comprehensive_financial_statement.sql`
- `project-1/supabase/migrations/20260318_fix_financial_statement_rpc.sql`
- `project-1/supabase/migrations/20260318_phase2_taxes_receipts.sql`
- `project-1/supabase/migrations/20260319_fix_ledger_and_rpc.sql`
- `project-1/supabase/migrations/20260319_refined_cash_balance.sql`
- `project-1/supabase/migrations/20260319_unified_financial_statement_rpc.sql`
- `project-1/supabase/migrations/20260319_unified_ledger_triggers.sql`
- `project-1/supabase/migrations/20260327_accrual_ledger_cogs.sql`
- `project-1/supabase/migrations/20260327_rls_consolidation.sql`
- `project-1/supabase/migrations/20260328_fix_process_sale_and_admin.sql`
- `project-1/supabase/migrations/20260328_fix_process_sale_generated_cols.sql`
- `project-1/supabase/migrations/20260328_fix_stock_logs_rls.sql`
- `project-1/supabase/migrations/20260329201500_ipd_management.sql`
- `project-1/supabase/migrations/20260329_fix_financial_reports.sql`
- `project-1/supabase/migrations/20260330_fix_ipd_billing_and_registration.sql`
- `project-1/supabase/migrations/20260404_add_admin_email_to_onboarding.sql`
- `project-1/supabase/migrations/20260404_automated_whatsapp_system.sql`
- `project-1/supabase/migrations/20260404_fix_search_path_onboarding.sql`
- `project-1/supabase/migrations/20260404_unify_process_sale.sql`
- `project-1/supabase/migrations/20260404_whatsapp_trigger.sql`
- `project-1/supabase/migrations/attendance_migration.sql`
- `project-1/supabase/migrations/auto_absent_logic.sql`
- `project-1/tailwind.config.js`
- `project-1/tests/load.test.js`
- `project-1/tests/rbac.test.js`
- `project-1/tests/setup.js`
- `project-1/tests/subscription.test.js`
- `project-1/tests/webhooks.test.js`
- `project-1/tsconfig.app.json`
- `project-1/tsconfig.json`
- `project-1/tsconfig.node.json`
- `project-1/vercel.json`
- `project-1/vite.config.ts`

## project-2

### API declarations

| File | Method | Local route (prefix in router source) |
|---|---|---|
| `project-2/backend/app/main.py` | GET | `/` |
| `project-2/backend/app/routers/abdm.py` | POST | `/abha/verify` |
| `project-2/backend/app/routers/abdm.py` | POST | `/registration/create-abha` |
| `project-2/backend/app/routers/ai.py` | POST | `/tts` |
| `project-2/backend/app/routers/ai.py` | POST | `/translate` |
| `project-2/backend/app/routers/ai.py` | POST | `/scribe` |
| `project-2/backend/app/routers/ai.py` | POST | `/llm-proxy` |
| `project-2/backend/app/routers/doctor.py` | GET | `/queue` |
| `project-2/backend/app/routers/doctor.py` | GET | `/token/next` |
| `project-2/backend/app/routers/doctor.py` | POST | `/encounter/create` |
| `project-2/backend/app/routers/doctor.py` | POST | `/encounter/approve` |
| `project-2/backend/app/routers/doctor.py` | GET | `/transactions` |
| `project-2/backend/app/routers/doctor.py` | GET | `/encounter/{encounter_id}/soap` |
| `project-2/backend/app/routers/doctor.py` | GET | `/encounter/{encounter_id}/fhir` |
| `project-2/backend/app/routers/documents.py` | POST | `/ocr` |
| `project-2/backend/app/routers/insurance.py` | POST | `/coverage-eligibility/check` |
| `project-2/backend/app/routers/intake.py` | POST | `/chat` |
| `project-2/backend/app/routers/patient.py` | GET | `/demo-credentials` |
| `project-2/backend/app/routers/patient.py` | POST | `/register` |
| `project-2/backend/app/routers/patient.py` | GET | `/{patient_id}` |

### Tables, RPC functions and triggers

**tables:** `ayush_assessments`, `clinical_summaries`, `departments`, `encounters`, `extracted_lab_observations`, `extracted_medications`, `facilities`, `patients`, `practitioners`, `scanned_documents`, `symptoms_intake`

**functions:** 

**triggers:** 

### UI source routes and entrypoints

- `project-2/admin.html`
- `project-2/ayush.html`
- `project-2/doctor.html`
- `project-2/index.html`
- `project-2/kiosk_app/lib/main.dart`
- `project-2/kiosk_app/web/index.html`
- `project-2/patient.html`
- `project-2/public/admin/index.html`
- `project-2/public/admin.html`
- `project-2/public/ayush/index.html`
- `project-2/public/ayush.html`
- `project-2/public/doctor/index.html`
- `project-2/public/doctor.html`
- `project-2/public/index.html`
- `project-2/public/kiosk/index.html`
- `project-2/public/patient/index.html`
- `project-2/public/patient.html`
- `project-2/public/triage/index.html`
- `project-2/public/triage.html`
- `project-2/triage.html`

### Source file manifest (runtime files only)

- `project-2/api/v1/abdm/registration/create-abha.js`
- `project-2/api/v1/ai/llm-proxy.js`
- `project-2/api/v1/ai/scribe.js`
- `project-2/api/v1/ai/translate.js`
- `project-2/api/v1/ai/tts.js`
- `project-2/api/v1/doctor/encounter/approve.js`
- `project-2/api/v1/documents/ocr.js`
- `project-2/backend/app/core/config.py`
- `project-2/backend/app/db.py`
- `project-2/backend/app/main.py`
- `project-2/backend/app/models/schemas.py`
- `project-2/backend/app/routers/abdm.py`
- `project-2/backend/app/routers/ai.py`
- `project-2/backend/app/routers/doctor.py`
- `project-2/backend/app/routers/documents.py`
- `project-2/backend/app/routers/insurance.py`
- `project-2/backend/app/routers/intake.py`
- `project-2/backend/app/routers/patient.py`
- `project-2/backend/app/services/abdm_service.py`
- `project-2/backend/app/services/ai_service.py`
- `project-2/backend/app/services/clinical_engine.py`
- `project-2/backend/app/services/fhir_service.py`
- `project-2/backend/tests/test_clinical_gateway.py`
- `project-2/docs/03_DATABASE_SCHEMA_AND_ERD.sql`
- `project-2/kiosk_app/analysis_options.yaml`
- `project-2/kiosk_app/ios/Runner/Assets.xcassets/AppIcon.appiconset/Contents.json`
- `project-2/kiosk_app/ios/Runner/Assets.xcassets/LaunchImage.imageset/Contents.json`
- `project-2/kiosk_app/lib/core/constants/app_colors.dart`
- `project-2/kiosk_app/lib/core/constants/app_strings.dart`
- `project-2/kiosk_app/lib/core/router/app_router.dart`
- `project-2/kiosk_app/lib/core/theme/app_theme.dart`
- `project-2/kiosk_app/lib/features/intake/data/models/patient_model.dart`
- `project-2/kiosk_app/lib/features/intake/data/sources/api_client.dart`
- `project-2/kiosk_app/lib/features/intake/presentation/providers/intake_provider.dart`
- `project-2/kiosk_app/lib/features/intake/presentation/screens/converse_screen.dart`
- `project-2/kiosk_app/lib/features/intake/presentation/screens/identify_screen.dart`
- `project-2/kiosk_app/lib/features/intake/presentation/screens/language_screen.dart`
- `project-2/kiosk_app/lib/features/intake/presentation/screens/queue_token_screen.dart`
- `project-2/kiosk_app/lib/features/intake/presentation/screens/scan_screen.dart`
- `project-2/kiosk_app/lib/features/intake/presentation/screens/summarize_screen.dart`
- `project-2/kiosk_app/lib/main.dart`
- `project-2/kiosk_app/macos/Runner/Assets.xcassets/AppIcon.appiconset/Contents.json`
- `project-2/kiosk_app/pubspec.yaml`
- `project-2/kiosk_app/test/widget_test.dart`
- `project-2/kiosk_app/web/manifest.json`
- `project-2/package.json`
- `project-2/public/doctor/supabase-client.js`
- `project-2/public/supabase-client.js`
- `project-2/public/triage/supabase-client.js`
- `project-2/supabase-client.js`
- `project-2/vercel.json`

