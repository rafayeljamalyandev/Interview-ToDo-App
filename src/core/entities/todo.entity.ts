import { User } from './user.entity';

export class Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;

}