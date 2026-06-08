import { Router, Request, Response } from 'express';
import { prisma } from '../server';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { imageUrl, userId, latitude, longitude } = req.body;

  // Simulate 2-second AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Randomized AI results for the MVP
  const crops = [
    { name: "Maize", category: "CEREAL" },
    { name: "Orange", category: "FRUIT" },
    { name: "Tomato", category: "VEGETABLE" },
    { name: "Sorghum", category: "CEREAL" },
    { name: "Mango", category: "FRUIT" },
    { name: "Cabbage", category: "VEGETABLE" }
  ];
  
  const selectedCrop = crops[Math.floor(Math.random() * crops.length)];
  const pests = ["None", "Fall Armyworm", "Maize Lethal Necrosis", "Locusts", "Leaf Miner"];
  const healthPercentage = Math.floor(Math.random() * (100 - 40 + 1)) + 40;
  const detectedPest = pests[Math.floor(Math.random() * pests.length)];
  
  const recommendedAction = healthPercentage < 70 
    ? `Apply organic treatment for ${detectedPest} and increase irrigation.`
    : "Crop looks healthy. Continue standard maintenance.";

  try {
    // In a real scenario, we'd ensure the userId exists
    let user = await prisma.user.findFirst({
        where: { role: 'YOUTH_OFFICER' }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                phoneNumber: '26000000000',
                role: 'YOUTH_OFFICER',
                region: 'Lusaka'
            }
        });
    }

    const scan = await prisma.crop_Scan.create({
      data: {
        imageUrl: imageUrl || "https://placeholder.com/crop.jpg",
        detectedPest,
        healthPercentage,
        recommendedAction: `[${selectedCrop.category}] ${selectedCrop.name}: ${recommendedAction}`,
        latitude: latitude || -15.4, 
        longitude: longitude || 28.2,
        userId: user.id
      }
    });

    res.json({
      success: true,
      data: {
        ...scan,
        category: selectedCrop.category,
        cropName: selectedCrop.name
      },
      aiConfidence: "98.4%"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save scan result" });
  }
});

export default router;
