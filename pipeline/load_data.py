"""Load Rebrickable CSV exports (data/raw/) into a SQLite database (data/lego.db).

Usage:
    python pipeline/load_data.py
"""

import sqlite3
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT / "data" / "raw"
DB_PATH = ROOT / "data" / "lego.db"
SCHEMA_PATH = Path(__file__).resolve().parent / "schema.sql"

# Order matters only for readability here; foreign keys are off during load.
TABLES = [
    "part_categories",
    "colors",
    "themes",
    "parts",
    "part_relationships",
    "elements",
    "sets",
    "minifigs",
    "inventories",
    "inventory_parts",
    "inventory_minifigs",
    "inventory_sets",
]


def main():
    missing = [t for t in TABLES if not (RAW_DIR / f"{t}.csv").exists()]
    if missing:
        raise SystemExit(
            "Missing CSVs in data/raw/: "
            + ", ".join(f"{m}.csv" for m in missing)
            + "\nDownload them from https://rebrickable.com/downloads/ first."
        )

    conn = sqlite3.connect(DB_PATH)
    try:
        conn.executescript(SCHEMA_PATH.read_text())

        for table in TABLES:
            csv_path = RAW_DIR / f"{table}.csv"
            df = pd.read_csv(csv_path)
            conn.execute(f"DELETE FROM {table}")
            df.to_sql(table, conn, if_exists="append", index=False)
            print(f"loaded {len(df):>7,} rows into {table}")

        conn.commit()
    finally:
        conn.close()

    print(f"\nDatabase ready at {DB_PATH}")


if __name__ == "__main__":
    main()
