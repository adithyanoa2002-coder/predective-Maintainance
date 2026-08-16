# Fleet health monitor — frontend

Next.js + TypeScript + Tailwind dashboard for the Predictive Maintenance Framework group
project. Runs the trained models **directly in the browser** via `onnxruntime-web` —
there is no backend to stand up for this demo.

## 1. Add the model + data files

Run `notebook/predictive_maintenance_pipeline.ipynb` in Colab first (Runtime → Run all).
It downloads a zip called `predictive_maintenance_artifacts.zip`. Unzip it and copy the
contents in like this:

```
frontend/
  public/
    models/
      rul_model.onnx        <- from models/rul_model.onnx
      fault_model.onnx      <- from models/fault_model.onnx
    data/
      scaler.json             <- from data/scaler.json
      feature_names.json      <- from data/feature_names.json
      shap_importance.json    <- from data/shap_importance.json
      demo_stream.json        <- from data/demo_stream.json
      model_metrics.json      <- from data/model_metrics.json
```

The `public/models/.gitkeep` and `public/data/.gitkeep` files are just placeholders —
delete them or leave them, it doesn't matter.

## 2. Install and run

```bash
npm install
npm run dev
```

Open http://localhost:3000. The fleet overview streams a simulated live feed (replaying
the precomputed test-set trajectories on a timer); click any engine to see its detail
page, live sensor chart, RUL trend, and the "client-side inference" panel that actually
loads the `.onnx` files into the browser and runs a fresh prediction.

`npm run build && npm start` for a production build; deploys as-is to Vercel.

## What's actually happening technically

- **Fleet overview** (`app/page.tsx`) replays `demo_stream.json` — the notebook's
  precomputed per-cycle predictions for 10 held-out test engines — on a timer, so the
  dashboard behaves like a live telemetry feed without needing a real sensor network.
- **Engine detail** (`app/engine/[id]/page.tsx`) charts the sensor trend and RUL/anomaly
  trend for one engine, and includes a panel that runs the exported ONNX models live in
  the browser (`lib/onnxInference.ts`) on that engine's actual feature vector, scaled
  with the same min/max parameters computed during training (`scaler.json`). This is
  genuine client-side inference, not a lookup — the "reference" value from the notebook
  is shown alongside it so you can verify they match.
- **Explainability panel** shows the RUL model's global SHAP feature importance,
  computed once in the notebook and saved as `shap_importance.json`.
- **Alerts feed** derives from any engine currently in a Critical health state or
  flagged anomalous by the Isolation Forest.

## Design notes

The palette is deliberately not a generic dark-mode SaaS theme: graphite base
(`#101316`/`#171B20`) with a single instrumentation-amber accent (`#FFB020`) and a
teal/red pair for healthy/critical states — closer to an aircraft instrument panel than
a typical admin dashboard, which fits an aerospace predictive-maintenance subject.
The signature element is the radial RUL gauge (`components/RadialGauge.tsx`), styled
like a turbine gauge rather than a generic progress ring. Data uses a monospace font
(JetBrains Mono) throughout so live-updating numbers read as telemetry.

## Folder structure

```
app/
  page.tsx                 fleet overview
  engine/[id]/page.tsx     engine detail
  layout.tsx, globals.css
components/                RadialGauge, EngineCard, Charts, AlertsFeed,
                            ExplainabilityPanel, LiveInferencePanel, TopBar, Panel
lib/
  types.ts                 shared TypeScript types
  onnxInference.ts         client-side ONNX Runtime Web helper
  useStreamSimulator.ts    hook that replays demo_stream.json as a live feed
public/
  models/                  put the two .onnx files here
  data/                    put the five .json files here
```
