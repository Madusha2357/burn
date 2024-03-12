import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import {
  Page,
  ProjectionQuizDataTable,
  ProjectionUserDataTable,
} from '@damen/models';
import { Observable } from 'rxjs';

export abstract class SiteService {
  /**
   * Getting credintials from state and return access token.
   * @param credentials
   */

  abstract getTimer(): Observable<ProjectionQuizDataTable>;

  abstract findUserById(id: string): Observable<ProjectionUserDataTable>;

  abstract findRegisteredUsers(
    event: string,
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionUserDataTable>>;
}
