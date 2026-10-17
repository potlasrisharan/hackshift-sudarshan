# CBC research model API

This optional external service serves the frozen Indian CBC logistic regression
pipeline. The Cloudflare application does not call it yet. It does not replace
the platform's deterministic clinical engines or decide patient care.

The Python service is isolated here to preserve the main application build,
dependencies, routes and deployment. The user explicitly chose to retain the
existing Render hosting while moving its source into this project repository.
No patient-level datasets, identifiers, credentials, training jobs or Streamlit
UI are included. Do not send identifiable patient information to this prototype.

## Model identity and limits

- Version: `india-cbc-logistic-c87ec8485159`
- SHA256: `c87ec848515906247b77e9764953a9969c4c9ae8da69cd3b877e7afaa2c3c23e`
- Saved estimator: India-only logistic regression, seven shared CBC features.
- Differential percentages are rounded to whole percentages before deriving NLR
  and LMR. The saved pipeline handles imputation, scaling and prediction.
- Cutoff: `0.626816175626443`, selected using development-side out-of-fold scores.
- Development evaluation: internal nested cross-validation on 752 published
  records with reconstructed labels; AUC 0.713, accuracy 63.2%, sensitivity 35.9%,
  specificity 90.4%. These are not independent validation of the final refit.
- Labels, hospital-source confounding and uncertain measurement precision limit
  interpretation. Haemoglobin is excluded because source units are uncertain.
- Outputs are research scores, not calibrated cancer probabilities or diagnoses.

Study: https://www.nature.com/articles/s41598-023-27548-w

The source pickle and configuration were copied byte for byte from the previously
verified model deployment. No retraining, coefficient changes or cutoff changes
are part of this move.

## Run and test locally

Use Python 3.12.12. From this repository's root:

```sh
cd model-api
python -m venv .venv
# Activate the environment using your platform's command.
python -m pip install -r requirements-dev.txt
python -m unittest discover -s tests -v
python -m uvicorn api.main:app --host 127.0.0.1 --port 8000 --workers 1 --no-access-log
```

Interactive schema: `http://127.0.0.1:8000/docs`. Health: `GET /health`.

## Call the model

Existing service base URL: https://rohan-cbc-model-api.onrender.com

Send `POST /predict` with `Content-Type: application/json`:

```json
{"wbc":8.95,"rbc":4.41,"neutrophils":65,"lymphocytes":25,"monocytes":9}
```

Units: WBC in 10^9/L, RBC in 10^12/L, and differentials in percentages, not absolute
counts. All five numeric measurements are required. Their three differential
percentages must total at most 100. Send no names, identifiers or source dataset.
For this published sample, the expected score is `0.6528833817519397`.

The response includes `model_version`, `score`, `cutoff`, `above_cutoff`,
`undefined_ratios_imputed`, and `research_only`. Validation failures return 422.
No authentication or application-level rate limiting is currently provided.

## Render source migration

Update the existing Render service instead of creating a second instance:

| Setting | Value |
| --- | --- |
| Repository | `potlasrisharan/hackshift-sudarshan` |
| Branch while the PR is reviewed | `codex/add-model-api` |
| Branch after the PR is merged | `main` |
| Root directory | `model-api` |
| Runtime | Python 3.12.12 |
| Build command | `pip install -r requirements.txt` |
| Start command | `uvicorn api.main:app --host 0.0.0.0 --port $PORT --workers 1 --no-access-log` |
| Health check | `/health` |
| Compute | Free |
| Region | Singapore |

Use `OPENBLAS_NUM_THREADS=1` and `OMP_NUM_THREADS=1`. The optional blueprint in
`model-api/render.yaml` describes the same deployment. When using a blueprint,
select that file explicitly; the project root has no new Render blueprint.

Before cutting over, verify `/health`, `/openapi.json` and the sample prediction.
Check the model version and numeric score after deploying the new source. Retain
the old repository for rollback; no deletion is part of this migration. The
public endpoint does not change when the existing service's source changes.

Free instances sleep after 15 minutes without traffic; waking can take about a
minute. Hosting limits are not a production availability guarantee. Inputs are
not persisted by this API, but provider metadata retention is outside its control.

## Future application integration

No frontend, backend, tenant route, authentication or patient workflow is changed
by this folder. A later integration should call through the shared Cloudflare
backend, honour tenant/consent boundaries and avoid sending patient identifiers.
For direct browser experiments, add exact origins using comma-separated
`ALLOWED_ORIGINS`; only localhost development origins are enabled by default.
Do not expose private service credentials in frontend code.
