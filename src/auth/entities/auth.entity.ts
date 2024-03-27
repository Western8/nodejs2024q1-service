export interface IAuthRes {
  code: number;
  message?: string;
  user?: Record<string, any>;
  //auth?: Record<string, any>;
  accessToken?: string;
  refreshToken?: string;
}
