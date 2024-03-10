import { Exclude } from 'class-transformer';

export class Auth {
  login: string;

  constructor(params) {
    this.login = params.login;
    this.password = params.password;
  }

  @Exclude()
  password: string;
}

export interface IAuthRes {
  code: number;
  message?: string;
  auth?: Record<string, any>;
  tokens?: string;
  accessToken?: string;
}
