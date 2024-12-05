import * as jwt from 'jsonwebtoken';

export const generateJwtKey = (payload: any, secret: string, expiresIn: string = '1h') => {
    return jwt.sign(payload, secret, { expiresIn });
};

export const verifyJwtKey = (token: string, secret: string) => {
    return jwt.verify(token, secret);
}