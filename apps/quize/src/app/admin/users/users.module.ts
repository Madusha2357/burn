import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../../../environments/environment';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UsersListComponent } from './_components/users-list/users-list.component';
import { UserService } from './_service/user-service.abstract';
import { UserMockService } from './_service/user-service.mock';
import { UserHttpService } from './_service/user.service';
import { UserState } from './_state/user.state';

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    NgxsModule.forFeature([UserState]),
    QuizzesModule,
    UsersListComponent,
  ],
  providers: [
    {
      provide: UserService,
      useClass: environment.useMock ? UserMockService : UserHttpService,
    },
  ],
})
export class UsersModule {}
