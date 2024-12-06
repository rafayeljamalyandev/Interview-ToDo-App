import { registerAs } from '@nestjs/config';

export default registerAs('todo_service', () => ({
  name: process.env.TODO_SERVICE_NAME || 'Todo Service',
  port: parseInt(process.env.TODO_SERVICE_PORT, 10) || 3000,
  mode: process.env.TODO_NODE_ENV || 'development',
}));
