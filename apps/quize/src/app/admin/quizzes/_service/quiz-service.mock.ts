import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import {
  ICreateQuizDto,
  Page,
  ProjectionQuizDataTable,
  ProjectionQuizResponseOverview,
  UpdateQuizDto,
  UpdateQuizResponseDto,
} from '@damen/models';
import { Observable, of, throwError } from 'rxjs';
import { QuizService } from './quiz-service.abstract';

@Injectable({ providedIn: 'root' })
export class QuizMockService extends QuizService {
  fakeData = [...Array(127)].map(() => fakeQuiz());
  constructor() {
    super();
  }

  override downloadQuizResults(quizId: string): unknown {
    throw new Error('Method not implemented.');
  }

  findResultsByQuiz(
    quizId: string
  ): Observable<ProjectionQuizResponseOverview[]> {
    throw new Error('Method not implemented.');
  }

  update(
    id: string,
    updateQuizDto: UpdateQuizDto
  ): Observable<ProjectionQuizDataTable> {
    throw new Error('Method not implemented.');
  }

  updateQuizResponse(
    id: string,
    updateQuizResDto: UpdateQuizResponseDto
  ): Observable<ProjectionQuizResponseOverview> {
    throw new Error('Method not implemented.');
  }

  findAll(data: [Sort, PageEvent]): Observable<Page<ProjectionQuizDataTable>> {
    const page = data[1];
    const sort = data[0];
    const start = page.pageIndex * page.pageSize;
    const end = start + page.pageSize;
    const sorted = this.fakeData.sort((a, b) => {
      if (sort.direction == 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    const sliced = sorted.slice(start, end);
    return of({
      data: sliced,
      page: { ...page, length: this.fakeData.length },
    });
  }

  save(dto: ICreateQuizDto): Observable<ProjectionQuizDataTable> {
    if (dto.name == 'Error') return throwError(() => new Error('Test Error'));
    const fake = fakeQuiz();
    fake.name = 'AAA Quiz';
    this.fakeData.push(fake);
    return of(fake);
  }

  findAllByUserId(
    data: [Sort, PageEvent],
    id: string
  ): Observable<Page<ProjectionQuizDataTable>> {
    const page = data[1];
    const sort = data[0];
    const start = page.pageIndex * page.pageSize;
    const end = start + page.pageSize;
    const sorted = this.fakeData.sort((a, b) => {
      if (sort.direction == 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    const sliced = sorted.slice(start, end);
    return of({
      data: sliced,
      page: { ...page, length: this.fakeData.length },
    });
  }

  // findAllByName(name: string): Observable<Page<ProjectionQuizSelect>> {
  //   const sliced = this.fakeData.slice(0, 5);
  //   return of({
  //     data: sliced,
  //     page: { pageIndex: 0, pageSize: 5, length: this.fakeData.length },
  //   });
  // }
}

function fakeQuiz(): ProjectionQuizDataTable {
  return {
    _id: '1234',
    name: `Grand Quiz 1`,
    startTime: new Date(),
    endTime: new Date(),
    createdAt: new Date(),
    minimalAnswerCountForWinning: 50,
  };
}
