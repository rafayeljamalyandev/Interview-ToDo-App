import { IBaseRepository } from './base-repository.abstract';

import {   Todo,User, } from '../entities';
import {  ITodoGenericRepository } from './todo-repository.abstract';
import { IUserGenericRepository } from './user-repository.abstract';

export abstract class IDataServices {
  abstract user: IUserGenericRepository<User>;
  abstract todo: ITodoGenericRepository<Todo>;
}
