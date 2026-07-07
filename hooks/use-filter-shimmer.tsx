"use client";

import * as React from "react";

/**
 * Shows a brief shimmer/skeleton state when filter or search dependencies change,
 * giving users tactile feedback that their action was acknowledged — even when
 * the underlying filter is synchronous (useMemo over local data).
 *
 * Skips the very first render so the shimmer doesn't flash on initial mount.
 *
 * @param deps   - Dependency tuple (selected filter ids, debounced search, etc.)
 * @param delay  - How long the shimmer stays visible after the last change. Default 280ms.
 *
 * @example
 *   const isFiltering = useFilterShimmer(
 *     [debouncedSearch, selectedDepartmentIds, selectedRole],
 *     300
 *   );
 *   {isFiltering ? <TableSkeleton /> : <EmployeeTable ... />}
 */
export function useFilterShimmer(deps: ReadonlyArray<unknown>, delay: number = 280): boolean {
  const [isFiltering, setIsFiltering] = React.useState(false);
  const isFirstRunRef = React.useRef(true);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    // Skip the initial mount — we don't want a shimmer on first paint
    if (isFirstRunRef.current) {
      isFirstRunRef.current = false;
      return;
    }

    setIsFiltering(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsFiltering(false);
      timeoutRef.current = null;
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return isFiltering;
}

export default useFilterShimmer;
