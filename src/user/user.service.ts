import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRes, User } from './entities/user.entity';
import { isUUID } from 'src/utils/utils';
import { instanceToPlain } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomLogger } from 'src/logger/logger.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  //private readonly logger = new CustomLogger(UserService.name);
  private readonly logger = new CustomLogger();

  async getAll() {
    const usersDb = await this.prisma.user.findMany();
    const users = usersDb.map((item) => instanceToPlain(new User(item)));
    return users;
  }

  async getOne(id: string): Promise<IUserRes> {
    const userRes: IUserRes = { code: 200 };
    if (!isUUID(id)) {
      return { code: 400 };
    }
    const userDb = await this.prisma.user.findUnique({ where: { id: id } });
    if (userDb === null) {
      return { code: 404 };
    }
    userRes.user = instanceToPlain(new User(userDb));
    return userRes;
  }

  async create(createUserDto: CreateUserDto): Promise<IUserRes> {
    const userRes: IUserRes = { code: 200 };
    const keys: string[] = Object.keys(createUserDto);

    if (!(keys.includes('login') && keys.includes('password'))) {
      return { code: 400 };
    }
    if (!(createUserDto.login && createUserDto.password)) {
      return { code: 400 };
    }

    const params = {
      id: crypto.randomUUID(), // uuid v4
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1, // integer number, increments on update
      createdAt: new Date().getTime(), // timestamp of creation
      updatedAt: new Date().getTime(), // timestamp of last update
    };
    const userDb = await this.prisma.user.create({ data: params });
    userRes.user = instanceToPlain(new User(userDb));
    return userRes;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userRes: IUserRes = { code: 200 };
    if (!isUUID(id)) {
      return {
        code: 400,
        message: 'Not valid id',
      };
    }
    if (!(updateUserDto.oldPassword && updateUserDto.oldPassword)) {
      return {
        code: 400,
        message: 'Not valid fields',
      };
    }
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (user === null) {
      return { code: 404 };
    }
    if (
      user.password !== updateUserDto.oldPassword ||
      updateUserDto.newPassword === updateUserDto.oldPassword
    ) {
      return { code: 403 };
    }
    const userDb = await this.prisma.user.update({
      where: { id: id },
      data: {
        password: updateUserDto.newPassword,
        updatedAt: new Date().getTime(),
        version: user.version + 1,
      },
    });
    userRes.user = instanceToPlain(new User(userDb));
    return userRes;
  }

  async delete(id: string) {
    const userRes: IUserRes = { code: 204 };
    if (!isUUID(id)) {
      return { code: 400 };
    }
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (user === null) {
      return { code: 404 };
    }
    await this.prisma.user.delete({ where: { id: id } });
    return userRes;
  }
}
