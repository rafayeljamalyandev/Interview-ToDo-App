import { IBaseRepository } from './base-repository.abstract';

export abstract class ITodoGenericRepository<T> extends IBaseRepository<T> {

  abstract create(item: T): Promise<T>;

  abstract getUserTodos(userId: number );
}
