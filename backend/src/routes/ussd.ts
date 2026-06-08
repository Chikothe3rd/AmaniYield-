import { Router, Request, Response } from 'express';
import { prisma } from '../server';
import { calculateDistance, REGION_COORDINATES } from '../utils/geo';
import { getPlantingAdvice } from '../utils/weather';
import { sendSMS } from '../utils/sms';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Missing phoneNumber' });
  }

  let response = '';

  // 1. Check if user exists
  let user = await prisma.user.findUnique({ where: { phoneNumber } });

  // 2. Handle Onboarding for New Users
  if (!user) {
    const levels = (text || '').split('*');
    
    if (text === '' || text === undefined) {
      response = `CON Welcome to AmaniYield.
Please select your role:
1. Farmer
2. Herder`;
    } 
    else if (levels.length === 1) {
      const roleChoice = levels[0];
      const role = roleChoice === '1' ? 'FARMER' : 'HERDER';
      response = `CON Select your region:
1. Lusaka
2. Chipata
3. Livingstone
4. Ndola`;
    } 
    else if (levels.length === 2) {
      const roleChoice = levels[0];
      const regionChoice = levels[1];
      
      const role = roleChoice === '1' ? 'FARMER' : 'HERDER';
      const regions = ['Lusaka', 'Chipata', 'Livingstone', 'Ndola'];
      const region = regions[parseInt(regionChoice) - 1] || 'Lusaka';

      await prisma.user.create({
        data: {
          phoneNumber,
          role,
          region
        }
      });

      response = `END Registration successful!
Role: ${role}
Region: ${region}
Please dial again to access services.`;
    }
    else {
      response = `END Invalid input. Please try again.`;
    }

    res.set('Content-Type', 'text/plain');
    return res.send(response);
  }

  // 3. Main Menu for Registered Users
  const safeText = text || '';
  const levels = safeText.split('*');
  const mainOption = levels[0];

  if (safeText === '') {
    response = `CON Welcome back to AmaniYield
1. Report Dry Borehole
2. Request Safe Route (Pastoralist)
3. Planting Advice`;
  } 
  
  else if (mainOption === '1') {
    // Option 1: Report a dry borehole
    if (levels.length === 1) {
      response = `CON Confirm reporting dry borehole in your current region?
1. Yes
2. No`;
    } else if (levels[1] === '1') {
      try {
        const coords = REGION_COORDINATES[user!.region] || REGION_COORDINATES['Lusaka'];

        await prisma.uSSD_Report.create({
          data: {
            resourceType: 'WATER',
            status: 'DRY',
            latitude: coords.lat,
            longitude: coords.lng,
            userId: user!.id
          }
        });
        response = `END Thank you. Your report has been logged. Authorities have been notified.`;
      } catch (err) {
        console.error(err);
        response = `END Error logging report. Please try again later.`;
      }
    } else {
      response = `END Report cancelled.`;
    }
  }

  else if (mainOption === '2') {
    // Option 2: Pastoralist routing (Nearest Resource Logic)
    try {
      const userCoords = user ? (REGION_COORDINATES[user.region] || REGION_COORDINATES['Lusaka']) : REGION_COORDINATES['Lusaka'];

      const activeRoutes = await prisma.safe_Route.findMany({
        where: { status: 'ACTIVE' }
      });

      if (activeRoutes.length > 0) {
        // Find the nearest route
        let nearestRoute = activeRoutes[0];
        let minDistance = calculateDistance(
          userCoords.lat, userCoords.lng,
          nearestRoute.destination_lat, nearestRoute.destination_lng
        );

        for (const route of activeRoutes) {
          const dist = calculateDistance(
            userCoords.lat, userCoords.lng,
            route.destination_lat, route.destination_lng
          );
          if (dist < minDistance) {
            minDistance = dist;
            nearestRoute = route;
          }
        }

        response = `END Nearest safe water found (${minDistance.toFixed(1)}km away). Coordinates sent via SMS.`;
        
        // Dispatch Real SMS Protocol
        const smsMessage = `Safe water located at ${nearestRoute.destination_lat}, ${nearestRoute.destination_lng}. Distance: ${minDistance.toFixed(1)}km. Status: VERIFIED.`;
        await sendSMS(phoneNumber, smsMessage);
      } else {
        response = `END No safe routes currently available for your region. Stay safe.`;
      }

    } catch (err) {
      console.error(err);
      response = `END Error fetching routes. Please try again.`;
    }
  }

  else if (mainOption === '3') {
    // Option 3: Planting Advice (Weather-Driven)
    try {
      const region = user ? user.region : 'Lusaka';
      const advice = await getPlantingAdvice(region);

      response = `END AmaniYield Advice (${region}):
Forecast: ${advice.precipitation_forecast}
${advice.advice}`;
    } catch (err) {
      console.error(err);
      response = `END Error fetching weather data. Please try again.`;
    }
  }

  else {
    response = `END Invalid option. Please try again.`;
  }

  res.set('Content-Type', 'text/plain');
  res.send(response);
});

export default router;
