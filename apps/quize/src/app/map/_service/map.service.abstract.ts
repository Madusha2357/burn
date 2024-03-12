import { ICreateUserDto, IDoctorNotificatoin } from '@damen/models';
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
}
