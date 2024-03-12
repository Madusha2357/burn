import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeaXplorerComponent } from './sea-xplorer.component';

describe('SeaXplorerComponent', () => {
  let component: SeaXplorerComponent;
  let fixture: ComponentFixture<SeaXplorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeaXplorerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeaXplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
