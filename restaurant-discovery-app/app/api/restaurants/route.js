import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const location = searchParams.get('location');
  const cuisine = searchParams.get('cuisine');

  const restaurants = await prisma.restaurant.findMany({
    where: {
      name: search ? { contains: search, mode: 'insensitive' } : undefined,
      location: location || undefined,
      cuisine: cuisine ? { contains: cuisine, mode: 'insensitive' } : undefined,
    },
    include: { images: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(restaurants);
}

export async function POST(request) {
  const token = request.cookies.get('admin_session')?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  if (!body.name || !body.cuisine || !body.location) {
    return NextResponse.json({ error: 'name, cuisine and location are required' }, { status: 400 });
  }

  const { imageUrls, menuItems, ...restaurantData } = body;

  const restaurant = await prisma.restaurant.create({
    data: {
      ...restaurantData,
      images: imageUrls?.length
        ? { create: imageUrls.map((url, i) => ({ imageUrl: url, isPrimary: i === 0 })) }
        : undefined,
      menuItems: menuItems?.length ? { create: menuItems } : undefined,
    },
  });

  return NextResponse.json(restaurant, { status: 201 });
}
