import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggerEventListComponent } from './trigger-event-list.component';

describe('UsersListComponent', () => {
  let component: TriggerEventListComponent;
  let fixture: ComponentFixture<TriggerEventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriggerEventListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TriggerEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
