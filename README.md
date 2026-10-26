# Lego Insights

A project exploring the Rebrickable LEGO dataset: set complexity, theme popularity, color trends, part reuse, and minifigure diversity over six decades of LEGO history.

## Project structure

```
Lego-Insights/
├── data/
│   ├── raw/            # Downloaded Rebrickable CSVs (gitignored, see below)
│   └── processed/      # Cleaned/derived CSVs produced by the pipeline
├── pipeline/
│   ├── schema.sql       # SQLite schema for the raw Rebrickable tables
│   ├── load_data.py     # CSV -> SQLite loader
│   ├── transform.py     # Derives analysis tables (trends, diversity indices, etc.)
│   └── export_for_web.py# Exports JSON for the website from the processed tables
├── analysis/
│   └── notebooks/       # One notebook per analysis module (EDA + insights)
├── website/              # React + Vite + TypeScript + Recharts site
│   └── public/data/      # JSON consumed by the website (output of export_for_web.py)
└── docs/
    └── insights.md       # Written summary of findings, linked from the website
```

## Getting the data

Rebrickable's full CSV export is too large to commit to the repo. Download a current snapshot yourself:

1. Go to https://rebrickable.com/downloads/
2. Download all CSVs into `data/raw/`: `sets.csv`, `themes.csv`, `colors.csv`, `parts.csv`, `part_categories.csv`, `part_relationships.csv`, `elements.csv`, `inventories.csv`, `inventory_parts.csv`, `inventory_sets.csv`, `inventory_minifigs.csv`, `minifigs.csv`
3. Note the download date somewhere (e.g. rename the folder or jot it in `docs/insights.md`) so the write-up can state how current the data is

## Running the pipeline

```bash
pip install -r requirements.txt

python pipeline/load_data.py      # build data/lego.db from data/raw/*.csv
python pipeline/transform.py      # derive analysis tables into data/lego.db
python pipeline/export_for_web.py # write JSON into website/public/data/
```

Then explore interactively via the notebooks in `analysis/notebooks/`, or run the website:

```bash
cd website
npm install
npm run dev
```

## Analysis modules (planned)

- **Sets:** set count and average part count per year; growth in set complexity over time.
- **Themes:** theme popularity over time; which themes have grown, shrunk, or disappeared.
- **Colors:** color palette trends over time; rise of translucent/specialty colors.
- **Parts:** part category distribution; part reuse via `part_relationships` (which molds get reused across the most parts).
- **Minifigs:** minifig count and diversity over time extended with per-theme breakdowns.

Each module gets: a notebook under `analysis/notebooks/`, a derived table in `transform.py`, a JSON export in `export_for_web.py`, and a page on the website.

## Future work: skin tone diversity

A planned follow-up module will bring skin-color diversity analysis into this project:

- Skin tone distribution by theme and by year, to see how representation has shifted over time
- A page on the website presenting this alongside the rest of the minifig analysis

