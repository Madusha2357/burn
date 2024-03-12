import { Reflector } from '@nestjs/core';
import * as guardUtil from '../guard-spec.consts';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true for valid context with a isPublic scenario', () => {
    reflector.getAllAndOverride = jest.fn().mockReturnValue(true);
    const context = guardUtil.VALID_MOCK_CONTEXT_WITHOUT_ROLE;

    const canActivate = guard.canActivate(context);
    expect(canActivate).toBe(true);
  });
});
