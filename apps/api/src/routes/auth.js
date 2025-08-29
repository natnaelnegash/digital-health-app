const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cuid = require('cuid'); // Simplified import name

const router = express.Router();
const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        patient: { select: { id: true } },
        provider: { select: { id: true } },
      },
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
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
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/signup', async (req, res) => {
  const { email, password, role, firstname, lastname } = req.body;
  try {
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }
    const validRoles = ['PATIENT', 'PROVIDER'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be PATIENT or PROVIDER' });
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        id: cuid(), // Use cuid directly
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
    res.json({ message: 'User created', user });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

router.get('/fitbit', (req, res) => {
  const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${process.env.FITBIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.FITBIT_REDIRECT_URI)}&scope=activity+heartrate+sleep&expires_in=604800`;
  res.redirect(authUrl);
});

router.get('/fitbit/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
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
    const user = await prisma.user.findFirst({ where: { email: 'test4@example.com' } });
    if (!user) {
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
    res.json({ message: 'Fitbit connected successfully' });
  } catch (error) {
    console.error('Fitbit callback error:', error.message);
    res.status(500).json({ error: 'Failed to connect Fitbit' });
  }
});

module.exports = router;