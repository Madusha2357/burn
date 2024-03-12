export interface Credentials {
  username: string;
  password: string;
}

export interface ChangePasswordDto {
  password: string;
  confirmPassword: string;
}

export interface SendOtpDto {
  phoneNumber: string;
}

export interface VerifyOtpDto {
  phoneNumber: string;
  code: string;
}
