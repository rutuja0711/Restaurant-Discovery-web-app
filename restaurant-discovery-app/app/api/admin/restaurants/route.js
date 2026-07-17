import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { geocodeAddress } from '@/lib/geocode';

export async function GET(request) {
  const token = request.cookies.get('admin_session')?.value;
  const adminId = verifyAdminToken(token);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const restaurants = await prisma.restaurant.findMany({
    where: { ownerId: adminId },
    include: { images: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(restaurants);
}

export async function POST(request) {
  const token = request.cookies.get('admin_session')?.value;
  const adminId = verifyAdminToken(token);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  if (!body.name || !body.cuisine || !body.location) {
    return NextResponse.json({ error: 'name, cuisine and location are required' }, { status: 400 });
  }

  const { imageUrls, menuItems, ...restaurantData } = body;

  if (!restaurantData.latitude || !restaurantData.longitude) {
    const fullAddress = `${restaurantData.address}, ${restaurantData.location}`;
    const coords = await geocodeAddress(fullAddress);
    if (coords) {
      restaurantData.latitude = coords.lat;
      restaurantData.longitude = coords.lng;
    }
  }

  const restaurant = await prisma.restaurant.create({
    data: {
      ...restaurantData,
      ownerId: adminId,
      images: imageUrls?.length ? { create: imageUrls.map((url, i) => ({ imageUrl: url, isPrimary: i === 0 })) } : undefined,
      menuItems: menuItems?.length ? { create: menuItems } : undefined,
    },
  });
  return NextResponse.json(restaurant, { status: 201 });
}
