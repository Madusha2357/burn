import { DecodedPayload, Role, UpdateUserDto, UserStatus } from '@damen/models';
import { NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { compareHashedPassword } from '../utils/user-utils';

/**
 * Method to check for null element or inactive user status,
 * and to throw errors accordingly
 * @param element
 */
export function checkToThrowError<T extends { status?: UserStatus }>(
  element: T
) {
  if (!element) {
    throw new UnauthorizedException('Record not found');
  } else if (element?.status == UserStatus.INACTIVE) {
    throw new UnauthorizedException('User is in Inactive status');
  }
}

/**
 * method to stop updating the password field by removing it
 * @param updateUserDto
 */
export function removePasswordField(updateUserDto: UpdateUserDto) {
  if (updateUserDto?.password) {
    delete updateUserDto.password;
  }
}

/**
 * this method is used to assess requesting user's role
 * @param requestUser
 * @param id
 * @param updateUserDto
 * @returns
 */
export function requestUserRoleValidity(
  requestUser: DecodedPayload,
  id: string,
  updateUserDto: UpdateUserDto
) {
  if (!requestUser.roles.includes(Role.ADMIN)) {
    id = requestUser.id;
    if (updateUserDto.roles) {
      delete updateUserDto.roles;
    }
  }
  return id;
}

/**
 * check for the same password, and throw exception if found matching password
 * @param passwordText
 * @param hashedPassword
 */
export async function checkForSamePassword(
  passwordText: string,
  hashedPassword: string
) {
  const isPasswordMatch = await compareHashedPassword(
    passwordText,
    hashedPassword
  );
  if (isPasswordMatch) {
    throw new NotAcceptableException(
      'Old password & the new password cannot be the same'
    );
  }
}
