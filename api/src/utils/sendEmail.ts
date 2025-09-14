// backend/utils/sendEmail.js
// sendEmail.ts
export const sendPasswordResetEmail = async (to: string, subject: string, text: string) => {
  console.log(`Pretend sending email to ${to}, subject: ${subject}`);
  return true;
};