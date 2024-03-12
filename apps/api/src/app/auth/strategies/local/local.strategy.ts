import { DecodedPayload } from '@damen/models';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Validation method of Local strategy, to validate sign in
   * Sending bad
   * @param username = should be a valid email
   * @param password = should be a valid password
   * @throws BadRequestException for wrong credentials.
   * if we send 401 frontend will redirect to login page
   * @returns Promise<DecodedPayload>
   */
  async validate(username: string, password: string): Promise<DecodedPayload> {
    const user = await this.authService.validateUser(username, password);
    if (!user) throw new BadRequestException();
    return user;
  }
}
