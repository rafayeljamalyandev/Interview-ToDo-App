import * as jwt from 'jsonwebtoken';

const TOKEN_EXPIRATION = {
  seconds: 86400, // 24 hours in seconds
  string: '24h', // Human-readable format for JWT `expiresIn`
};

export const generateToken = (payload: Record<string, any>, secret: string) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: TOKEN_EXPIRATION.string,
  });
  const expiresAt = Date.now() + TOKEN_EXPIRATION.seconds * 1000;

  return { token, expiresAt, expiresIn: TOKEN_EXPIRATION.seconds };
};
