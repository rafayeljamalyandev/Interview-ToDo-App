import { IBaseRepository } from './base-repository.abstract';

export abstract class IUserGenericRepository<T> extends IBaseRepository<T> {
  abstract removeUser(id: string );
}
