import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRes, User } from './entities/user.entity';
import { isUUID } from 'src/utils/utils';

@Injectable()
export class UserService {
  users: User[] = [];
  getAll() {
    return this.users;
    //return `This action returns all user`;
  }

  getOne(id: string): IUserRes {
    const userRes: IUserRes = { code: 200 };
    if (!isUUID(id)) {
      return { code: 400 }
    }
    userRes.user = this.users.find(item => item.id === id);

    if (!userRes.user) {
      return { code: 404 }
    }
    return userRes;
  }

  create(createUserDto: CreateUserDto): IUserRes {
    const userRes: IUserRes = { code: 200 };
    const keys: string[] = Object.keys(createUserDto);

    if (!(keys.includes('login') && keys.includes('password'))) {
      return { code: 400 }
    }

    const user: User = {
      id: crypto.randomUUID(), // uuid v4
      login: createUserDto.login,
      password: createUserDto.password,
      version: 0, // integer number, increments on update
      createdAt: new Date().getTime(), // timestamp of creation
      updatedAt: new Date().getTime(), // timestamp of last update 
    }
    this.users.push(user);
    userRes.user = user;
    return userRes;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const userRes: IUserRes = { code: 200 };
    if (!isUUID(id)) {
      return { code: 400 }
    }
    userRes.user = this.users.find(item => item.id === id);
    if (!userRes.user) {
      return { code: 404 }
    }
    if (userRes.user.password !== updateUserDto.oldPassword) {
      return { code: 403 }
    }
    userRes.user.password = updateUserDto.newPassword;
    userRes.user.updatedAt = new Date().getTime();
    userRes.user.version++;
    return userRes;
  }

  delete(id: string) {
    const userRes: IUserRes = { code: 204 };
    if (!isUUID(id)) {
      return { code: 400 }
    }
    const index = this.users.findIndex(item => item.id === id);
    if (index === -1) {
      return { code: 404 }
    }
    this.users.splice(index, 1);
    return userRes;
  }
}
