import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { authDto, refreshDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuardRefresh, Public } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(201)
  async signup(@Body() authDto: authDto) {
    const authRes = await this.authService.signup(authDto);
    if (authRes.code === 400) {
      throw new BadRequestException('Incorrect auth fields');
    } else if (authRes.code === 403) {
      throw new ForbiddenException(`Login already exists`);
    }
    return authRes.user;
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() authDto: authDto) {
    const authRes = await this.authService.login(authDto);
    if (authRes.code === 400) {
      throw new BadRequestException('Incorrect auth fields');
    } else if (authRes.code === 403) {
      throw new ForbiddenException(`Not correct login OR password!`);
    }
    return authRes;
  }

  @Public()
  @UseGuards(AuthGuardRefresh)
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() refreshDto: refreshDto) {
    const authRes = await this.authService.refresh(refreshDto);
    if (authRes.code === 401) {
      throw new UnauthorizedException(
        'Incorrect refresh token fields OR no refresh token',
      );
    } else if (authRes.code === 403) {
      throw new ForbiddenException(`Refresh token is invalid or expired`);
    }
    return authRes;
  }
}
