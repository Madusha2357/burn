/* eslint-disable @typescript-eslint/no-var-requires */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule, Store } from '@ngxs/store';
import { SiteComponent } from './site.component';
import { SiteService } from './_service/site.service.abstract';
import { SiteMockService } from './_service/site.service.mock';
import { SiteState } from './_state/site.state';

describe('AppComponent', () => {
  let component: SiteComponent;
  let fixture: ComponentFixture<SiteComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SiteComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NgxsModule.forRoot([SiteState], {
          developmentMode: true,
        }),
      ],
      providers: [{ provide: SiteService, useValue: new SiteMockService() }],
    }).compileComponents();
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(SiteComponent);
    component = fixture.componentInstance;
  });

  it('should create the site component', () => {
    expect(component).toBeTruthy();
  });

  it('should time zone names equel to moment-timezone s names', () => {
    const moment = require('moment-timezone');
    const timeZoneName = component.timeZoneNames;
    expect(timeZoneName).toEqual(moment.tz.names());
  });

  it('should selected time zone equal to GMT+0', () => {
    const timeZoneName = component.selectedTimeZone;
    expect(timeZoneName).toBe('GMT+0');
  });

  it('should offset default value equal to 0', () => {
    const offset = component.offset;
    expect(offset).toBe(0);
  });

  it('should default selected time zone offset value equal to 0', () => {
    const moment = require('moment-timezone');
    const offset = moment.utc().tz('GMT+0').utcOffset();
    expect(offset).toBe(0);
  });

  it('should default Iran time zone offset value equal to 210', () => {
    const moment = require('moment-timezone');
    const offset = moment.utc().tz('Iran').utcOffset();
    expect(offset).toBe(210);
  });

  it('should default Iran time zone offset value equal to 210', () => {
    const timeZoneName = component.countDownTimer;
    expect(timeZoneName).toBe('');
  });
});
