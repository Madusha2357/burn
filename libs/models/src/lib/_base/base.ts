export interface BaseTime {
  createdAt?: Date;
  modifiedAt?: Date;
}

export interface BaseUser {
  createdBy?: string;
  modifiedBy?: string;
}

export interface BaseId {
  _id: string;
}
