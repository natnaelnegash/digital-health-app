const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cuid = require('cuid');

const router = express.Router();
const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email }); // Debug log
  try {
    if (!email || !password) {
      console.error('Login error: Email and password are required');
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        patient: { select: { id: true } },
        provider: { select: { id: true } },
      },
    });
    if (!user) {
      console.error('Login error: User not found for email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error('Login error: Invalid password for email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role, providerId: user.provider?.id || null },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('Login successful, token generated:', { userId: user.id, role: user.role, token }); // Debug log
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        patientId: user.patient?.id || null,
        providerId: user.provider?.id || null,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.post('/register', async (req, res) => {
  console.log('Received /register request:', req.body); // Debug log
  const { email, password, role, firstname, lastname } = req.body;
  try {
    if (!email || !password || !role) {
      console.error('Register error: Email, password, and role are required');
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }
    const validRoles = ['PATIENT', 'PROVIDER'];
    if (!validRoles.includes(role)) {
      console.error('Register error: Invalid role:', role);
      return res.status(400).json({ error: 'Invalid role. Must be PATIENT or PROVIDER' });
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        id: cuid(),
        email,
        password: hashedPassword,
        role,
        firstname,
        lastname,
        patient: role === 'PATIENT' ? { create: { id: cuid() } } : undefined,
        provider: role === 'PROVIDER' ? { create: { id: cuid() } } : undefined,
      },
      include: { patient: true, provider: true },
    });
    console.log('User registered:', { id: user.id, email, role }); // Debug log
    res.json({
      message: 'User created',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        patientId: user.patient?.id || null,
        providerId: user.provider?.id || null,
      },
    });
  } catch (error) {
    console.error('Register error:', error.message, error.stack);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

router.get('/fitbit', (req, res) => {
  const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${process.env.FITBIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.FITBIT_REDIRECT_URI)}&scope=activity+heartrate+sleep&expires_in=604800`;
  console.log('Redirecting to Fitbit auth:', authUrl); // Debug log
  res.redirect(authUrl);
});

router.get('/fitbit/callback', async (req, res) => {
  const { code } = req.query;
  console.log('Fitbit callback received:', { code }); // Debug log
  if (!code) {
    console.error('Fitbit callback error: No authorization code provided');
    return res.status(400).json({ error: 'No authorization code provided' });
  }
  try {
    const response = await require('axios').post(
      'https://api.fitbit.com/oauth2/token',
      new URLSearchParams({
        client_id: process.env.FITBIT_CLIENT_ID,
        grant_type: 'authorization_code',
        redirect_uri: process.env.FITBIT_REDIRECT_URI,
        code,
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const { access_token, refresh_token, expires_in, user_id } = response.data;
    const expiresAt = Math.floor(Date.now() / 1000) + expires_in;
    const user = await prisma.user.findFirst({ where: { email: 'dawit@example.com' } }); // Updated email
    if (!user) {
      console.error('Fitbit callback error: User not found for email: dawit@example.com');
      return res.status(404).json({ error: 'User not found' });
    }
    await prisma.fitbitToken.upsert({
      where: { userId: user.id },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log('Fitbit tokens saved for user:', user.id); // Debug log
    res.json({ message: 'Fitbit connected successfully' });
  } catch (error) {
    console.error('Fitbit callback error:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to connect Fitbit', details: error.message });
  }
});

module.exports = router;