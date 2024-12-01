export interface JwtPayload {
  id: string;
  email: string;
}
export interface JwtResponse {
  id: string;
  email: string;
  iat: number;
  exp: number;
}