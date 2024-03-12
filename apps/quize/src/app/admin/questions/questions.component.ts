import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page, ProjectionQuestionDataTable } from '@damen/models';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { QuestionState } from './_state/question.state';
import { navigateToUpsert } from '../../_utils/crud.utils';

@Component({
  selector: 'damen-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
})
export class QuestionsComponent {
  pagedRecords$: Observable<Page<ProjectionQuestionDataTable>>;

  constructor(private store: Store, private activatedRoute: ActivatedRoute) {
    this.pagedRecords$ = this.store.select(QuestionState.pagedRecords);
  }

  onAdd() {
    navigateToUpsert(this.activatedRoute, this.store);
  }

  onEdit(item: ProjectionQuestionDataTable) {
    navigateToUpsert(this.activatedRoute, this.store, item._id);
  }
}
