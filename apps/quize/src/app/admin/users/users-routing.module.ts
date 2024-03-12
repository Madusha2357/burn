import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserDataResolver } from './_resolvers/user-data.resolver';

const routes: Routes = [
  { path: '', component: UsersComponent },
  {
    path: ':id',
    loadComponent: () =>
      import('./_components/users-upsert/users-upsert.component').then(
        (m) => m.UsersUpsertComponent
      ),
    resolve: { user: UserDataResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
