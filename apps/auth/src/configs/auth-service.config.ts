import { registerAs } from '@nestjs/config';

export default registerAs('auth_service', () => ({
  name: process.env.AUTH_SERVICE_NAME || 'Todo Service',
  port: parseInt(process.env.AUTH_SERVICE_PORT, 10) || 3001,
  mode: process.env.AUTH_NODE_ENV || 'development',
}));
