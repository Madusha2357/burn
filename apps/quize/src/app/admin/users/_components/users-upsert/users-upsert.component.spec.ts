import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { UserState } from '../../_state/user.state';

import { UsersUpsertComponent } from './users-upsert.component';

describe('UsersUpsertComponent', () => {
  let component: UsersUpsertComponent;
  let fixture: ComponentFixture<UsersUpsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersUpsertComponent, NgxsModule.forRoot([UserState])],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersUpsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
