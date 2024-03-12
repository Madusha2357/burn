import { Injectable } from '@angular/core';
import {
  Page,
  ProjectionQuestionDataTable,
  ProjectionQuizResponseOverview,
  QuizResponseResult,
  QuizResponseStatus,
} from '@damen/models';
import { Observable, of } from 'rxjs';
import { QuizResponseService } from './quiz-response.abstarct';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Injectable({ providedIn: 'root' })
export class QuizResponseMockService extends QuizResponseService {
  results = [...Array(27)].map(() => fakeQuectionResult());

  findOneByKey(
    userId: string,
    quizId: string
  ): Observable<ProjectionQuizResponseOverview[]> {
    const res: ProjectionQuizResponseOverview[] = [
      {
        user: {
          _id: userId,
          email: 'text@example.com',
          name: 'full Name',
        },
        quiz: [
          {
            _id: quizId,
            name: 'Fake quiz 1',
            minimalAnswerCountForWinning: 2,
          },
        ],
        responses: this.results,
        _id: '',
      },
    ];
    return of(res);
  }

  findAll(
    data: [Sort, PageEvent]
  ): Observable<Page<ProjectionQuizResponseOverview>> {
    throw new Error('Method not implemented.');
  }

  findByQuizId(
    data: [Sort, PageEvent],
    quiz: string
  ): Observable<Page<ProjectionQuestionDataTable>> {
    throw new Error('Method not implemented.');
  }
}

export function fakeQuectionResult(): QuizResponseResult {
  return {
    questionId: '1234455666',
    question: 'Fake data',
    answer: ['1'],
    duration: 1000,
    responseStatus: QuizResponseStatus.SKIPED,
  };
}
