import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TriggerEventComponent } from './trigger-event.component';

const routes: Routes = [{ path: '', component: TriggerEventComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TriggerEventRoutingModule {}
