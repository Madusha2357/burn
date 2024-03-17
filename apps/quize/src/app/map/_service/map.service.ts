import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ICreateUserDto,
  IDoctorNotificatoin,
  ProjectionUserDataTable,
  URL_USER,
  UpdateUserDto,
} from '@damen/models';
import { Observable, take } from 'rxjs';
import { MapService } from './map.service.abstract';

@Injectable({
  providedIn: 'root',
})
export class MapHttpService extends MapService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  /**
   * Return the Users data table
   * @param order getting order number from component
   */
  getHospitals(): Observable<ICreateUserDto[]> {
    return this.httpClient
      .get<ICreateUserDto[]>(`${URL_USER}/map-data/hospitals`)
      .pipe(take(1));
  }

  /**
   * Return the Users data table
   * @param order getting order number from component
   */
  getDoctors(): Observable<ICreateUserDto[]> {
    return this.httpClient
      .get<ICreateUserDto[]>(`${URL_USER}/map-data/doctors`)
      .pipe(take(1));
  }

  doctorNotification(
    notification: IDoctorNotificatoin,
    id: string
  ): Observable<any> {
    return this.httpClient
      .patch<any>(`${URL_USER}/${id}`, { notification })
      .pipe(take(1));
  }

  update(id: string, data: UpdateUserDto): Observable<ProjectionUserDataTable> {
    return this.httpClient
      .patch<ProjectionUserDataTable>(`${URL_USER}/${id}`, data)
      .pipe(take(1));
  }
}
