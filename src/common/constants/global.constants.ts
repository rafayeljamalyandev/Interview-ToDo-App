export const PASSWORD_REG_EXP = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
export const EMAIL_REG_EXP = /^[a-zA-Z0-9._%+-]+@\w+\.[a-zA-Z]{2,}$/;
export const EMAIL_OR_EMPTY_REG_EXP =
  /^$|^[a-zA-Z0-9._%+-]+@\w+\.[a-zA-Z]{2,}$/;

export const BCRYPT_HASH_ROUNDS = 10;

export const USER_FIELDS_TO_UPDATE: string[] = [
  'firstName',
  'lastName',
];