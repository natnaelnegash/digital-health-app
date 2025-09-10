const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const path = require('path');

// Ensure dotenv is configured to load environment variables
// The path is corrected to look in the current directory for the .env file.
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const prisma = new PrismaClient();
const saltRounds = 10; // Number of salt rounds for bcrypt

async function updatePassword(email, newPassword) {
  if (!email || !newPassword) {
    console.error('Usage: node fix-password.js <email> <new_password>');
    return;
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email "${email}" not found.`);
      return;
    }

    // Hash the new password securely
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password in the database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    console.log(`Password for user "${updatedUser.email}" has been successfully updated.`);
    console.log('You can now log in with the new password.');

  } catch (error) {
    console.error('An error occurred while updating the password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email and new password from command line arguments
const userEmail = process.argv[2];
const newPass = process.argv[3];

if (!userEmail || !newPass) {
  console.log('Please provide an email and new password.');
  console.log('Example: node fix-password.js abebe@example.com abebe123');
} else {
  updatePassword(userEmail, newPass);
}