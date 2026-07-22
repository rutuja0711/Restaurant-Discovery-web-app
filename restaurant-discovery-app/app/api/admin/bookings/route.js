import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(request) {
  const token = request.cookies.get('admin_session')?.value;
  const adminId = verifyAdminToken(token);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get('restaurantId');

  const bookings = await prisma.booking.findMany({
    where: {
      restaurant: { ownerId: adminId },
      ...(restaurantId ? { restaurantId: Number(restaurantId) } : {}),
    },
    include: {
      restaurant: { select: { id: true, name: true } },
      table: { select: { id: true, tableNumber: true } },
    },
    orderBy: { slotStart: 'desc' },
  });

  return NextResponse.json(bookings);
}
