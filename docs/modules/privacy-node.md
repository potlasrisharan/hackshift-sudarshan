# Personal Privacy Node

## Current scope

Cognee 1.6.5 uses local Aya generation and nomic embeddings, SQLite/LanceDB/Ladybug, telemetry disabled and non-loopback Python socket guard.

## Verification and remaining acceptance criteria

Local remember/recall succeeded on synthetic input; docs/benchmarks/privacy-node.json records actual outcome. Python socket guard is not system-wide egress proof. E2EE sync, encrypted durable health store and UI connection remain pending.

All demo flows retain synthetic labels. See REQUIREMENTS.md for traceability, COMPLIANCE.md for controls and DEMO_SCRIPT.md for the tested journey. A screen is not evidence that the corresponding live clinical service is complete.
