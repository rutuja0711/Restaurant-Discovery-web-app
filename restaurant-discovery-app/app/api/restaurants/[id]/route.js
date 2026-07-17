import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifySuperadminToken } from '@/lib/auth';

export async function GET(request, { params }) {
  const { id } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: Number(id) },
    include: { images: true, menuItems: true, reviews: { orderBy: { createdAt: 'desc' } } },
  });

  if (!restaurant) {
    return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
  }
  return NextResponse.json(restaurant);
}

export async function PUT(request, { params }) {
  const token = request.cookies.get('superadmin_session')?.value;
  if (!verifySuperadminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  if (!body.name || !body.cuisine || !body.location) {
    return NextResponse.json({ error: 'name, cuisine and location are required' }, { status: 400 });
  }

  const { imageUrls, menuItems, ...restaurantData } = body;

  const restaurant = await prisma.restaurant.update({
    where: { id: Number(id) },
    data: {
      ...restaurantData,
      images: {
        deleteMany: {},
        create: imageUrls?.length
          ? imageUrls.map((url, i) => ({ imageUrl: url, isPrimary: i === 0 }))
          : [],
      },
      menuItems: {
        deleteMany: {},
        create: menuItems?.length ? menuItems : [],
      },
    },
  });
  return NextResponse.json(restaurant);
}

export async function DELETE(request, { params }) {
  const token = request.cookies.get('superadmin_session')?.value;
  if (!verifySuperadminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await prisma.restaurant.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
