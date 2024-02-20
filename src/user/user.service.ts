import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRes, User } from './entities/user.entity';
import { isUUID } from 'src/utils/utils';
import { instanceToPlain } from 'class-transformer';
import { db } from 'src/utils/db';

@Injectable()
export class UserService {
  //users: User[] = [];
  getAll() {
    //const users = this.users.map(item => instanceToPlain(item));
    const users = db.users.map((item) => instanceToPlain(item));
    return users;
  }

  getOne(id: string): IUserRes {
    const userRes: IUserRes = { code: 200 };
    if (!isUUID(id)) {
      return { code: 400 };
    }
    //const user = this.users.find(item => item.id === id);
    const user = db.users.find((item) => item.id === id);
    if (!user) {
      return { code: 404 };
    }
    userRes.user = instanceToPlain(user);
    return userRes;
  }

  create(createUserDto: CreateUserDto): IUserRes {
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
    const user: User = new User(params);
    //this.users.push(user);
    db.users.push(user);
    userRes.user = instanceToPlain(user);
    return userRes;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
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
    //const user = this.users.find(item => item.id === id);
    const user = db.users.find((item) => item.id === id);
    if (!user) {
      return { code: 404 };
    }
    if (
      user.password !== updateUserDto.oldPassword ||
      updateUserDto.newPassword === updateUserDto.oldPassword
    ) {
      return { code: 403 };
    }
    user.password = updateUserDto.newPassword;
    user.updatedAt = new Date().getTime();
    user.version++;
    userRes.user = instanceToPlain(user);
    return userRes;
  }

  delete(id: string) {
    const userRes: IUserRes = { code: 204 };
    if (!isUUID(id)) {
      return { code: 400 };
    }
    //const index = this.users.findIndex(item => item.id === id);
    const index = db.users.findIndex((item) => item.id === id);
    if (index === -1) {
      return { code: 404 };
    }
    db.users.splice(index, 1);
    return userRes;
  }
}
