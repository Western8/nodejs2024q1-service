import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { authDto } from './dto/auth.dto';
import { IAuthRes } from './entities/auth.entity';
import { Public } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getAll() {
    return await this.authService.getAll();
  }

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
    return authRes.message;
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
    return authRes.accessToken;
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() authDto: authDto) {
    const authRes = await this.authService.refresh(authDto);
    if (authRes.code === 401) {
      throw new BadRequestException('Incorrect refresh token fields OR no refresh token');
    } else if (authRes.code === 403) {
      throw new ForbiddenException(`Refresh token is invalid or expired`);
    }
    return authRes.tokens;
  }

}
