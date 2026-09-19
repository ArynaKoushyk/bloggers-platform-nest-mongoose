import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { TestingModule } from './modules/testing/testing.module';

// export const configModule = ConfigModule.forRoot({
//   envFilePath: [
//     process.env.ENV_FILE_PATH?.trim() || '',
//     `.env.${process.env.NODE_ENV}.local`,
//     `.env.${process.env.NODE_ENV}`,
//     '.env.production',
//   ],
//   isGlobal: true,
// });

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URL'),
        dbName: configService.getOrThrow<string>('DB_NAME'),
      }),
    }),
    CoreModule,
    BloggersPlatformModule,
    UserAccountsModule,
    TestingModule,
  ],
})
export class AppModule {}
