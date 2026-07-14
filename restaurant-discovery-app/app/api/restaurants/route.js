import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const location = searchParams.get('location');
  const cuisine = searchParams.get('cuisine');

  const restaurants = await prisma.restaurant.findMany({
    where: {
      name: search ? { contains: search, mode: 'insensitive' } : undefined,
      location: location || undefined,
      cuisine: cuisine || undefined,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(restaurants);
}

export async function POST(request) {
  const body = await request.json();

  if (!body.name || !body.cuisine || !body.location) {
    return NextResponse.json({ error: 'name, cuisine and location are required' }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.create({ data: body });
  return NextResponse.json(restaurant, { status: 201 });
}