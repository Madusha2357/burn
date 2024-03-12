import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionNewComponent } from './terms-and-condition-new.component';

describe('TermsAndConditionNewComponent', () => {
  let component: TermsAndConditionNewComponent;
  let fixture: ComponentFixture<TermsAndConditionNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsAndConditionNewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsAndConditionNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
