import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

export class TriggerEvent {
  public static readonly type = '[TriggerEvent] TriggerEvent';
  constructor(public data: [Sort, PageEvent]) {}
}
