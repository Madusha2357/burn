import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterInfomationComponent } from './enter-infomation.component';

describe('EnterInfomationComponent', () => {
  let component: EnterInfomationComponent;
  let fixture: ComponentFixture<EnterInfomationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ EnterInfomationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterInfomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
