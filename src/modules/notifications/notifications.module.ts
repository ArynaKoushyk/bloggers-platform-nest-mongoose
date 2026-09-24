import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailAdapter } from './infrastructure/adapters/email.adapter';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'node:path';
import { SendConfirmationEmailHandler } from './application/event-handlers/send-confirmation-email.handler';
import { SendRecoveryEmailHandler } from './application/event-handlers/send-recovery-email.handler';

const eventHandlers = [SendConfirmationEmailHandler, SendRecoveryEmailHandler];

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          port: 465,
          secure: true,
          service: 'gmail',
          auth: {
            user: configService.getOrThrow<string>('GMAIL_USER'),
            pass: configService.getOrThrow<string>('GMAIL_APP_PASSWORD'),
          },
        },
        defaults: {
          from: `"Bloggers Platform" <${configService.getOrThrow<string>(
            'GMAIL_USER',
          )}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [EmailAdapter, ...eventHandlers],
})
export class NotificationsModule {}
