import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import {
  PATH_QUESTIONS,
  PATH_QUIZZES,
  PATH_TRIGGER_EVENTS,
  PATH_USER,
} from '../../admin-routing.consts';
import { IMPORTS } from './side-nav.component.utils';

interface ListItem {
  icon: string;
  label: string;
  path: string;
}

@Component({
  selector: 'damen-side-nav',
  standalone: true,
  imports: [...IMPORTS, CommonModule],
  template: `
    <mat-nav-list>
      <mat-list-item *ngFor="let item of items" (click)="onItem(item)">
        <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
        <span>{{ item.label }}</span>
      </mat-list-item>
    </mat-nav-list>
  `,
  styles: [],
})
export class SideNavComponent {
  items: ListItem[] = [
    {
      icon: 'person',
      label: 'Users',
      path: PATH_USER,
    },
    // {
    //   icon: 'quize',
    //   label: 'Quizzes',
    //   path: PATH_QUIZZES,
    // },
    // {
    //   icon: 'help',
    //   label: 'Questions',
    //   path: PATH_QUESTIONS,
    // },
    // {
    //   icon: 'help',
    //   label: 'Events',
    //   path: PATH_TRIGGER_EVENTS,
    // },
  ];

  constructor(private store: Store, private route: ActivatedRoute) {}

  onItem(listItem: ListItem) {
    const nav = new Navigate([listItem.path], undefined, {
      relativeTo: this.route,
    });
    this.store.dispatch([nav]);
  }
}
