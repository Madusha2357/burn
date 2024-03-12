import { compare, hashSync } from 'bcrypt';

export const SALT_ROUNDS = 10;

/**
 * Generate Hash Password using bcrypt
 * @param inputPassword
 * @returns
 */
export function generateHashPassword(inputPassword: string): string {
  return hashSync(inputPassword, SALT_ROUNDS);
}

/**
 * Compare & check the Hashed Password and normal password text as equal
 * @param inputPassword
 * @param hashedPassword
 * @returns
 */
export async function compareHashedPassword(
  inputPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await compare(inputPassword, hashedPassword);
}
