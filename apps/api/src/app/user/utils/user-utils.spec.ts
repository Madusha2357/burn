import { compareHashedPassword, generateHashPassword } from './user-utils';

describe('bcrypt password handling', () => {
  const passwordText = 'abc@123';
  const invalidPasswordText = 'invalidPassword';
  const hashPassword = generateHashPassword(passwordText);

  it('should return a hash password', () => {
    expect(hashPassword).not.toBeNull();
  });

  it('should return true for valid compared passwords', async () => {
    const result = await compareHashedPassword(passwordText, hashPassword);
    expect(result).toBeTruthy();
  });

  it('should return false for invalid compared passwords', async () => {
    const result = await compareHashedPassword(
      invalidPasswordText,
      hashPassword
    );
    expect(result).toBeFalsy();
  });

  it('should hash a password', async () => {
    const passwordText = 'abc@123';
    const hashPassword = generateHashPassword(passwordText);
    expect(passwordText).not.toEqual(hashPassword);
  });

  it('should compare a password with a hash password', async () => {
    const passwordText = 'abc@123';
    const hashPassword = generateHashPassword(passwordText);
    const samePassword = await compareHashedPassword(
      passwordText,
      hashPassword
    );
    expect(samePassword).toBe(true);
  });
});
