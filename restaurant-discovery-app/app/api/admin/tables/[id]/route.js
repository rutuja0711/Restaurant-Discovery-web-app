import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

async function checkOwnership(id, adminId) {
  const table = await prisma.restaurantTable.findUnique({
    where: { id: Number(id) },
    include: { restaurant: true },
  });
  return table && table.restaurant.ownerId === adminId ? table : null;
}

export async function PUT(request, { params }) {
  const token = request.cookies.get('admin_session')?.value;
  const adminId = verifyAdminToken(token);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const owned = await checkOwnership(id, adminId);
  if (!owned) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { tableNumber, capacity, isIndoor, isVip, isActive } = await request.json();

  if (!tableNumber?.trim() || !capacity) {
    return NextResponse.json({ error: 'Table number and capacity are required' }, { status: 400 });
  }

  const table = await prisma.restaurantTable.update({
    where: { id: Number(id) },
    data: {
      tableNumber: tableNumber.trim(),
      capacity: Number(capacity),
      isIndoor: Boolean(isIndoor),
      isVip: Boolean(isVip),
      isActive: Boolean(isActive),
    },
  });
  return NextResponse.json(table);
}

export async function DELETE(request, { params }) {
  const token = request.cookies.get('admin_session')?.value;
  const adminId = verifyAdminToken(token);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const owned = await checkOwnership(id, adminId);
  if (!owned) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.restaurantTable.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
