import { Todo } from './todo.entity';

export class User {
  id: number;
  email: string;
  password: string;
  // todos? :  Todo[]
  createdAt?: Date;
  updatedAt?: Date;

}
