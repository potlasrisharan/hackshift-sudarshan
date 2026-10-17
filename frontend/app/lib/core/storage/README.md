# Storage boundary (Phase 1)
No patient or unsent-session persistence is enabled in this phase. Preferences
are in memory. Phase 4 must implement the single encrypted queue, key lifecycle,
max-age policy and reset purge together, after the submission contract is agreed.
Do not add SharedPreferences, a second queue, or browser localStorage for PII.
