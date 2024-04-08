import {
  ICreateUserDto,
  IDoctorNotificatoin,
  ProjectionUserDataTable,
  UpdateUserDto,
} from '@damen/models';
import { Observable } from 'rxjs';

export abstract class MapService {
  /**
   * Return the Question data table
   * @param order getting order number from component
   */
  abstract getHospitals(): Observable<ICreateUserDto[]>;

  /**
   * Return the Question data table
   * @param order getting order number from component
   */
  abstract getDoctors(): Observable<ICreateUserDto[]>;

  abstract doctorNotification(
    details: IDoctorNotificatoin,
    id: string
  ): Observable<any>;

  abstract doctorAllNotification(details: IDoctorNotificatoin): Observable<any>;

  abstract update(
    id: string,
    data: UpdateUserDto
  ): Observable<ProjectionUserDataTable>;

  abstract getUser(id: string): Observable<ICreateUserDto>;
}
