const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const patientRoutes = require('./routes/patient');
const providerRoutes = require('./routes/provider');
const authRoutes = require('./routes/auth');
const wearableService = require('./services/wearableService');
const cron = require('node-cron');
const authMiddleware = require('./middlewares/auth');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const prisma = new PrismaClient();

console.log('app.js: JWT_SECRET loaded:', !!process.env.JWT_SECRET);
console.log('app.js: JWT_SECRET value:', process.env.JWT_SECRET || 'Undefined');
console.log('app.js: DATABASE_URL loaded:', !!process.env.DATABASE_URL);

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/', (req, res) => {
  console.log('app.js: GET / accessed, JWT_SECRET:', process.env.JWT_SECRET || 'Undefined');
  res.json({ message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', authMiddleware, patientRoutes);
app.use('/api/provider', authMiddleware, providerRoutes);

cron.schedule('*/5 * * * *', () => {
  console.log('app.js: Running wearable data import...');
  wearableService.importHealthData();
});

app.use((err, req, res, next) => {
  console.error('app.js: Server error:', err.message, err.stack);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app.js: Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('app.js: Server startup error:', err.message, err.stack);
});