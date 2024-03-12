import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { UsersComponent } from './users.component';
import { UserService } from './_service/user-service.abstract';
import { UserMockService } from './_service/user-service.mock';
import { UserState } from './_state/user.state';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
      providers: [
        {
          provide: UserService,
          useValue: new UserMockService(),
        },
      ],
      imports: [NoopAnimationsModule, NgxsModule.forRoot([UserState])],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
