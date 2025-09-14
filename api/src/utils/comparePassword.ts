import bcrypt from 'bcrypt';

export async function comparePassword(plainPassword: string, hashedPassword: string) {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
}

module.exports = comparePassword;
