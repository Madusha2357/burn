import { Injectable } from '@angular/core';
import {
  ICreateQuizResponseDto,
  ProjectionQuizResponseDataTable,
  ProjectionUserDataTable,
  QuestionDataTable,
  QuizResponseResult,
  RecordStatus,
  UpdateUserDto,
} from '@damen/models';
import { Observable, of, throwError } from 'rxjs';
import { QuizService } from './quiz.service.abstract';

@Injectable({ providedIn: 'root' })
export class QuizMockService extends QuizService {
  constructor() {
    super();
  }

  updateUserAddress(
    id: string,
    updateUserDto: UpdateUserDto
  ): Observable<ProjectionUserDataTable> {
    throw new Error('Method not implemented.');
  }

  /**
   * Return the Question data table
   * @param order getting order number from component
   */
  getQuestionByOrder(id: string, order: number): Observable<QuestionDataTable> {
    const question1: QuestionDataTable = {
      _id: '1',
      text: 'Test question 1 from SeaXplorer',
      videoUrl: '',
      imageMobile: '',
      choices: [
        { _id: '1', text: 'answer 1', correctAnswer: true },
        { _id: '2', text: 'answer 2', correctAnswer: false },
        { _id: '3', text: 'answer 3', correctAnswer: false },
        { _id: '4', text: 'answer 4', correctAnswer: false },
      ],
      timerInSeconds: 10,
      status: RecordStatus.ACTIVE,
      displayOrder: 1,
      isMultipleChoice: true,
      image: '',
    };

    const question2: QuestionDataTable = {
      _id: '2',
      text: 'Test question 2 from SeaXplorer',
      videoUrl: '',
      imageMobile: '',
      choices: [
        { _id: '1', text: 'answer 5', correctAnswer: true },
        { _id: '2', text: 'answer 6', correctAnswer: false },
        { _id: '3', text: 'answer 7', correctAnswer: false },
        { _id: '4', text: 'answer 8', correctAnswer: false },
      ],
      timerInSeconds: 20,
      status: RecordStatus.ACTIVE,
      displayOrder: 2,
      isMultipleChoice: false,
      image: '',
    };

    const question3: QuestionDataTable = {
      _id: '3',
      text: 'Test question 3 from SeaXplorer',
      videoUrl: '',
      imageMobile: '',
      choices: [
        { _id: '1', text: 'answer 9', correctAnswer: true },
        { _id: '2', text: 'answer 10', correctAnswer: false },
        { _id: '3', text: 'answer 11', correctAnswer: false },
        { _id: '4', text: 'answer 12', correctAnswer: false },
      ],
      timerInSeconds: 5,
      status: RecordStatus.ACTIVE,
      displayOrder: 3,
      isMultipleChoice: false,
      image: '',
    };
    if (order == 1) {
      return of(question1);
    } else if (order == 2) {
      return of(question2);
    } else if (order == 3) {
      return of(question3);
    } else {
      return throwError(() => new Error('Wrong Question'));
    }
  }

  /**
   *
   * @param id getting from component
   * @param answer getting from component
   */
  patchAnswer(
    id: string,
    quizResponse: QuizResponseResult
  ): Observable<string> {
    return of('answer submitted!');
  }

  /**
   *
   * @param dto create quize response
   */
  createQuestionResponse(
    dto: ICreateQuizResponseDto
  ): Observable<ProjectionQuizResponseDataTable> {
    throw new Error('Method not implemented.');
  }
}
