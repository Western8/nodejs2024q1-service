import { Exclude } from "class-transformer";

export class User {
  id: string; // uuid v4
  login: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update

  constructor(params) {
    this.id = params.id;
    this.login = params.login;
    this.version = params.version;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.password = params.password;
  }
  
  @Exclude()
  password: string;
}
/*
export class UserRes {
  id: string; // uuid v4
  login: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}
*/
export interface IUserRes {
  code: number,
  message?: string,
  user?: Record<string, any>,
}
