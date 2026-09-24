import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserContextDto } from '../../application/dto/user-context.dto';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayload } from '../../application/types/access-token-payload.type';
import { UsersRepository } from '../../../users/infrastructure/repositories/users.repository';
import { DomainException } from '../../../../../core/exceptions/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-code.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {
    const accessSecretKey = configService.getOrThrow<string>(
      'ACCESS_TOKEN_SECRET',
    );
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accessSecretKey,
    });
  }
  //функция принимает payload из jwt токена и возвращает то, что впоследствии будет записано в req.user
  async validate(payload: AccessTokenPayload): Promise<UserContextDto> {
    const user = await this.usersRepository.findById(payload.sub);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Unauthorized',
      });
    }

    return {
      id: user._id.toString(),
      login: user.login,
    };
  }
}
