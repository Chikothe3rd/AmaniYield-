import { Router, Request, Response } from 'express';
import { prisma } from '../server';

const router = Router();

// Fetch all available listings
router.get('/', async (req: Request, res: Response) => {
  try {
    const listings = await prisma.marketplace_Listing.findMany({
      where: { status: 'AVAILABLE' },
      include: { seller: true }
    });
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// Simulate a "Buy Now" transaction
router.post('/buy', async (req: Request, res: Response) => {
  const { listingId } = req.body;

  try {
    const updatedListing = await prisma.marketplace_Listing.update({
      where: { id: listingId },
      data: { status: 'SOLD' }
    });

    res.json({
      success: true,
      message: `Successfully purchased ${updatedListing.seedlingType}!`,
      data: updatedListing
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Transaction failed. Item may no longer be available." });
  }
});

export default router;
