import * as bcrypt from 'bcrypt';

export async function HashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function ComparePassword(
  reqPassword: string,
  serverPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(reqPassword, serverPassword);
}
