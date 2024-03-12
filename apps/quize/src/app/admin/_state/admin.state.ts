import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ToggleDrawer } from './admin.actions';

export interface AdminStateModel {
  drawerOpen: boolean;
}

@State<AdminStateModel>({
  name: 'admin',
  defaults: { drawerOpen: true },
})
@Injectable({ providedIn: 'root' })
export class AdminState {
  @Selector() static drawerOpen(state: AdminStateModel) {
    return state.drawerOpen;
  }

  /**
   * Toggle drawer action
   * @returns drawer open (true, false)
   */
  @Action(ToggleDrawer)
  onDrawerOpen({ patchState, getState }: StateContext<AdminStateModel>) {
    return patchState({ drawerOpen: !getState().drawerOpen });
  }
}
