import { Module } from '@nestjs/common';
import { UsersController } from './users/api/users.controller';
import { UsersQueryRepository } from './users/infrastructure/query/users.query-repository';
import { UsersRepository } from './users/infrastructure/users.repository';
import { PasswordHashAdapter } from './users/infrastructure/adapters/password-hash.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/domain/user.entity';
import { LocalStrategy } from './auth/infrastructure/strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/infrastructure/strategies/jwt.strategy';
import { AuthQueryRepository } from './auth/infrastructure/query/auth.query-repository';
import { JwtAdapter } from './auth/infrastructure/adapters/jwt.adapter';
import { AuthController } from './auth/api/auth.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { CreateUserUseCase } from './users/application/usecases/create-user.usecase';
import { DeleteUserUseCase } from './users/application/usecases/delete-user.usecase';
import { GetUserByIdQuery } from './users/application/queries/get-user-by-id.query-handler';
import { GetUsersQuery } from './users/application/queries/get-users.query-handler';
import { UsersFactory } from './users/application/factories/users.factory';
import { GetCurrentUserQuery } from './auth/application/queries/get-current-user.query-handler';
import { AuthService } from './auth/application/auth.service';

const useCases = [CreateUserUseCase, DeleteUserUseCase];

const queryHandlers = [GetUserByIdQuery, GetUsersQuery, GetCurrentUserQuery];

const repositories = [
  UsersQueryRepository,
  UsersRepository,
  AuthQueryRepository,
];

const factories = [UsersFactory];

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
    ...useCases,
    ...queryHandlers,
    ...repositories,
    ...factories,
    AuthService,
    PasswordHashAdapter,
    LocalStrategy,
    JwtStrategy,
    JwtAdapter,
  ],
  exports: [JwtStrategy],
})
export class UserAccountsModule {}
