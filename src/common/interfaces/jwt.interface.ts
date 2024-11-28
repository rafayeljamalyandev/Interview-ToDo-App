export interface IJwtUser {
  id?: number;
  version: string;
  device: string;
  key: string;
  post: {};
  iat: number;
}
