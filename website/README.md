# Lego Insights website

React + Vite + TypeScript + Recharts front end for the [Lego Insights](../README.md) project.
Reads pre-computed JSON from `public/data/` (written by `../pipeline/export_for_web.py`). There's
no backend or build-time data dependency, so this can be deployed as a static site anywhere.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/
```

See the root [README](../README.md) for the full pipeline (data download → SQLite → JSON export)
that populates `public/data/`.
