import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRes, User } from './entities/user.entity';
import { isUUID } from 'src/utils/utils';
import { instanceToPlain } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
// import { db } from 'src/utils/db';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async getAll() {
    const usersDb = await this.prisma.user.findMany();
    const users = usersDb.map((item) => instanceToPlain(new User(item)));
    //const users = db.users.map((item) => instanceToPlain(item));
    return users;
  }

  async getOne(id: string): Promise<IUserRes> {
    const userRes: IUserRes = { code: 200 };
    if (!isUUID(id)) {
      return { code: 400 };
    }
    const userDb = await this.prisma.user.findUnique({ where: { id: id } });
    //const user = db.users.find((item) => item.id === id);
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
    //db.users.push(user);
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
    // const user = db.users.find((item) => item.id === id);
    //if (!user) {
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
    /*
    user.password = updateUserDto.newPassword;
    user.updatedAt = new Date().getTime();
    user.version++;
    */
    userRes.user = instanceToPlain(new User(userDb));
    return userRes;
  }

  async delete(id: string) {
    const userRes: IUserRes = { code: 204 };
    if (!isUUID(id)) {
      return { code: 400 };
    }
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    //const index = db.users.findIndex((item) => item.id === id);
    //if (index === -1) {
    if (user === null) {
      return { code: 404 };
    }
    await this.prisma.user.delete({ where: { id: id } });
    //db.users.splice(index, 1);
    return userRes;
  }
}
