export interface SetsByYear {
  year: number;
  num_sets: number;
  avg_parts: number;
  total_parts: number;
}

/** Wide-format row: year plus one numeric key per series name (from top_themes/top_colors). */
export type SeriesByYear = { year: number } & Record<string, number>;

export interface TransShareByYear {
  year: number;
  opaque_quantity: number;
  trans_quantity: number;
  trans_share: number;
}

export interface PartCategoryCount {
  part_cat_id: number;
  category_name: string;
  num_parts: number;
}

export interface TopReusedPart {
  part_num: string;
  part_name: string;
  category_name: string | null;
  num_sets: number;
  total_quantity: number;
}

export interface MinifigsByYear {
  year: number;
  distinct_minifigs: number;
  total_minifig_count: number;
}

export interface MinifigsByTheme {
  theme_id: number;
  theme_name: string;
  distinct_minifigs: number;
  total_minifig_count: number;
}
