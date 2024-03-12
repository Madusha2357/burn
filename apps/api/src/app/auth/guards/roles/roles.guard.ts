import { Role } from '@damen/models';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../roles/role.decorator';
import { AuthService } from '../../services/auth.service';
import {
  getTokenFromRequest,
  authorizeRoles,
  getDeviceNameFromRequest,
  getBrowserNameFromRequest,
} from '../../utils/auth.util';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  /**
   * Role Guard to check every endpoint's required role validate
   * @param context
   * @returns Promise<boolean>
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length < 1) {
      return true;
    }

    const token = getTokenFromRequest(context);
    const device = getDeviceNameFromRequest(context);
    const browser = getBrowserNameFromRequest(context);
    const value = this.authService.decodeJwt(token);
    const dName = this.authService.deviceName(device, browser);
    return authorizeRoles(value, requiredRoles);
  }
}
