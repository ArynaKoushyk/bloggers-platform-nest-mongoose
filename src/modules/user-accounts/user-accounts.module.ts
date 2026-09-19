import { Module } from '@nestjs/common';
import { UsersController } from './users/api/users.controller';
import { UsersQueryRepository } from './users/infrastructure/query/users.query-repository';
import { UsersRepository } from './users/infrastructure/users.repository';
import { UsersService } from './users/application/users.service';
import { PasswordHashAdapter } from './common/adapters/password-hash.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/domain/user.entity';
import { BasicAuthGuard } from './auth/guards/basic/basic-auth.guard';
import { LocalStrategy } from './auth/strategies/local/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/strategies/jwt/jwt.strategy';
import { LocalAuthGuard } from './auth/guards/local/local-auth.guard';
import { JwtAuthGuard } from './auth/guards/jwt/jwt-auth.guard';
import { AuthService } from './auth/application/auth.service';
import { AuthQueryRepository } from './auth/infrastructure/query/auth.query-repository';
import { JwtAdapter } from './common/adapters/jwt.adapter';
import { AuthController } from './auth/api/auth.controller';
import { NotificationsModule } from './common/notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    PassportModule,
    JwtModule.register({}),
    NotificationsModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersQueryRepository,
    UsersRepository,
    UsersService,
    PasswordHashAdapter,
    LocalStrategy,
    JwtStrategy,
    AuthService,
    AuthQueryRepository,
    JwtAdapter,
  ],
  exports: [JwtStrategy],
})
export class UserAccountsModule {}
