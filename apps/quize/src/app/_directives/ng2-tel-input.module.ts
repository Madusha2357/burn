import { NgModule, ModuleWithProviders } from '@angular/core';
import { Ng2TelInputDirective } from './ng2-tel-input';

@NgModule({
  declarations: [Ng2TelInputDirective],
  exports: [Ng2TelInputDirective],
})
export class Ng2TelInputModule {
  static forRoot(): ModuleWithProviders<Ng2TelInputModule> {
    return {
      ngModule: Ng2TelInputModule,
      providers: [],
    };
  }
}
