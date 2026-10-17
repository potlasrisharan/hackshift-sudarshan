# Rx-to-Shelf

Status: exact optimisation for one structured prescription and synthetic stock.
This is the cross-project algorithm: intake supplies a prescription, operations
supplies batch/clinic/price/expiry inventory. No fuzzy drug match is auto-accepted.

**Problem:** minimise course cost while preserving salt, strength, form, quantity
and expiry validity. String similarity alone can silently select the wrong dose;
price sorting alone can select an unusable batch; an LLM cannot reserve stock.

Minimise `Σ_b pricePaise_b*x_b + transferPaise*Σ_k y_k`, with integer x,
`Σ x=requiredUnits`, `0≤x_b≤stock_b`, no more than two used clinics, exact
composition and `expiry≥courseEnd+14 days`. Recorded exact-salt allergy blocks
planning. All plans require a pharmacist. Currency is integer paise.

```text
validate input and reject exact recorded allergy
compute courseEnd + 14 UTC calendar days
reject wrong composition, short expiry and zero stock with reasons
for each clinic subset of size one or two:
    sort eligible batches by unit price, expiry and stable ID
    greedily fill course; discard shortfalls
    add transfer cost for clinics actually used
sort plans by total cost, dedupe identical allocations, return best three
```

For one fungible composition with linear unit costs, exchange arguments establish
greedy optimality within each subset. Enumerating all ≤2-clinic subsets is exact
under that source constraint. Complexity O(K² B log B), O(B+K²) working storage.
Multi-line prescriptions, interaction constraints, uncertain OCR and NTI/brand
substitution need explicit extensions and clinical review; none are silently
inferred. This function does not reserve or dispense inventory.

Tunables: 14-day demonstration buffer, source-count cap two, per-clinic transfer
fee. Edge cases: empty stock, insufficient quantities, zero price, leap/calendar
boundaries, same-day expiry, allergies and malformed paise. Unknown therapeutic
alternatives are rejected rather than proposed. Expiry and price are fixtures.

Verification: 200 seeded property cases compare the planner against exhaustive
bounded allocation; targeted tests cover allergy, malformed price, wrong strength,
short expiry and insufficient stock. The API/browser demo returns East ₹64
including transfer versus North ₹120 for the fixed scenario. Benchmarks are
mechanism tests, not claims about Indian market prices or dispensing safety.

60 seconds: “The cheapest batch is useless if it expires during treatment. We
connect a prescription to stock that covers the course, show total cost including
transfer, and explain every rejected batch for the pharmacist.”

Technical: “Exact composition filtering plus exhaustive small clinic-subset
selection reduces the allocation problem to bounded linear unit-cost filling.
A brute-force property oracle verifies the optimum under the declared constraints.
Adding real reservations requires a separate transactional inventory boundary.”
