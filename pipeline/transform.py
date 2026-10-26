"""Derive analysis tables (agg_*) in data/lego.db from the raw Rebrickable tables.

Each agg_* table backs one analysis module (sets, themes, colors, parts, minifigs)
and is rebuilt from scratch every run, so this script is safe to re-run after
re-loading fresh data.

Usage:
    python pipeline/transform.py
"""

import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / "data" / "lego.db"

TRANSFORMS = {
    "agg_sets_by_year": """
        SELECT
            year,
            COUNT(*) AS num_sets,
            AVG(num_parts) AS avg_parts,
            SUM(num_parts) AS total_parts
        FROM sets
        WHERE year IS NOT NULL
        GROUP BY year
        ORDER BY year
    """,
    "agg_sets_by_theme_year": """
        SELECT
            s.year,
            t.id AS theme_id,
            t.name AS theme_name,
            COUNT(*) AS num_sets,
            SUM(s.num_parts) AS total_parts
        FROM sets s
        JOIN themes t ON s.theme_id = t.id
        WHERE s.year IS NOT NULL
        GROUP BY s.year, t.id
        ORDER BY s.year, num_sets DESC
    """,
    "agg_color_usage_by_year": """
        SELECT
            s.year,
            c.id AS color_id,
            c.name AS color_name,
            c.is_trans,
            SUM(ip.quantity) AS total_quantity
        FROM inventory_parts ip
        JOIN inventories i ON ip.inventory_id = i.id
        JOIN sets s ON i.set_num = s.set_num
        JOIN colors c ON ip.color_id = c.id
        WHERE s.year IS NOT NULL AND ip.is_spare = 0
        GROUP BY s.year, c.id
        ORDER BY s.year, total_quantity DESC
    """,
    "agg_part_category_counts": """
        SELECT
            pc.id AS part_cat_id,
            pc.name AS category_name,
            COUNT(*) AS num_parts
        FROM parts p
        JOIN part_categories pc ON p.part_cat_id = pc.id
        GROUP BY pc.id
        ORDER BY num_parts DESC
    """,
    "agg_part_reuse": """
        SELECT
            p.part_num,
            p.name AS part_name,
            pc.name AS category_name,
            COUNT(DISTINCT i.set_num) AS num_sets,
            SUM(ip.quantity) AS total_quantity
        FROM inventory_parts ip
        JOIN inventories i ON ip.inventory_id = i.id
        JOIN parts p ON ip.part_num = p.part_num
        LEFT JOIN part_categories pc ON p.part_cat_id = pc.id
        WHERE ip.is_spare = 0
        GROUP BY p.part_num
        ORDER BY num_sets DESC
    """,
    "agg_minifigs_by_year": """
        SELECT
            s.year,
            COUNT(DISTINCT im.fig_num) AS distinct_minifigs,
            SUM(im.quantity) AS total_minifig_count
        FROM inventory_minifigs im
        JOIN inventories i ON im.inventory_id = i.id
        JOIN sets s ON i.set_num = s.set_num
        WHERE s.year IS NOT NULL
        GROUP BY s.year
        ORDER BY s.year
    """,
    "agg_minifigs_by_theme": """
        SELECT
            t.id AS theme_id,
            t.name AS theme_name,
            COUNT(DISTINCT im.fig_num) AS distinct_minifigs,
            SUM(im.quantity) AS total_minifig_count
        FROM inventory_minifigs im
        JOIN inventories i ON im.inventory_id = i.id
        JOIN sets s ON i.set_num = s.set_num
        JOIN themes t ON s.theme_id = t.id
        GROUP BY t.id
        ORDER BY distinct_minifigs DESC
    """,
}


def main():
    conn = sqlite3.connect(DB_PATH)
    try:
        cur = conn.cursor()
        for table, select_sql in TRANSFORMS.items():
            cur.execute(f"DROP TABLE IF EXISTS {table}")
            cur.execute(f"CREATE TABLE {table} AS {select_sql}")
            (count,) = cur.execute(f"SELECT COUNT(*) FROM {table}").fetchone()
            print(f"built {table:<28} {count:>7,} rows")
        conn.commit()
    finally:
        conn.close()


if __name__ == "__main__":
    main()
