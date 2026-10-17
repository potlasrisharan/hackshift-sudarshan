# ThreadPulse

Status: exact demand distribution from supplied synthetic per-patient refill
probabilities. Patient history modelling, quantities, walk-ins and purchase-order
integration are not yet implemented.

**Problem:** show inventory risk from individual expected refill events rather
than treating a mean demand forecast as a guarantee. LLM text is insufficient
for a reproducible stockout probability or service-level quantile.

Let independent `X_i~Bernoulli(p_i)` and demand `N=ΣX_i`. Start pmf `[1]`; for each
p convolve with `[1-p,p]`. The smallest q with CDF(q)≥serviceLevel is the target;
`reorder=max(0,q-stock)` and `stockoutProbability=P(N>stock)`. Each patient
represents one refill unit, not tablets or a full prescription quantity.

```text
validate probabilities, nonnegative integer stock, service level
pmf = [1]
for p in probabilities:
    next[i] += pmf[i]*(1-p)
    next[i+1] += pmf[i]*p
find service-level CDF quantile
return full pmf, expected demand, stockout probability, order suggestion
```

O(n²) time/O(n) space; n≤500. Tunables: service level 0.5–0.999. Edge cases:
no cohort→zero order, certain refills, zero probability, stock above maximum demand,
floating-point normalisation and service threshold boundaries. Quantile selection
allows 1e-12 cumulative tolerance. Independence is a strong assumption: household,
seasonal and cohort correlation can invalidate the uncertainty interpretation.
No automatic purchase order or patient contact is performed.

Verification: exact `[.25,.5,.25]` two-patient example, 100 seeded property cases
versus exhaustive event enumeration, normalisation and monotone service-level
quantiles. Runtime benchmark uses a 100-patient synthetic vector.

60 seconds: “A pharmacy needs more than average demand. We combine the chance
of each refill to show the whole range and how likely current stock is to run out.
A manager decides what to order.”

Technical: “Exact Poisson-binomial convolution avoids a normal approximation for
small heterogeneous cohorts. A declared service quantile produces an order-up-to
suggestion. Estimating p from real histories, compound quantities and temporal
backtesting are necessary before operational use.”
