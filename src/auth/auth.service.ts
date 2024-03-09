import { Injectable, Logger } from '@nestjs/common';
import { authDto } from './dto/auth.dto';
import { IAuthRes, Auth } from './entities/auth.entity';
import { instanceToPlain } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomLogger } from 'src/logger/logger.service';
import { createHash } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  //private readonly logger = new CustomLogger(UserService.name);

  async getAll() {
    const authDb = await this.prisma.auth.findMany();
    const auth = authDb.map((item) => instanceToPlain(new Auth(item)));
    return auth;
  }

  async signup(authDto: authDto): Promise<IAuthRes> {
    const authRes: IAuthRes = { code: 200 };
    const keys: string[] = Object.keys(authDto);

    if (!(keys.includes('login') && keys.includes('password'))) {
      return { code: 400 };
    }
    if (!(authDto.login && authDto.password && (typeof authDto.login === 'string') && (typeof authDto.password === 'string') )) {
      return { code: 400 };
    }

    const auth = await this.prisma.auth.findUnique({ where: { login: authDto.login } });
    if (auth !== null) {
      return { code: 403 };
    }

    const passwordHash = this.getHashe(authDto.password);
    const params = {
      login: authDto.login,
      password: passwordHash,
    };
    const authDb = await this.prisma.auth.create({ data: params });
    authRes.auth = instanceToPlain(new Auth(authDb));
    return authRes;
  }

  async login(authDto: authDto): Promise<IAuthRes> {
    const authRes: IAuthRes = { code: 200 };
    const keys: string[] = Object.keys(authDto);

    if (!(keys.includes('login') && keys.includes('password'))) {
      return { code: 400 };
    }
    if (!(authDto.login && authDto.password && (typeof authDto.login === 'string') && (typeof authDto.password === 'string') )) {
      return { code: 400 };
    }

    const auth = await this.prisma.auth.findUnique({ where: { login: authDto.login } });
    if (auth === null) {
      return { code: 403 };
    }
    const passwordHash = this.getHashe(authDto.password);
    if (auth.password !== passwordHash) {
      return { code: 403 };
    }
    
    /*
    const params = {
      login: authDto.login,
      password: authDto.password,
    };
    const authDb = await this.prisma.auth.create({ data: params });
    authRes.auth = instanceToPlain(new Auth(authDb));
    */
    return authRes;
  }

  async refresh(authDto: authDto) {
    const authRes: IAuthRes = { code: 200 };
    const keys: string[] = Object.keys(authDto);

    if (!keys.includes('refreshToken')) {
      return { code: 401 };
    }
/*
    const auth = await this.prisma.auth.findUnique({ where: { login: authDto.login } });
    if (auth === null) {
      return { code: 403 };
    }
    if (auth.password !== authDto.password) {
      return { code: 403 };
    }
*/
    return authRes;
  }

  getHashe(data: string): string {
    const hash = createHash('sha256');
    hash.update(data);
    const dataHash = hash.digest('hex');
    return dataHash;
  }

}
