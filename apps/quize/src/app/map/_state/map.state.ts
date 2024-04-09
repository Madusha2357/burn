import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { tap } from 'rxjs';

import {
  DoctorNotification,
  DoctorNotificationAll,
  GetDoctors,
  GetHospitals,
  GetUserM,
  UpdateUserM,
} from './map.actions';
import { MapService } from '../_service/map.service.abstract';
import { ICreateUserDto } from '@damen/models';
import { Navigate } from '@ngxs/router-plugin';

export interface MapStateModel {
  hospitals?: ICreateUserDto[];
  doctors?: ICreateUserDto[];
  user?: ICreateUserDto;
}

@State<MapStateModel>({
  name: 'map',
  defaults: { hospitals: [] as ICreateUserDto[] },
})
@Injectable({ providedIn: 'root' })
export class MapState {
  constructor(private mapService: MapService, private store: Store) {}

  @Selector() static hospitals(state: MapStateModel) {
    return state.hospitals;
  }

  @Selector() static doctors(state: MapStateModel) {
    return state.doctors;
  }

  @Selector() static user(state: MapStateModel) {
    return state.user;
  }

  /**
   * Get quiz action
   */
  @Action(GetHospitals)
  getHospitals({ patchState }: StateContext<MapStateModel>) {
    return this.mapService.getHospitals().pipe(
      tap((hospitals) => {
        patchState({ hospitals });
      })
    );
  }

  /**
   * Get quiz action
   */
  @Action(GetDoctors)
  getDoctors({ patchState }: StateContext<MapStateModel>) {
    return this.mapService.getDoctors().pipe(
      tap((hospitals) => {
        patchState({ hospitals });
      })
    );
  }

  @Action(DoctorNotification)
  doctorNotification(
    { patchState }: StateContext<MapStateModel>,
    { details, id }: DoctorNotification
  ) {
    return this.mapService.doctorNotification(details, id);
  }

  @Action(DoctorNotificationAll)
  doctorAllNotification(
    { patchState }: StateContext<MapStateModel>,
    { details }: DoctorNotificationAll
  ) {
    return this.mapService.doctorAllNotification(details);
  }

  @Action(UpdateUserM)
  updateUser(state: StateContext<MapStateModel>, { id, data }: UpdateUserM) {
    return this.mapService.update(id, data);
    // .pipe(tap(() => state.dispatch(new Navigate(['login']))));
  }

  @Action(GetUserM)
  getUserM(state: StateContext<MapStateModel>, { id }: GetUserM) {
    return this.mapService
      .getUser(id)
      .pipe(tap((user) => state.setState({ user })));
  }
}
