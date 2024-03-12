import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TriggerEventRoutingModule } from './trigger-event-routing.module';
import { NgxsModule } from '@ngxs/store';
import { EventState } from './_state/trigger-event.state';
import { environment } from 'apps/quize/src/environments/environment';
import { IMPORTS } from './_component/trigger-event-list/trigger-event-list.imports';
import { TriggerEventListComponent } from './_component/trigger-event-list/trigger-event-list.component';
import { TriggerEventComponent } from './trigger-event.component';
import { EventHttpService } from './_service/trigger-event.service';
import { EventMockService } from './_service/trigger-event-service.mock';
import { EventService } from './_service/trigger-event-service.abstract';

@NgModule({
  declarations: [TriggerEventComponent],
  imports: [
    CommonModule,
    TriggerEventRoutingModule,
    NgxsModule.forFeature([EventState]),
    IMPORTS,
    TriggerEventListComponent,
  ],
  providers: [
    {
      provide: EventService,
      useClass: environment.useMock ? EventMockService : EventHttpService,
    },
  ],
})
export class TriggerEventModule {}
