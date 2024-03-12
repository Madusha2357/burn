import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { IMPORTS } from './admin.module.utils';
import { AdminState } from './_state/admin.state';

@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgxsModule.forFeature([AdminState]),
    ...IMPORTS,
  ],
})
export class AdminModule {}
