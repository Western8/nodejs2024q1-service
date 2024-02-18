import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRes, User } from './entities/user.entity';
import { isUUID } from 'src/utils/utils';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  users: User[] = [];
  getAll() {
    const users = this.users.map(item => instanceToPlain(item));
    return users;
  }

  getOne(id: string): IUserRes {
    const userRes: IUserRes = { code: 200 };
    if (!isUUID(id)) {
      return { code: 400 }
    }
    const user = this.users.find(item => item.id === id);
    if (!user) {
      return { code: 404 }
    }
    userRes.user = instanceToPlain(user);
    return userRes;
  }

  create(createUserDto: CreateUserDto): IUserRes {
    const userRes: IUserRes = { code: 200 };
    const keys: string[] = Object.keys(createUserDto);

    if (!(keys.includes('login') && keys.includes('password'))) {
      return { code: 400 }
    }
    if (!(createUserDto.login && createUserDto.password)) {
      return { code: 400 }
    }

    const params = {
      id: crypto.randomUUID(), // uuid v4
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1, // integer number, increments on update
      createdAt: new Date().getTime(), // timestamp of creation
      updatedAt: new Date().getTime(), // timestamp of last update 
    }
    const user: User = new User(params);
    /*
    user.id = crypto.randomUUID(); // uuid v4
    user.login = createUserDto.login;
    user.password = createUserDto.password;
    user.version = 0; // integer number, increments on update
    user.createdAt = new Date().getTime(); // timestamp of creation
    user.updatedAt = new Date().getTime(); // timestamp of last update 
    */
    this.users.push(user);
    userRes.user = instanceToPlain(user);
    console.log('user ', user);
    console.log('userRes.user ', userRes.user);
    console.log('typeof user ', typeof user);
    console.log('typeof userRes.user ', typeof userRes.user);

    //userRes.user = user;
    return userRes;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const userRes: IUserRes = { code: 200 };
    if (!isUUID(id)) {
      return { code: 400 }
    }
    if (!(updateUserDto.oldPassword && updateUserDto.oldPassword)) {
      return { code: 400 }
    }
    const user = this.users.find(item => item.id === id);
    if (!user) {
      return { code: 404 }
    }
    if ((user.password !== updateUserDto.oldPassword) || (updateUserDto.newPassword === updateUserDto.oldPassword)) {
      return { code: 403 }
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
