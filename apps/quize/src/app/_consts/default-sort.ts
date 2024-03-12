import { Sort, SortDirection } from '@angular/material/sort';
import { DEFAULT_ORDER, DEFAULT_SORT_BY_FIELD } from '@damen/models';

export const DEFAULT_SORT: Sort = {
  active: DEFAULT_SORT_BY_FIELD,
  direction: DEFAULT_ORDER as SortDirection,
};
