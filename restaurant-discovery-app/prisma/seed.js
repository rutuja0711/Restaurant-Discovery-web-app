const { PrismaClient } = require('../app/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  await prisma.restaurant.deleteMany();

  await prisma.restaurant.createMany({
    data: [
      { name: 'Spice Junction', cuisine: 'North Indian', location: 'Nashik', address: '12 College Road', priceRange: '₹300-600', rating: 4.3, description: 'Butter chicken and fresh tandoori.', openingHours: '11 AM - 11 PM', contactNumber: '0253-1234567' },
      { name: 'Bella Pasta', cuisine: 'Italian', location: 'Nashik', address: '45 Gangapur Road', priceRange: '₹500-900', rating: 4.6, description: 'Wood-fired pizza, handmade pasta.', openingHours: '12 PM - 10:30 PM', contactNumber: '0253-2345678' },
      { name: 'Dragon Wok', cuisine: 'Chinese', location: 'Pune', address: '8 FC Road', priceRange: '₹250-500', rating: 4.1, description: 'Indo-Chinese, famous hakka noodles.', openingHours: '11:30 AM - 11 PM', contactNumber: '020-3456789' },
      { name: 'Coastal Curry House', cuisine: 'South Indian', location: 'Pune', address: '21 Koregaon Park', priceRange: '₹200-450', rating: 4.4, description: 'Fish curry, dosas, coconut specialties.', openingHours: '8 AM - 10 PM', contactNumber: '020-4567890' },
      { name: 'Burger Barn', cuisine: 'American', location: 'Mumbai', address: '3 Linking Road', priceRange: '₹300-550', rating: 4.0, description: 'Stacked burgers, loaded fries.', openingHours: '12 PM - 12 AM', contactNumber: '022-5678901' },
    ],
  });

  console.log('Seeded 5 restaurants');
}

main().finally(() => prisma.$disconnect());