import { Reflector } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { environment } from '../../../../environments/environment';
import { User } from '../../../user/schema/user.schema';
import { UserService } from '../../../user/services/user.service';
import { USER_MODEL } from '../../services/auth-spec.conts';
import { AuthService } from '../../services/auth.service';
import * as guardUtil from '../guard-spec.consts';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: environment.JWT_TOKEN_SECRET_KEY,
          signOptions: { expiresIn: environment.TOKEN_EXPIRES_IN },
        }),
      ],
      providers: [
        AuthService,
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            new: jest.fn().mockResolvedValue(USER_MODEL),
            constructor: jest.fn().mockResolvedValue(USER_MODEL),
            findOne: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
    reflector = new Reflector();
    guard = new RolesGuard(reflector, authService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true for valid context with no roles', async () => {
    reflector.getAllAndOverride = jest
      .fn()
      .mockReturnValue(guardUtil.VALID_NO_ROLES_REQUIRED);
    const context = guardUtil.VALID_MOCK_CONTEXT_WITHOUT_ROLE;

    const canActivate = await guard.canActivate(context);
    expect(canActivate).toBe(true);
  });

  it('should return false for valid context with insufficient role', async () => {
    reflector.getAllAndOverride = jest
      .fn()
      .mockReturnValue(guardUtil.INVALID_ROLE_REQUIRED);
    const context = guardUtil.VALID_MOCK_CONTEXT_WITH_ADMIN_ROLE;

    const canActivate = await guard.canActivate(context);
    expect(canActivate).toBe(false);
  });

  it('should return true for valid context with sufficient roles', async () => {
    reflector.getAllAndOverride = jest
      .fn()
      .mockReturnValue(guardUtil.VALID_ADMIN_ROLE_REQUIRED);
    const context = guardUtil.VALID_MOCK_CONTEXT_WITH_ADMIN_ROLE;

    const canActivate = await guard.canActivate(context);
    expect(canActivate).toBe(true);
  });
});
