import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(request) {
  const token = request.cookies.get('admin_session')?.value;
  const adminId = verifyAdminToken(token);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const restaurantId = Number(searchParams.get('restaurantId'));

  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant || restaurant.ownerId !== adminId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const tables = await prisma.restaurantTable.findMany({ where: { restaurantId } });
  return NextResponse.json(tables);
}

export async function POST(request) {
  const token = request.cookies.get('admin_session')?.value;
  const adminId = verifyAdminToken(token);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { restaurantId, tableNumber, capacity } = await request.json();

  const restaurant = await prisma.restaurant.findUnique({ where: { id: Number(restaurantId) } });
  if (!restaurant || restaurant.ownerId !== adminId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (!tableNumber?.trim() || !capacity) {
    return NextResponse.json({ error: 'Table number and capacity are required' }, { status: 400 });
  }

  const table = await prisma.restaurantTable.create({
    data: { restaurantId: Number(restaurantId), tableNumber: tableNumber.trim(), capacity: Number(capacity) },
  });
  return NextResponse.json(table, { status: 201 });
}
