import { IBaseRepository } from './base-repository.abstract';

export abstract class ITodoGenericRepository<T> extends IBaseRepository<T> {

  abstract createTodo(item: T): Promise<T>;

  abstract listTodos(userId: number, skip?: number,take?: number );

  abstract  checkUserExist(userId: number ) :Promise<boolean>;
}
