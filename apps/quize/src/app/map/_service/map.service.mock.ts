import { Injectable } from '@angular/core';
import { ICreateUserDto, IDoctorNotificatoin } from '@damen/models';
import { Observable } from 'rxjs';
import { MapService } from './map.service.abstract';

@Injectable({ providedIn: 'root' })
export class MapMockService extends MapService {
  override doctorNotification(
    details: IDoctorNotificatoin,
    id: string
  ): Observable<any> {
    throw new Error('Method not implemented.');
  }
  override getDoctors(): Observable<ICreateUserDto[]> {
    throw new Error('Method not implemented.');
  }
  override getHospitals(): Observable<ICreateUserDto[]> {
    throw new Error('Method not implemented.');
  }
  constructor() {
    super();
  }
}
