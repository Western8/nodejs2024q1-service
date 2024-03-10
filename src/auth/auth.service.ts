import { Injectable, Logger } from '@nestjs/common';
import { authDto, refreshDto } from './dto/auth.dto';
import { IAuthRes } from './entities/auth.entity';
import { instanceToPlain } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { getHash } from 'src/utils/utils';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signup(authDto: authDto): Promise<IAuthRes> {
    const authRes: IAuthRes = {
      code: 201,
      message: `User with login ${authDto.login} has created`,
    };
    const keys: string[] = Object.keys(authDto);

    if (!(keys.includes('login') && keys.includes('password'))) {
      return { code: 400 };
    }
    if (
      !(
        authDto.login &&
        authDto.password &&
        typeof authDto.login === 'string' &&
        typeof authDto.password === 'string'
      )
    ) {
      return { code: 400 };
    }

    const params = {
      id: crypto.randomUUID(), // uuid v4
      login: authDto.login,
      password: getHash(authDto.password),
      version: 1, // integer number, increments on update
      createdAt: new Date().getTime(), // timestamp of creation
      updatedAt: new Date().getTime(), // timestamp of last update
    };
    const userDb = await this.prisma.user.create({ data: params });
    authRes.user = instanceToPlain(new User(userDb));
    return authRes;
  }

  async login(authDto: authDto): Promise<IAuthRes> {
    const authRes: IAuthRes = { code: 200 };
    const keys: string[] = Object.keys(authDto);

    if (!(keys.includes('login') && keys.includes('password'))) {
      return { code: 400 };
    }
    if (
      !(
        authDto.login &&
        authDto.password &&
        typeof authDto.login === 'string' &&
        typeof authDto.password === 'string'
      )
    ) {
      return { code: 400 };
    }

    const user = await this.prisma.user.findFirst({
      where: { login: authDto.login },
    });
    if (user === null) {
      return { code: 403 };
    }
    const passwordHash = getHash(authDto.password);
    if (user.password !== passwordHash) {
      return { code: 403 };
    }

    const payload = {
      userId: user.id,
      login: user.login,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY || 'secret',
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '30d',
    });
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    authRes.accessToken = accessToken;
    authRes.refreshToken = refreshToken;
    return authRes;
  }

  async refresh(refreshDto: refreshDto) {
    const authRes: IAuthRes = { code: 200 };
    const keys: string[] = Object.keys(refreshDto);

    if (!keys.includes('refreshToken')) {
      return { code: 401 };
    }

    let payloadRefresh = null;
    try {
      payloadRefresh = await this.jwtService.verifyAsync(
        refreshDto.refreshToken,
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY || 'secret',
        },
      );
    } catch {
      return { code: 403 };
    }
    const user = await this.prisma.user.findUnique({
      where: { id: payloadRefresh.userId },
    });
    if (user === null) {
      return { code: 403 };
    }
    if (user.refreshToken !== refreshDto.refreshToken) {
      return { code: 403 };
    }

    const payload = {
      userId: user.id,
      login: user.login,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY || 'secret',
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '30d',
    });
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    authRes.accessToken = accessToken;
    authRes.refreshToken = refreshToken;
    return authRes;
  }
}
