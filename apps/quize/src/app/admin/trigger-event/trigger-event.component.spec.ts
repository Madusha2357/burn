import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriggerEventComponent } from './trigger-event.component';

describe('TriggerEventComponent', () => {
  let component: TriggerEventComponent;
  let fixture: ComponentFixture<TriggerEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TriggerEventComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TriggerEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
