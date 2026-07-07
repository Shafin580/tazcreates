/**
 * Generic "exclude-self" faceted count computation for client-side filter
 * sidebars (checkbox groups showing a live count next to each option).
 *
 * Semantics:
 * - Each row is first gated by `config.include` (default: always include).
 * - `matchTotal` counts rows that match EVERY active selection across both
 *   `facets` and `constraints`.
 * - A facet's own bucket counts use "exclude-self" logic: a row contributes
 *   to facet F's buckets iff it satisfies every OTHER active selection
 *   (F's own selection is ignored while counting F's buckets). This lets a
 *   filter sidebar show, for each option in facet F, how many rows would
 *   match if that option were (also) selected, given everything else
 *   currently selected.
 * - `constraints` affect matching (and other facets' exclude-self checks)
 *   but never get buckets of their own. Pass `null` as a constraint's getter
 *   to mark it as an "always matches" constraint — used for filters that are
 *   enforced by the backend query and therefore have no signal on the
 *   client-side row, but whose selection should still count as "active" for
 *   bookkeeping purposes.
 * - A key with no selection (missing from `selection`, or an empty array)
 *   matches everything and does not participate in matching/exclude-self.
 *
 * @example
 * ```ts
 * type User = { isActive: boolean; roleId: number | null; teamIds: number[] };
 *
 * const counts = computeFacetCounts<User>(
 *   users,
 *   { role: [2, 3], team: [10] }, // current selection
 *   {
 *     facets: {
 *       role: (u) => u.roleId,
 *       team: (u) => u.teamIds
 *     },
 *     include: (u) => u.isActive
 *   }
 * );
 *
 * counts.role.get(2); // rows matching every OTHER active selection, with roleId === 2
 * counts.matchTotal;  // rows matching every active selection
 * ```
 */

/**
 * Reads the facet/constraint id(s) off an item. Return `null`/`undefined` for "not assigned".
 * Ids are `number` throughout (matching `FilterItem.id`) — callers whose domain
 * ids are strings must coerce them to numbers before calling `computeFacetCounts`.
 */
export type FacetGetter<T> = (item: T) => number | number[] | null | undefined;

export interface FacetConfig<T> {
  /**
   * Counted facets: key -> id getter. Each key becomes a bucket map on the
   * returned `FacetCountMap` and must equal the corresponding
   * `FilterSection.key` used to render the filter UI.
   *
   * Reserved key: a facet may not be named `"matchTotal"` — that key is
   * reserved for the overall match count on `FacetCountMap`.
   */
  facets: Record<string, FacetGetter<T>>;
  /**
   * Constraint-only keys: affect `matchTotal` and other facets'
   * exclude-self checks, but never get buckets of their own. Pass `null`
   * as the getter to mark an "always matches" constraint — for filters
   * enforced by the backend query that have no signal on the client-side
   * row.
   */
  constraints?: Record<string, FacetGetter<T> | null>;
  /** Row gate applied before any counting. Default: `() => true`. */
  include?: (item: T) => boolean;
}

/** Currently selected ids per facet/constraint key. Missing or empty = "matches everything". */
export type FacetSelection = Record<string, number[]>;

/** One `Map<id, count>` per counted facet key, plus the overall `matchTotal`. */
export type FacetCountMap = Record<string, Map<number, number>> & {
  matchTotal: number;
};

function toIdArray(value: number | number[] | null | undefined): number[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function selectedIdsFor(key: string, selection: FacetSelection): number[] {
  return selection[key] ?? [];
}

function matchesSelection<T>(
  getter: FacetGetter<T> | null,
  item: T,
  selected: number[]
): boolean {
  if (getter === null) return true;
  if (selected.length === 0) return true;
  return toIdArray(getter(item)).some((id) => selected.includes(id));
}

/**
 * Computes exclude-self faceted counts + overall match total for `items`
 * against `selection`, per `config`. See file header for full semantics.
 */
export function computeFacetCounts<T>(
  items: readonly T[],
  selection: FacetSelection,
  config: FacetConfig<T>
): FacetCountMap {
  const facetKeys = Object.keys(config.facets);
  const constraintKeys = Object.keys(config.constraints ?? {});
  const allKeys = [...facetKeys, ...constraintKeys];
  const include = config.include ?? (() => true);

  const getterFor = (key: string): FacetGetter<T> | null => {
    if (key in config.facets) return config.facets[key];
    return config.constraints?.[key] ?? null;
  };

  const counts = Object.fromEntries(
    facetKeys.map((key) => [key, new Map<number, number>()])
  ) as FacetCountMap;
  counts.matchTotal = 0;

  // Precompute the selection snapshot per key so the inner loops don't
  // re-dispatch on every item.
  const selectedByKey = new Map<string, number[]>();
  for (const key of allKeys) {
    selectedByKey.set(key, selectedIdsFor(key, selection));
  }

  const activeKeys = allKeys.filter(
    (k) => (selectedByKey.get(k) ?? []).length > 0
  );

  for (const item of items) {
    if (!include(item)) continue;

    // Compute per-key match flags so we evaluate each predicate at most once.
    const matchFlags = new Map<string, boolean>();
    for (const k of activeKeys) {
      matchFlags.set(
        k,
        matchesSelection(getterFor(k), item, selectedByKey.get(k) ?? [])
      );
    }

    const matchesAll = activeKeys.every((k) => matchFlags.get(k) === true);
    if (matchesAll) counts.matchTotal += 1;

    for (const facet of facetKeys) {
      // Exclude-self: this item contributes to facet F's buckets if every
      // OTHER active selection is satisfied. The item's own F membership
      // still determines which buckets it lands in.
      const satisfiesOthers = activeKeys.every(
        (k) => k === facet || matchFlags.get(k) === true
      );
      if (!satisfiesOthers) continue;

      for (const id of toIdArray(config.facets[facet](item))) {
        counts[facet].set(id, (counts[facet].get(id) ?? 0) + 1);
      }
    }
  }

  return counts;
}
