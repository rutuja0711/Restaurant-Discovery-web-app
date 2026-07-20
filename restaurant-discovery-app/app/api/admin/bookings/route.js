import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(request) {
  const token = request.cookies.get('admin_session')?.value;
  const adminId = verifyAdminToken(token);
  if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const bookings = await prisma.booking.findMany({
    where: { restaurant: { ownerId: adminId } },
    include: { restaurant: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(bookings);
}
