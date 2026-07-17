import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

async function checkOwnership(id, adminId) {
  const restaurant = await prisma.restaurant.findUnique({ where: { id: Number(id) } });
  return restaurant && restaurant.ownerId === adminId ? restaurant : null;
}

export async function GET(request, { params }) {
  const token = request.cookies.get('admin_session')?.value;
  const adminId = verifyAdminToken(token);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const owned = await checkOwnership(id, adminId);
  if (!owned) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: Number(id) },
    include: { images: true, menuItems: true, reviews: { orderBy: { createdAt: 'desc' } } },
  });
  return NextResponse.json(restaurant);
}

export async function PUT(request, { params }) {
  const token = request.cookies.get('admin_session')?.value;
  const adminId = verifyAdminToken(token);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const owned = await checkOwnership(id, adminId);
  if (!owned) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await request.json();
  if (!body.name || !body.cuisine || !body.location) {
    return NextResponse.json({ error: 'name, cuisine and location are required' }, { status: 400 });
  }

  const { imageUrls, menuItems, ...restaurantData } = body;

  const restaurant = await prisma.restaurant.update({
    where: { id: Number(id) },
    data: {
      ...restaurantData,
      images: { deleteMany: {}, create: imageUrls?.length ? imageUrls.map((url, i) => ({ imageUrl: url, isPrimary: i === 0 })) : [] },
      menuItems: { deleteMany: {}, create: menuItems?.length ? menuItems : [] },
    },
  });
  return NextResponse.json(restaurant);
}

export async function DELETE(request, { params }) {
  const token = request.cookies.get('admin_session')?.value;
  const adminId = verifyAdminToken(token);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const owned = await checkOwnership(id, adminId);
  if (!owned) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.restaurant.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
