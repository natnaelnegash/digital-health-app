const jwt = require('jsonwebtoken');
const secret = 'mynewsecurekey123';
const providerToken = jwt.sign(
  { id: '0001', role: 'PROVIDER' },
  secret,
  { expiresIn: '1y' }
);
const patientToken = jwt.sign(
  { id: '0002', role: 'PATIENT' },
  secret,
  { expiresIn: '1y' }
);
console.log('Provider Token:', providerToken);
console.log('Patient Token:', patientToken);