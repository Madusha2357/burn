import { Role } from '@damen/models';
import { ExecutionContext } from '@nestjs/common';
import * as authUtil from '../services/auth-spec.conts';
import { authorizeRoles, getTokenFromRequest } from './auth.util';

describe('authorizeRoles', () => {
  it('should return false for invalid jsonPayload', () => {
    const isAllowed = authorizeRoles(null, [Role.ADMIN]);
    expect(isAllowed).toBe(false);
  });

  it('should return false for invalid requiredRoles', () => {
    const isAllowed = authorizeRoles(authUtil.JSON_PAYLOAD, []);
    expect(isAllowed).toBe(false);
  });

  it('should return false for valid jsonPayload without roles & valid requiredRoles', () => {
    const isAllowed = authorizeRoles(authUtil.JSON_PAYLOAD_WITHOUT_ROLES, [
      Role.ADMIN,
    ]);
    expect(isAllowed).toBe(false);
  });

  it('should return true for valid jsonPayload & valid requiredRoles', () => {
    const isAllowed = authorizeRoles(authUtil.JSON_PAYLOAD, [Role.ADMIN]);
    expect(isAllowed).toBe(true);
  });
});

describe('getTokenFromRequest', () => {
  it('should return null for invalid requiredRoles', () => {
    const context: ExecutionContext =
      authUtil.INVALID_MOCK_CONTEXT as ExecutionContext;
    const isAllowed = getTokenFromRequest(context);
    expect(isAllowed).toBe(null);
  });

  it('should return null for valid requiredRoles but no bearer header', () => {
    const context: ExecutionContext =
      authUtil.INVALID_MOCK_CONTEXT2 as ExecutionContext;
    const isAllowed = getTokenFromRequest(context);
    expect(isAllowed).toBe(undefined);
  });

  it('should return a token string for valid requiredRoles', () => {
    const context: ExecutionContext =
      authUtil.VALID_MOCK_CONTEXT as ExecutionContext;
    const isAllowed = getTokenFromRequest(context);
    expect(isAllowed).toBe(authUtil.VALID_BEARER_TOKEN);
  });
});
