import { SetMetadata } from '@nestjs/common';

/**
 * This constants are related to make endpoints public so that will skip of JWT Token validation
 * to skip an endpoint add @Public() to the method or controller
 */
export const PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(PUBLIC_KEY, true);
