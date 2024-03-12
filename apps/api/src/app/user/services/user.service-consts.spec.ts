import { UserStatus } from '@damen/models';
import { NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { generateHashPassword } from '../utils/user-utils';
import {
  checkForSamePassword,
  checkToThrowError,
  removePasswordField,
  requestUserRoleValidity,
} from './user.service-consts.consts';
import {
  AUTH_ADMIN_REQUEST,
  AUTH_USER_REQUEST,
  OBJECT_ID,
  UPDATE_USER_DTO,
} from './user.service-spec.consts';

describe('check reusable functions()', () => {
  describe('checkToThrowError', () => {
    it('should return an Error for null object', () => {
      const element = null;
      expect(() => checkToThrowError(element)).toThrow(UnauthorizedException);
    });

    it('should return an Error for an object with inactive status', () => {
      const element = {
        name: 'FirstName',
        email: 'test@user.com',
        status: UserStatus.INACTIVE,
      };
      expect(() => checkToThrowError(element)).toThrow(UnauthorizedException);
    });

    it('should return nothing for valid object', () => {
      const element = {
        name: 'FirstName',
        email: 'test@user.com',
        status: UserStatus.ACTIVE,
      };
      const output = checkToThrowError(element);
      expect(output).toBe(undefined);
    });
  });

  describe('removePasswordField', () => {
    it('should return an object without password field valid object', () => {
      const updateUserDto = UPDATE_USER_DTO;
      removePasswordField(updateUserDto);
      expect(updateUserDto.password).toBe(undefined);
    });

    it('should return an Error for null object', () => {
      const updateUserDto = null;
      removePasswordField(updateUserDto);
      expect(updateUserDto).toBe(null);
    });
  });

  describe('requestUserRoleValidity', () => {
    const id = OBJECT_ID;
    const updateUser = UPDATE_USER_DTO;
    const decodedPayloadUser = AUTH_USER_REQUEST.user;
    const decodedPayloadAdmin = AUTH_ADMIN_REQUEST.user;

    it('should return the input id; if the requesting user is ADMIN', async () => {
      const idOutput = requestUserRoleValidity(
        decodedPayloadAdmin,
        id,
        updateUser
      );
      expect(idOutput).toBe(id);
    });

    it("should return the requested user's id; if the requesting user is USER", async () => {
      const idOutput = requestUserRoleValidity(
        decodedPayloadUser,
        id,
        updateUser
      );
      expect(idOutput).toBe(decodedPayloadUser.id);
    });

    it('should remove any roles from the object; if the requesting user is USER', async () => {
      requestUserRoleValidity(decodedPayloadUser, id, updateUser);
      expect(updateUser.roles).toBe(undefined);
    });

    it("should process occordingly, even the object doesn't contain roles; if the requesting user is USER", async () => {
      requestUserRoleValidity(decodedPayloadUser, id, updateUser);
      expect(updateUser.roles).toBe(undefined);
    });
  });

  describe('checkForSamePassword', () => {
    it('should throw an error for the same password', async () => {
      const password = 'abc@123';
      const hashedPassword = generateHashPassword(password);
      expect(
        async () => await checkForSamePassword(password, hashedPassword)
      ).rejects.toThrow(NotAcceptableException);
    });

    it('should do nothing for the different passwords', async () => {
      const password = 'abc@123';
      const otherPassword = 'abc@123Other';
      const hashedPassword = generateHashPassword(password);
      const output = await checkForSamePassword(otherPassword, hashedPassword);
      expect(output).toBe(undefined);
    });
  });
});
