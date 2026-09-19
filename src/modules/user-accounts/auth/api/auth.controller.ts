import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { AuthService } from '../application/auth.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../decorators/param/current-user.decorator';
import { UserContextDto } from '../application/dto/user-context.dto';
import { AuthQueryRepository } from '../infrastructure/query/auth.query-repository';
import { MeViewDto } from './view-dto/me.view-dto';
import { JwtAuthGuard } from '../guards/jwt/jwt-auth.guard';
import { RegistrationInputDto } from './input-dto/registration.input-dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authQueryRepository: AuthQueryRepository,
  ) {}

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  registration(@Body() body: RegistrationInputDto): Promise<void> {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@CurrentUser() user: UserContextDto): Promise<string> {
    return this.authService.createAccessToken(user.id);
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: UserContextDto): Promise<MeViewDto> {
    return this.authQueryRepository.findMeByUserId(user.id);
  }
}
