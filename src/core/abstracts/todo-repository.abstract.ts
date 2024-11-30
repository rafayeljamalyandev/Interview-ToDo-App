import { IBaseRepository } from './base-repository.abstract';

export abstract class ITodoGenericRepository<T> extends IBaseRepository<T> {
  abstract getUserTodos(userId: string );
}
