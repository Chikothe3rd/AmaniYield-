import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMarketplace() {
  console.log('🌱 Seeding Marketplace Listings...');

  // Ensure we have a farmer/seller
  let seller = await prisma.user.findFirst({
    where: { role: 'FARMER' }
  });

  if (!seller) {
    seller = await prisma.user.create({
      data: {
        phoneNumber: '+260977000100',
        role: 'FARMER',
        region: 'Southern',
      }
    });
  }

  const listings = [
    { seedlingType: 'Mopane Saplings', quantity: 120, priceZMW: 450, sellerId: seller.id },
    { seedlingType: 'Acacia Nioltica', quantity: 85, priceZMW: 320, sellerId: seller.id },
    { seedlingType: 'Baobab Starters', quantity: 40, priceZMW: 1200, sellerId: seller.id },
    { seedlingType: 'Indigenous Mix', quantity: 200, priceZMW: 600, sellerId: seller.id },
  ];

  for (const listing of listings) {
    await prisma.marketplace_Listing.create({
      data: listing
    });
  }

  console.log('✅ Marketplace seeded successfully.');
}

seedMarketplace()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
