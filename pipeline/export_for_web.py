"""Export the agg_* tables from data/lego.db into JSON files the website reads.

Keeps payloads small by trimming high-cardinality dimensions (colors, parts,
themes) down to the top-N series and folding the rest into an "Other" bucket,
rather than shipping the full cross product to the browser.

Usage:
    python pipeline/export_for_web.py
"""

import json
import sqlite3
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "lego.db"
OUT_DIR = ROOT / "website" / "public" / "data"

# Capped at 7 so the + "Other" bucket fits the 8-slot categorical palette
# used on the website (see website/src/lib/palette.ts).
TOP_N_COLORS = 7
TOP_N_THEMES = 7
TOP_N_PARTS = 25


def read_table(conn, table):
    return pd.read_sql_query(f"SELECT * FROM {table}", conn)


def write_json(name, obj):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUT_DIR / f"{name}.json"
    path.write_text(json.dumps(obj, indent=2, default=str))
    print(f"wrote {path.relative_to(ROOT)}")


def export_sets_overview(conn):
    df = read_table(conn, "agg_sets_by_year")
    write_json("sets_by_year", df.to_dict(orient="records"))


def export_themes(conn):
    df = read_table(conn, "agg_sets_by_theme_year")
    totals = df.groupby("theme_name")["num_sets"].sum().sort_values(ascending=False)
    top_themes = list(totals.head(TOP_N_THEMES).index)

    df = df.copy()
    df["theme_name"] = df["theme_name"].where(df["theme_name"].isin(top_themes), "Other")
    wide = (
        df.groupby(["year", "theme_name"])["num_sets"]
        .sum()
        .unstack(fill_value=0)
        .reset_index()
    )
    series = top_themes + (["Other"] if "Other" in wide.columns else [])
    write_json("themes_by_year", wide.to_dict(orient="records"))
    write_json("top_themes", series)


def export_colors(conn):
    df = read_table(conn, "agg_color_usage_by_year")
    totals = df.groupby("color_name")["total_quantity"].sum().sort_values(ascending=False)
    top_colors = list(totals.head(TOP_N_COLORS).index)

    df = df.copy()
    df["color_name"] = df["color_name"].where(df["color_name"].isin(top_colors), "Other")
    wide = (
        df.groupby(["year", "color_name"])["total_quantity"]
        .sum()
        .unstack(fill_value=0)
        .reset_index()
    )
    series = top_colors + (["Other"] if "Other" in wide.columns else [])
    write_json("colors_by_year", wide.to_dict(orient="records"))
    write_json("top_colors", series)

    trans_by_year = (
        df.groupby(["year", "is_trans"])["total_quantity"]
        .sum()
        .reset_index()
        .pivot(index="year", columns="is_trans", values="total_quantity")
        .fillna(0)
        .rename(columns={0: "opaque_quantity", 1: "trans_quantity"})
        .reset_index()
    )
    trans_by_year["trans_share"] = trans_by_year["trans_quantity"] / (
        trans_by_year["opaque_quantity"] + trans_by_year["trans_quantity"]
    )
    write_json("trans_share_by_year", trans_by_year.to_dict(orient="records"))


def export_parts(conn):
    categories = read_table(conn, "agg_part_category_counts")
    write_json("part_categories", categories.to_dict(orient="records"))

    reuse = read_table(conn, "agg_part_reuse").head(TOP_N_PARTS)
    write_json("top_reused_parts", reuse.to_dict(orient="records"))


def export_minifigs(conn):
    by_year = read_table(conn, "agg_minifigs_by_year")
    write_json("minifigs_by_year", by_year.to_dict(orient="records"))

    by_theme = read_table(conn, "agg_minifigs_by_theme").head(TOP_N_THEMES)
    write_json("minifigs_by_theme", by_theme.to_dict(orient="records"))


def main():
    conn = sqlite3.connect(DB_PATH)
    try:
        export_sets_overview(conn)
        export_themes(conn)
        export_colors(conn)
        export_parts(conn)
        export_minifigs(conn)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
