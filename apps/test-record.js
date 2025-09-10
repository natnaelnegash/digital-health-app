// C:\Users\Nat-EL\Desktop\digital-health-app\apps\test-record.js
const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log('test-record.js: .env path:', path.resolve(__dirname, '../.env'));
console.log('test-record.js: DATABASE_URL:', process.env.DATABASE_URL || 'Undefined');

const prisma = new PrismaClient();

async function checkOrCreateRecord() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    // Check or create User
    let user = await prisma.user.findUnique({ where: { email: 'patient1@example.com' } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: 'user-001',
          email: 'patient1@example.com',
          password: 'hashedpassword', // Replace with actual hashed password
          firstname: 'John',
          lastname: 'Doe',
          role: 'PATIENT',
        },
      });
      console.log('User created:', user);
    } else {
      console.log('User found:', user);
    }

    // Check or create Patient
    let patient = await prisma.patient.findUnique({ where: { id: 'pat-001' } });
    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          id: 'pat-001',
          userId: user.id,
        },
      });
      console.log('Patient created:', patient);
    } else {
      console.log('Patient:', patient);
    }

    // Check or create LabResult
    let record = await prisma.labResult.findUnique({ where: { id: '124' } });
    if (!record) {
      record = await prisma.labResult.create({
        data: {
          id: '124',
          patientId: 'pat-001',
          type: 'lab',
          results: { description: 'Initial cholesterol test' },
          date: new Date('2023-01-01').toISOString(),
        },
      });
      console.log('LabResult created:', record);
    } else {
      console.log('LabResult:', record);
    }
  } catch (error) {
    console.error('Error checking/creating record:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrCreateRecord();