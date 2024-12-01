import * as bcrypt from 'bcrypt';

export async function HashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}
