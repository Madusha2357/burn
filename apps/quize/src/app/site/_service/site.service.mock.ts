import { Injectable } from '@angular/core';
import {
  Page,
  ProjectionQuizDataTable,
  ProjectionUserDataTable,
} from '@damen/models';
import { Observable } from 'rxjs';
import { SiteService } from './site.service.abstract';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Injectable({ providedIn: 'root' })
export class SiteMockService extends SiteService {
  override findUserById(id: string): Observable<ProjectionUserDataTable> {
    throw new Error('Method not implemented.');
  }
  constructor() {
    super();
  }

  override findRegisteredUsers(
    event: string,
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionUserDataTable>> {
    throw new Error('Method not implemented.');
  }

  /**
   * calling to httpClient in back-end and it returns dummy(hard coded) Date,
   * This is only for testing.
   */
  getTimer(): Observable<ProjectionQuizDataTable> {
    throw new Error('Method not implemented.');
  }
}
