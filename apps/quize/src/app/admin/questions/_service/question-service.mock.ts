import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import {
  ICreateQuestionDto,
  ImageUploaded,
  Page,
  ProjectionQuestionDataTable,
} from '@damen/models';
import { Observable } from 'rxjs';
import { QUESTION_OBJECT_STORE_NAME } from '../../../_services/indexed-db/indexed-db.consts';
import { IndexedDbService } from '../../../_services/indexed-db/indexed-db.service';
import { QuestionService } from './question-service.abstract';

@Injectable({ providedIn: 'root' })
export class QuestionMockService extends QuestionService {
  override uploadImage(formData: FormData): Observable<ImageUploaded> {
    throw new Error('Method not implemented.');
  }
  constructor(private indexedDbService: IndexedDbService) {
    super();
  }

  findByQuizId(
    data: [Sort, PageEvent],
    id: string
  ): Observable<Page<ProjectionQuestionDataTable>> {
    throw new Error('Method not implemented.');
  }

  findAll(data: [Sort, PageEvent]) {
    return this.indexedDbService.findAll<ProjectionQuestionDataTable>(
      QUESTION_OBJECT_STORE_NAME,
      data
    );
  }

  save(dto: ICreateQuestionDto): Observable<ProjectionQuestionDataTable> {
    return this.indexedDbService.create<ProjectionQuestionDataTable>(
      QUESTION_OBJECT_STORE_NAME,
      dto
    );
  }

  update(
    id: string,
    updateQuestionDto: ProjectionQuestionDataTable
  ): Observable<ProjectionQuestionDataTable> {
    throw new Error('Method not implemented.');
  }
}
