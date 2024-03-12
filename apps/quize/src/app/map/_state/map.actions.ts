import { IDoctorNotificatoin } from '@damen/models';

export class GetHospitals {
  public static readonly type = '[map] GetHospitals';
}

export class GetDoctors {
  public static readonly type = '[map] GetDoctors';
}

export class DoctorNotification {
  public static readonly type = '[map] DoctorNotification';
  constructor(public details: IDoctorNotificatoin, public id: string) {}
}
