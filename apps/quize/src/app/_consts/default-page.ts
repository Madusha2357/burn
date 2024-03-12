import { PageEvent } from '@angular/material/paginator';
import { DEFAULT_SKIP, DEFAULT_LIMIT } from '@damen/models';

export const DEFAULT_PAGE: PageEvent = {
  pageIndex: DEFAULT_SKIP,
  pageSize: DEFAULT_LIMIT,
  length: 0,
};
