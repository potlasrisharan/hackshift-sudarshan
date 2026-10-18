"""Export the checksum-verified fitted pipeline and a synthetic parity corpus. No fitting."""
import json
from pathlib import Path
import sys
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "model-api"))
from inference import load_bundle, predict

model, config = load_bundle()
imputer, scaler, estimator = [step for _, step in model.steps]
assert [type(step).__name__ for _, step in model.steps] == ["SimpleImputer", "StandardScaler", "LogisticRegression"]
assert imputer.strategy == "median" and imputer.add_indicator
assert scaler.with_mean and scaler.with_std and estimator.classes_.tolist() == [0, 1]
artifact = {
    "representation_version": 1, "model_version": config["version"],
    "model_sha256": config["model_sha256"], "cutoff": config["threshold"],
    "features": config["features"], "statistics": imputer.statistics_.tolist(),
    "indicator_features": imputer.indicator_.features_.tolist(),
    "mean": scaler.mean_.tolist(), "scale": scaler.scale_.tolist(),
    "coefficients": estimator.coef_[0].tolist(), "intercept": float(estimator.intercept_[0]),
    "classes": estimator.classes_.tolist(),
}
target = ROOT / "packages/engine/cbc/frozen-model.json"
target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(json.dumps(artifact, indent=2) + "\n")
rng = np.random.default_rng(4226)
inputs = [dict(wbc=8.95, rbc=4.41, neutrophils=65, lymphocytes=25, monocytes=9)]
for value in [0, 0.49, 0.5, 0.5000000001, 1.5, 2.5, 24.5, 25.5]:
    inputs.append(dict(wbc=8.95, rbc=4.41, neutrophils=50.5, lymphocytes=value, monocytes=0.5))
for _ in range(1000):
    n, l, m, _ = rng.dirichlet([6, 3, 1, 1]) * 100
    inputs.append(dict(wbc=float(rng.uniform(.1, 100)), rbc=float(rng.uniform(.1, 12)),
                       neutrophils=float(n), lymphocytes=float(l), monocytes=float(m)))
# Deliberately bracket the cutoff with bisection over WBC for a valid differential.
for _ in range(20):
    base = dict(rbc=float(rng.uniform(2, 7)), neutrophils=60., lymphocytes=30., monocytes=5.)
    lo, hi = .01, 100.
    f_lo = predict(model, config, dict(base, wbc=lo))["score"] - config["threshold"]
    if f_lo * (predict(model, config, dict(base, wbc=hi))["score"] - config["threshold"]) >= 0:
        continue
    for _ in range(40):
        mid = (lo + hi) / 2
        if (predict(model, config, dict(base, wbc=mid))["score"] - config["threshold"]) * f_lo > 0:
            lo = mid
        else:
            hi = mid
    for value in [lo - 1e-7, hi + 1e-7]:
        inputs.append(dict(base, wbc=value))
corpus = [{"input": item, "expected": predict(model, config, item)} for item in inputs]
fixtures = ROOT / "tests/fixtures/cbc"
fixtures.mkdir(parents=True, exist_ok=True)
(fixtures / "parity.json").write_text(json.dumps(corpus, indent=2) + "\n")
print(f"Exported {len(corpus)} synthetic oracle cases; artifact {artifact['model_sha256']}")
