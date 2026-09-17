import { Module } from '@nestjs/common';
import { UsersController } from './users/api/users.controller';
import { UsersQueryRepository } from './users/infrastructure/query/users.query-repository';
import { UsersRepository } from './users/infrastructure/users.repository';
import { UsersService } from './users/application/users.service';
import { PasswordHashAdapter } from './adapters/password-hash.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/domain/user.entity';
import { BasicAuthGuard } from './auth/guards/basic/basic-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersQueryRepository,
    UsersRepository,
    UsersService,
    PasswordHashAdapter,
    BasicAuthGuard,
  ],
  exports: [BasicAuthGuard],
})
export class UserAccountsModule {}
