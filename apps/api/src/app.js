const express = require('express');
const { PrismaClient } = require('@prisma/client');
const patientRoutes = require('./routes/patient');
const providerRoutes = require('./routes/provider');
const authRoutes = require('./routes/auth');
const wearableService = require('./services/wearableService');
const cron = require('node-cron');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Add root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.use('/api/auth', authRoutes); // Unprotected
app.use('/api/patient', require('./middlewares/auth'), patientRoutes); // Protected
app.use('/api/provider', require('./middlewares/auth'), providerRoutes); // Protected

cron.schedule('*/5 * * * *', () => {
  wearableService.importHealthData();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));