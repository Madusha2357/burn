import { DecodeJwtToken, Role } from '@damen/models';
import { ExecutionContext } from '@nestjs/common';

/**
 * derive the JWT token from the HTTP request
 * @param context
 * @returns string
 */
export function getTokenFromRequest(context: ExecutionContext): string {
  const rawHeaders: string[] = context.switchToHttp().getRequest()?.rawHeaders;
  if (rawHeaders && rawHeaders.length > 0) {
    const token = rawHeaders.find((header) => header.startsWith('Bearer '));
    return token;
  }
  return null;
}

export function getDeviceNameFromRequest(context: ExecutionContext): string {
  const rawHeaders: string[] = context.switchToHttp().getRequest()?.rawHeaders;
  if (rawHeaders && rawHeaders.length > 0) {
    const device = rawHeaders.find((header) => header.startsWith('Device '));
    return device;
  }
  return null;
}

export function getBrowserNameFromRequest(context: ExecutionContext): string {
  const rawHeaders: string[] = context.switchToHttp().getRequest()?.rawHeaders;
  if (rawHeaders && rawHeaders.length > 0) {
    const browser = rawHeaders.find((header) => header.startsWith('Browser '));
    return browser;
  }
  return null;
}

/**
 * Authorize request based on the Role of the JWT token contains
 * @param jsonPayload = decoded JWT Token data
 * @param requiredRoles = Required Roles for an end point
 * @returns boolean
 */
export function authorizeRoles(
  jsonPayload: DecodeJwtToken,
  requiredRoles: Role[]
): boolean {
  if (jsonPayload && jsonPayload.roles) {
    return requiredRoles.some((role) => jsonPayload.roles?.includes(role));
  }
  return false;
}
