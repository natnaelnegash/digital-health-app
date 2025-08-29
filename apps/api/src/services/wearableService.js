const axios = require('axios');
   const { PrismaClient } = require('@prisma/client');

   const prisma = new PrismaClient();

   const FITBIT_API_BASE = 'https://api.fitbit.com/1/user/-/';
   const FITBIT_TOKEN_URL = 'https://api.fitbit.com/oauth2/token';

   // Encode client ID and secret for Basic Auth
   const getBasicAuth = () => {
     const clientId = process.env.FITBIT_CLIENT_ID;
     const clientSecret = process.env.FITBIT_CLIENT_SECRET;
     return Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
   };

   // Refresh Fitbit access token
   async function refreshAccessToken(userId) {
     try {
       const tokenRecord = await prisma.fitbitToken.findUnique({
         where: { userId },
       });
       if (!tokenRecord) throw new Error('No Fitbit token found');

       const response = await axios.post(
         FITBIT_TOKEN_URL,
         new URLSearchParams({
           grant_type: 'refresh_token',
           refresh_token: tokenRecord.refreshToken,
         }),
         {
           headers: {
             Authorization: `Basic ${getBasicAuth()}`,
             'Content-Type': 'application/x-www-form-urlencoded',
           },
         }
       );

       const { access_token, refresh_token, expires_in } = response.data;
       const expiresAt = Math.floor(Date.now() / 1000) + expires_in;

       await prisma.fitbitToken.update({
         where: { userId },
         data: {
           accessToken: access_token,
           refreshToken: refresh_token,
           expiresAt,
           updatedAt: new Date(),
         },
       });

       return access_token;
     } catch (error) {
       console.error(`Failed to refresh token for user ${userId}:`, error.message);
       throw error;
     }
   }

   // Fetch Fitbit data (e.g., steps, heart rate, sleep)
   async function fetchFitbitData(userId, endpoint, date) {
     try {
       let tokenRecord = await prisma.fitbitToken.findUnique({
         where: { userId },
       });
       if (!tokenRecord) throw new Error('No Fitbit token found');

       // Check if token is expired
       if (tokenRecord.expiresAt < Math.floor(Date.now() / 1000)) {
         tokenRecord.accessToken = await refreshAccessToken(userId);
       }

       const response = await axios.get(`${FITBIT_API_BASE}${endpoint}`, {
         headers: {
           Authorization: `Bearer ${tokenRecord.accessToken}`,
           'Accept-Language': 'en_US',
         },
       });

       return response.data;
     } catch (error) {
       console.error(`Failed to fetch ${endpoint} for user ${userId}:`, error.message);
       throw error;
     }
   }

   // Import health data for all users with Fitbit tokens
   async function importHealthData() {
     try {
       const users = await prisma.fitbitToken.findMany({
         include: { user: true },
       });

       const date = new Date().toISOString().split('T')[0]; // Today's date (YYYY-MM-DD)

       for (const { userId } of users) {
         // Fetch steps
         const stepsData = await fetchFitbitData(userId, `activities/date/${date}.json`);
         if (stepsData.summary?.steps) {
           await prisma.healthData.create({
             data: {
               userId,
               type: 'steps',
               value: { steps: stepsData.summary.steps },
               date: new Date(date),
             },
           });
         }

         // Fetch heart rate (intraday, requires Personal app type)
         const heartRateData = await fetchFitbitData(userId, `activities/heart/date/${date}/1d/1min.json`);
         if (heartRateData['activities-heart-intraday']?.dataset) {
           await prisma.healthData.create({
             data: {
               userId,
               type: 'heart_rate',
               value: heartRateData['activities-heart-intraday'].dataset,
               date: new Date(date),
             },
           });
         }

         // Fetch sleep
         const sleepData = await fetchFitbitData(userId, `sleep/date/${date}.json`);
         if (sleepData.sleep?.length > 0) {
           await prisma.healthData.create({
             data: {
               userId,
               type: 'sleep',
               value: sleepData.sleep[0],
               date: new Date(date),
             },
           });
         }
       }

       console.log('Health data imported successfully');
     } catch (error) {
       console.error('Error importing health data:', error.message);
     }
   }

   module.exports = { importHealthData };