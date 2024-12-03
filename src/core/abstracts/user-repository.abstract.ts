import { IBaseRepository } from './base-repository.abstract';

export abstract class IUserGenericRepository<T> extends IBaseRepository<T> {

  abstract register(item: T): Promise<T>;

  abstract login(email: string,password:string): Promise<T>;

}
