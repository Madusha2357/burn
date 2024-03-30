import { Injectable } from '@angular/core';
import {
  ICreateUserDto,
  IDoctorNotificatoin,
  ProjectionUserDataTable,
  UpdateUserDto,
} from '@damen/models';
import { Observable } from 'rxjs';
import { MapService } from './map.service.abstract';

@Injectable({ providedIn: 'root' })
export class MapMockService extends MapService {
  override getUser(id: string): Observable<ICreateUserDto> {
    throw new Error('Method not implemented.');
  }
  override update(
    id: string,
    data: UpdateUserDto
  ): Observable<ProjectionUserDataTable> {
    throw new Error('Method not implemented.');
  }
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
