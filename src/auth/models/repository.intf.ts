import { User } from './model';

export interface IUserRepository {
  createUser(userInfo: Partial<User>): Promise<User>;
  getUserById(userId: string): Promise<User>;
  getUserByEmail(email: string): Promise<User>;
}
