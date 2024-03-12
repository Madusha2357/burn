import { Role } from '@damen/models';
import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { VALID_BEARER_TOKEN } from '../services/auth-spec.conts';

export const VALID_MOCK_CONTEXT_WITH_ADMIN_ROLE = createMock<ExecutionContext>({
  switchToHttp: () => ({
    getRequest: () => ({
      roles: [Role.ADMIN],
      rawHeaders: [VALID_BEARER_TOKEN],
    }),
  }),
});

export const VALID_MOCK_CONTEXT_WITHOUT_ROLE = createMock<ExecutionContext>({
  switchToHttp: () => ({
    getRequest: () => ({}),
  }),
});

export const VALID_ADMIN_ROLE_REQUIRED = [Role.ADMIN];
export const VALID_USER_ROLE_REQUIRED = [Role.USER];
export const INVALID_ROLE_REQUIRED = [Role.TEST];
export const VALID_NO_ROLES_REQUIRED = [];
