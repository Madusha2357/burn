import { DecodedPayload } from '@damen/models';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { environment } from '../../../environments/environment';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.JWT_TOKEN_SECRET_KEY,
    });
  }

  /**
   * Validation method of JWT strategy, contains extracted JWT token data
   * @param payload
   * @returns
   */
  async validate(payload: DecodedPayload) {
    return payload;
  }
}
