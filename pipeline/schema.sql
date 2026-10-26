PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

-- core lookup tables

CREATE TABLE IF NOT EXISTS part_categories (
  id INTEGER PRIMARY KEY,
  name TEXT
);

CREATE TABLE IF NOT EXISTS colors (
  id INTEGER PRIMARY KEY,
  name TEXT,
  rgb TEXT,
  is_trans INTEGER, -- 0/1
  num_parts INTEGER,
  num_sets INTEGER,
  y1 INTEGER,
  y2 INTEGER
);

CREATE TABLE IF NOT EXISTS themes (
  id INTEGER PRIMARY KEY,
  name TEXT,
  parent_id INTEGER
);

-- parts and relationships

CREATE TABLE IF NOT EXISTS parts (
  part_num TEXT PRIMARY KEY,
  name TEXT,
  part_cat_id INTEGER,
  part_material TEXT
);

CREATE TABLE IF NOT EXISTS part_relationships (
  rel_type TEXT,
  child_part_num TEXT,
  parent_part_num TEXT
);

-- physical elements (a part + color combination)

CREATE TABLE IF NOT EXISTS elements (
  element_id TEXT PRIMARY KEY,
  part_num TEXT,
  color_id INTEGER,
  design_id INTEGER
);

-- sets and minifigs

CREATE TABLE IF NOT EXISTS sets (
  set_num TEXT PRIMARY KEY,
  name TEXT,
  year INTEGER,
  theme_id INTEGER,
  num_parts INTEGER,
  img_url TEXT
);

CREATE TABLE IF NOT EXISTS minifigs (
  fig_num TEXT PRIMARY KEY,
  name TEXT,
  num_parts INTEGER,
  img_url TEXT
);

-- inventories and inventory items

CREATE TABLE IF NOT EXISTS inventories (
  id INTEGER PRIMARY KEY,
  version INTEGER,
  set_num TEXT
);

CREATE TABLE IF NOT EXISTS inventory_parts (
  inventory_id INTEGER,
  part_num TEXT,
  color_id INTEGER,
  quantity INTEGER,
  is_spare INTEGER, -- 0/1
  img_url TEXT
);

CREATE TABLE IF NOT EXISTS inventory_minifigs (
  inventory_id INTEGER,
  fig_num TEXT,
  quantity INTEGER
);

CREATE TABLE IF NOT EXISTS inventory_sets (
  inventory_id INTEGER,
  set_num TEXT,
  quantity INTEGER
);

-- indexes to speed joins/queries
CREATE INDEX IF NOT EXISTS idx_parts_part_cat_id ON parts(part_cat_id);
CREATE INDEX IF NOT EXISTS idx_elements_part_num ON elements(part_num);
CREATE INDEX IF NOT EXISTS idx_elements_color_id ON elements(color_id);
CREATE INDEX IF NOT EXISTS idx_sets_theme_id ON sets(theme_id);
CREATE INDEX IF NOT EXISTS idx_invent_parts_inv ON inventory_parts(inventory_id);
CREATE INDEX IF NOT EXISTS idx_invent_minifigs_inv ON inventory_minifigs(inventory_id);
CREATE INDEX IF NOT EXISTS idx_invent_sets_inv ON inventory_sets(inventory_id);

COMMIT;
PRAGMA foreign_keys = ON;
